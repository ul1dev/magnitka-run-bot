import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { Readable } from 'node:stream';

@Injectable()
export class S3StorageService {
  private readonly client: S3Client;
  private readonly endpoint: string;
  private readonly region: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly hotBucket: string;
  private readonly coldBucket: string;

  constructor(private readonly config: ConfigService) {
    this.endpoint = (
      this.config.get<string>('TWC_S3_ENDPOINT') ?? 'https://s3.twcstorage.ru'
    ).replace(/\/+$/, '');
    this.region = this.config.get<string>('TWC_S3_REGION') ?? 'ru-1';
    this.accessKey = this.config.get<string>('TWC_S3_ACCESS_KEY') ?? '';
    this.secretKey = this.config.get<string>('TWC_S3_SECRET_KEY') ?? '';
    this.hotBucket = this.config.get<string>('TWC_S3_HOT_BUCKET') ?? '';
    this.coldBucket = this.config.get<string>('TWC_S3_COLD_BUCKET') ?? '';

    if (!this.accessKey || !this.secretKey) {
      throw new Error('TWC S3 credentials not configured (TWC_S3_ACCESS_KEY, TWC_S3_SECRET_KEY)');
    }
    if (!this.hotBucket || !this.coldBucket) {
      throw new Error('TWC S3 buckets not configured (TWC_S3_HOT_BUCKET, TWC_S3_COLD_BUCKET)');
    }

    this.client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });
  }

  getPublicUrl(bucket: string, key: string) {
    const normalizedKey = key.replace(/^\/+/, '');
    return `${this.endpoint}/${bucket}/${normalizedKey}`;
  }

  async uploadStatic(
    file: Express.Multer.File,
    prefix = 'static',
  ): Promise<string> {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.bin';
    const key = `${prefix}/${randomUUID()}${ext}`;

    const body = file.buffer;
    if (!body) {
      throw new Error(
        'Uploaded file has no data buffer (multer must use memory storage)',
      );
    }

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.hotBucket,
        Key: key,
        Body: body,
        ContentType: file.mimetype || 'application/octet-stream',
      }),
    );

    return this.getPublicUrl(this.hotBucket, key);
  }

  async uploadBackupZip(stream: Readable, fileName: string): Promise<string> {
    const key = `backups/${fileName}`;
    await new Upload({
      client: this.client,
      params: {
        Bucket: this.coldBucket,
        Key: key,
        Body: stream,
        ContentType: 'application/zip',
      },
    }).done();

    return this.getPublicUrl(this.coldBucket, key);
  }

  async deleteByPublicPath(publicPath?: string | null): Promise<void> {
    if (!publicPath) return;

    const parsed = this.parsePublicPath(publicPath);
    if (!parsed) return;

    const { bucket, key } = parsed;
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  }

  private parsePublicPath(
    input: string,
  ): { bucket: string; key: string } | null {
    // 1) absolute URL: https://s3.twcstorage.ru/<bucket>/<key>
    try {
      const u = new URL(input);
      const pathname = u.pathname || '';
      const parts = pathname.replace(/^\/+/, '').split('/');
      if (parts.length >= 2) {
        const bucket = parts[0];
        const key = parts.slice(1).join('/');
        if (bucket === this.hotBucket || bucket === this.coldBucket)
          return { bucket, key };
      }
    } catch {
      // ignore
    }

    // 2) legacy relative: /static/<filename> -> assume hot bucket
    const m = input.match(/^\/?static\/(.+)$/i);
    if (m) return { bucket: this.hotBucket, key: `static/${m[1]}` };

    return null;
  }
}
