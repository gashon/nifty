import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('submission_answer_free_response')
    .addColumn('is_correct', 'boolean')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('submission').dropColumn('is_correct').execute();
}
