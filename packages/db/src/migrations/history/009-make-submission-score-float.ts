import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('submission')
    .alterColumn('score', (col) => col.setDataType('real'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('submission')
    .alterColumn('score', (col) => col.setDataType('integer'))
    .execute();
}
