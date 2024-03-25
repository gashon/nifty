import { migrator, closeMigrationConnection } from './util';

async function dropAllMigrations() {
  const migrations = await migrator.getMigrations();
  console.log(`dropping ${migrations.length} migrations`);

  const reversedMigrations = [...migrations].reverse();
  for (const migration of reversedMigrations) {
    await migrator.migrateDown();
    console.log(`dropped migration "${migration.name}"`);
  }

  await closeMigrationConnection();
}

dropAllMigrations();
