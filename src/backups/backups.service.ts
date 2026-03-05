import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { spawn } from 'child_process';
import * as archiver from 'archiver';
import { PassThrough } from 'stream';
import axios from 'axios';

@Injectable()
export class BackupsService {
  private readonly logger = new Logger(BackupsService.name);

  // раз в 3 дня (в 00:00)
  @Cron('0 0 */3 * *')
  async handleCron() {
    this.logger.log('Starting PostgreSQL backup...');
    try {
      await this.performBackup();
      this.logger.log('Backup completed successfully');
    } catch (e) {
      this.logger.error(
        'Backup failed',
        e instanceof Error ? e.stack : String(e),
      );
    }
  }

  private async performBackup(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dumpFileName = `backup-${timestamp}.dump`; // custom format
    const zipFileName = `backup-${timestamp}.zip`;

    const { archiveStream, waitForArchiveFinish } = this.createZipStream();

    // Стартуем pg_dump и пишем его stdout внутрь архива как файл dumpFileName
    const pgDump = this.spawnPgDumpCustom();

    // archiver.append(stream, { name }) — добавляет entry из потока
    const archive = (archiveStream as any).__archive as archiver.Archiver;
    archive.append(pgDump.stdout, { name: dumpFileName });

    // stderr логируем
    pgDump.stderr?.on('data', (d) => {
      const s = d.toString();
      // pg_dump иногда пишет прогресс/варнинги в stderr — это не всегда ошибка
      if (s.trim()) this.logger.warn(`pg_dump: ${s.trim()}`);
    });

    // Дождёмся завершения pg_dump
    const exitCode: number = await new Promise((resolve, reject) => {
      pgDump.on('error', reject);
      pgDump.on('close', resolve);
    });

    if (exitCode !== 0) {
      throw new Error(`pg_dump exited with code ${exitCode}`);
    }

    // Закрываем архив (финализируем zip)
    await new Promise<void>((resolve, reject) => {
      archive
        .finalize()
        .then(() => resolve())
        .catch(reject);
    });

    // Параллельно можно уже грузить archiveStream в Bunny
    await this.uploadStreamToBunny(archiveStream, zipFileName);

    // Дождаться, что zip реально завершился
    await waitForArchiveFinish();
  }

  private spawnPgDumpCustom() {
    const host = process.env.DB_HOST || 'database';
    const port = process.env.DB_PORT || '5432';
    const user = process.env.DB_USER;
    const database = process.env.DB_DBNAME;

    if (!user || !database) {
      throw new Error('DB_USER or DB_DBNAME not set');
    }

    // Custom format + переносимость
    const args = [
      '-h',
      host,
      '-p',
      String(port),
      '-U',
      user,
      '-d',
      database,
      '-F',
      'c',
      '--no-owner',
      '--no-privileges',
      // '--verbose', // включи если хочешь больше логов
    ];

    const env = { ...process.env, PGPASSWORD: process.env.DB_PASSWORD || '' };

    this.logger.log(
      `Running pg_dump (custom) for "${database}" on ${host}:${port}...`,
    );

    // stdout будет binary stream дампа
    return spawn('pg_dump', args, { env });
  }

  private createZipStream(): {
    archiveStream: PassThrough;
    waitForArchiveFinish: () => Promise<void>;
  } {
    const pass = new PassThrough();
    const archive = archiver('zip', { zlib: { level: 9 } });

    // хак: чтобы достать архиватор снаружи без хранения поля в классе
    (pass as any).__archive = archive;

    archive.on('warning', (err) => {
      // ENOENT можно игнорировать, остальные — логируем
      this.logger.warn(`archiver warning: ${err.message}`);
    });

    const finished = new Promise<void>((resolve, reject) => {
      pass.on('end', resolve);
      pass.on('close', resolve);
      pass.on('error', reject);
      archive.on('error', reject);
    });

    archive.pipe(pass);

    return { archiveStream: pass, waitForArchiveFinish: () => finished };
  }

  private async uploadStreamToBunny(
    stream: NodeJS.ReadableStream,
    fileName: string,
  ) {
    const storageZone = process.env.BUNNY_CDN_STORAGE_ZONE;
    const accessKey = process.env.BUNNY_CDN_API_KEY;
    const storageRegion = process.env.BUNNY_CDN_STORAGE_REGION || 'storage';

    if (!storageZone || !accessKey) {
      throw new Error(
        'Bunny credentials not configured (BUNNY_CDN_STORAGE_ZONE, BUNNY_CDN_API_KEY)',
      );
    }

    const url = `https://${storageRegion}.bunnycdn.com/${storageZone}/backups/${fileName}`;
    this.logger.log(`Uploading "${fileName}" to Bunny...`);

    await axios.put(url, stream, {
      headers: {
        AccessKey: accessKey,
        'Content-Type': 'application/octet-stream',
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    this.logger.log(`Uploaded: ${url}`);
  }
}
