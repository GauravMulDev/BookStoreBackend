import { Injectable } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import * as path from 'path';

import { exec } from 'child_process';
import * as fs from 'fs';

import * as archiver from 'archiver';

@Injectable()
export class MongodbService {
  private client: MongoClient;
  private _db: Db;

  constructor() {
    this.client = new MongoClient('mongodb://localhost:27017', {});
  }
  async connect(): Promise<void> {
    if (!this._db) {
      await this.client.connect();
      this._db = this.client.db();
    }
  }

  get db(): Db {
    if (!this._db) {
      throw new Error('Client is not connected');
    }
    return this._db;
  }

  async getFieldsFromCollection(
    dbName: string,
    collectionName: string,
  ): Promise<string[]> {
    if (!this._db) {
      await this.client.connect();
    }

    const db = this.client.db(dbName);
    const collection = db.collection(collectionName);

    const document = await collection.findOne({});

    if (!document) {
      throw new Error('No documents in collection.');
    }

    return Object.keys(document);
  }

  async close() {
    if (this._db) {
      await this.client.close();
      this._db = null;
    }
  }

  async dumpDatabase(databaseName: string): Promise<string> {
    const dumpPath = path.join(__dirname, '..', 'mongodumps', databaseName);

    if (!fs.existsSync(dumpPath)) {
      fs.mkdirSync(dumpPath, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      exec(`mongodump --db=${databaseName} --out=${dumpPath}`, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(dumpPath);
      });
    });
  }

  async zipDirectory(source: string): Promise<string> {
    const zipPath = `${source}.zip`;
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', () => resolve(zipPath));
      archive.on('error', (err) => reject(err));

      archive.pipe(output);
      archive.directory(source, false);
      archive.finalize();
    });
  }
}
