import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('note')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('created_by', 'integer', (col) =>
      col.notNull().references('user.id')
    )
    .addColumn('directory_id', 'integer', (col) =>
      col.references('directory.id')
    )
    .addColumn('title', 'varchar', (col) => col.notNull())
    .addColumn('content', 'bytea', (col) => col)
    .addColumn('description', 'varchar', (col) => col.notNull())
    .addColumn('img_url', 'varchar')
    .addColumn('public_permissions', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('deleted_at', 'timestamp')
    .execute();

  await db.schema
    .createIndex('note_id_index')
    .on('note')
    .column('id')
    .execute();

  await db.schema
    .createIndex('note_created_by_index')
    .on('note')
    .column('created_by')
    .execute();

  await db.schema
    .createIndex('note_created_at_index')
    .on('note')
    .column('created_at')
    .execute();

  await db.schema
    .createTable('note_tag')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('note_id', 'integer', (col) =>
      col.notNull().references('note.id')
    )
    .addColumn('tag', 'varchar', (col) => col.notNull())
    // unique tags for each note
    .addUniqueConstraint('note_tag_note_id_tag_unique', ['note_id', 'tag'])
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('deleted_at', 'timestamp')
    .execute();

  await db.schema
    .createIndex('note_tag_note_id_index')
    .on('note_tag')
    .column('note_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('note_tag').execute();
  await db.schema.dropTable('note').execute();
}
