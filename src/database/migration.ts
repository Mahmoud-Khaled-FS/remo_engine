import { Database } from 'bun:sqlite';
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { info, warn } from '@src/utils/logger';

export async function migrateDir(db: Database, dirPath: string, pluginName: string | null = null) {
  if (!existsSync(dirPath)) {
    return;
  }
  const dir = readdirSync(dirPath);

  for (const file of dir) {
    const migrationPath = path.resolve(dirPath, file);
    const migration = await import(migrationPath);
    if (!migration.up) {
      warn(`There is no up function in '${migrationPath}'`);
      continue;
    }
    const migrationName = file.replace('.ts', '');
    const query = db.query(
      `SELECT * FROM migrations WHERE plugin = '${pluginName}' AND migration = '${migrationName}'`,
    );
    const result = query.all();
    if (result.length >= 1) {
      return;
    }
    info(`UP: ${migrationName}`);
    db.query('INSERT INTO migrations (plugin, migration) VALUES ($plugin, $migrationName)').run({
      $plugin: pluginName,
      $migrationName: migrationName,
    });
    await migration.up();
  }
}

export function setupMigrationTable(db: Database) {
  db.run(
    'CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY, plugin VARCHAR(255), migration VARCHAR(255) NOT NULL);',
  );
}
