import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Client, ConnectConfig } from 'ssh2';
import * as streamBuffers from 'stream-buffers';
import * as archiver from 'archiver';

@Injectable()
export class BackupsService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  @Cron('0 * * * *')
  async handleCron() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup-${timestamp}.sql`;
      const zipFileName = `backup-${timestamp}.zip`;

      const sshConfig: ConnectConfig = {
        host: process.env.SERVER_IP,
        port: Number(process.env.SERVER_PORT) || 22,
        username: process.env.SERVER_USER,
        password: process.env.SERVER_PASSWORD,
      };

      const mysqlUser = process.env.MYSQL_USERNAME;
      const mysqlPassword = process.env.MYSQL_PASSWORD;
      const database = process.env.MYSQL_DBNAME;
      const remoteBackupDir = process.env.BACKUPS_PATH || '/tmp';
      const remoteBackupFile = `${remoteBackupDir}/${backupFileName}`;

      const conn = new Client();

      conn
        .on('ready', () => {
          console.log('SSH connection established');

          const dumpCommand = `mysqldump -u ${mysqlUser} -p'${mysqlPassword}' ${database} > '${remoteBackupFile}'`;

          conn.exec(dumpCommand, (err, stream) => {
            if (err) {
              console.error(`Error executing mysqldump: ${err.message}`);
              // Continue execution even if an error occurs
              this.compressAndSendFile(sshConfig, remoteBackupFile, zipFileName)
                .then(() => conn.end())
                .catch((error) => {
                  console.error(
                    `Error compressing or sending file: ${error.message}`,
                  );
                  conn.end();
                });
            } else {
              stream
                .on('close', (code: number, signal: string) => {
                  console.log('mysqldump command completed');
                  // Proceed to compress and send the file regardless of exit code
                  this.compressAndSendFile(
                    sshConfig,
                    remoteBackupFile,
                    zipFileName,
                  )
                    .then(() => conn.end())
                    .catch((error) => {
                      console.error(
                        `Error compressing or sending file: ${error.message}`,
                      );
                      conn.end();
                    });
                })
                .on('data', (data: Buffer) => {
                  console.log('STDOUT:', data.toString());
                })
                .stderr.on('data', (data: Buffer) => {
                  console.error('STDERR:', data.toString());
                  // Ignore warnings and continue execution
                });
            }
          });
        })
        .on('error', (err) => {
          console.error(`SSH connection error: ${err.message}`);
        })
        .connect(sshConfig);
    } catch (e) {
      console.error('BACKUPS ERROR:', e);
    }
  }

  private async compressAndSendFile(
    sshConfig: ConnectConfig,
    remoteFilePath: string,
    zipFileName: string,
  ) {
    return new Promise<void>((resolve, reject) => {
      const conn = new Client();
      conn
        .on('ready', () => {
          conn.sftp((err, sftp) => {
            if (err) {
              console.error(`SFTP session error: ${err.message}`);
              reject(err);
              conn.end();
              return;
            }

            const readStream = sftp.createReadStream(remoteFilePath);

            readStream.on('error', (err) => {
              console.error(`Error reading file: ${err.message}`);
              reject(err);
              conn.end();
            });

            // Create a buffer to store the ZIP archive
            const zipBuffer = new streamBuffers.WritableStreamBuffer();

            // Create ZIP archive
            const archive = archiver('zip', {
              zlib: { level: 9 }, // Set compression level
            });

            // Handle archive errors
            archive.on('error', (err) => {
              console.error(`Archiving error: ${err.message}`);
              reject(err);
              conn.end();
            });

            // Pipe archive data to the buffer
            archive.pipe(zipBuffer);

            // Append the SQL file to the archive
            archive.append(readStream, {
              name: remoteFilePath.split('/').pop(),
            });

            // Finalize the archive
            archive.finalize();

            // When the archive is ready
            zipBuffer.on('finish', async () => {
              try {
                const chatId = process.env.BACKUPS_CHAT_ID ?? '';
                await this.bot.telegram.sendDocument(chatId, {
                  source: zipBuffer.getContents(),
                  filename: zipFileName,
                });
                console.log('Backup successfully sent to Telegram');
                resolve();
              } catch (err) {
                console.error(`Error sending file to Telegram: ${err.message}`);
                reject(err);
              } finally {
                conn.end();
              }
            });
          });
        })
        .on('error', (err) => {
          console.error(
            `SSH connection error during file transfer: ${err.message}`,
          );
          reject(err);
        })
        .connect(sshConfig);
    });
  }
}

//***************************************************************************

// import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { InjectBot } from 'nestjs-telegraf';
// import { Context, Telegraf } from 'telegraf';
// import * as fs from 'fs';
// import * as zlib from 'zlib';
// import * as stream from 'stream';
// import mysqldump from 'mysqldump';
// import * as path from 'path';

// @Injectable()
// export class BackupsService {
//   constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

//   @Cron('0 * * * *') // Каждый час
//   async handleCron() {
//     try {
//       const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//       const backupFileName = `backup-${timestamp}.sql`;
//       const zipFileName = `backup-${timestamp}.gz`;

//       const mysqlUser = process.env.MYSQL_USERNAME;
//       const mysqlPassword = process.env.MYSQL_PASSWORD;
//       const database = process.env.MYSQL_DBNAME;
//       const host = process.env.MYSQL_HOST || 'localhost';
//       const port = Number(process.env.MYSQL_PORT) || 3306;

//       const result = await mysqldump({
//         connection: {
//           host,
//           port,
//           user: mysqlUser,
//           password: mysqlPassword,
//           database,
//         },
//       });

//       const sqlDump =
//         result.dump.schema + result.dump.data + result.dump.trigger;

//       // Создаем поток записи в файл с архивом
//       const outputStream = fs.createWriteStream(
//         path.join(__dirname, zipFileName),
//       );
//       const gzip = zlib.createGzip(); // Создаем GZIP поток для сжатия

//       // Создаем поток, который будет записывать SQL дамп в архив
//       const sqlStream = new stream.Readable();
//       sqlStream.push(sqlDump);
//       sqlStream.push(null); // Указывает конец потока данных

//       // Пайпим SQL поток через gzip и записываем в файл
//       sqlStream.pipe(gzip).pipe(outputStream);

//       outputStream.on('finish', async () => {
//         // Теперь отправим архив в Telegram
//         try {
//           const chatId = process.env.BACKUPS_CHAT_ID;
//           if (!chatId) {
//             console.error('BACKUPS_CHAT_ID is not defined');
//             return;
//           }

//           console.log(`Sending backup to Telegram chatId: ${chatId}`); // Логируем перед отправкой
//           await this.bot.telegram.sendDocument(chatId, {
//             source: fs.createReadStream(path.join(__dirname, zipFileName)),
//             filename: zipFileName,
//           });
//           console.log('Backup successfully sent to Telegram');
//         } catch (err) {
//           console.error(`Error sending file to Telegram: ${err.message}`);
//         }
//       });
//     } catch (e) {
//       console.error('BACKUP ERROR:', e);
//     }
//   }
// }
