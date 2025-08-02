import { Database } from 'bun:sqlite';
import { setupMigrationTable } from './migration';

let db: Database;

export function setupDB(path: string): Database {
  db = new Database(path, {
    create: true,
  });

  setupMigrationTable(db);
  return db;
}

export function getDB(): Database {
  return db;
}
