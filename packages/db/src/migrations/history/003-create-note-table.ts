import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("note")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("created_by", "serial", (col) => col.notNull().references("user.id"))
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("description", "varchar", (col) => col.notNull())
    .addColumn("img_url", "varchar", (col) => col.notNull())
    .addColumn("public_permissions", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("note_id_index")
    .on("note")
    .column("id")
    .execute();

  await db.schema
    .createIndex("note_created_by_index")
    .on("note")
    .column("created_by")
    .execute();

  await db.schema
    .createIndex("note_created_at_index")
    .on("note")
    .column("created_at")
    .execute();

  await db.schema
    .createTable("note_tag")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("note_id", "serial", (col) => col.notNull().references("note.id"))
    .addColumn("tag", "varchar", (col) => col.notNull())
    // unique tags for each note
    .addPrimaryKeyConstraint("note_tag_pkey", ["note_id", "tag"])
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("note_tag_note_id_index")
    .on("note_tag")
    .column("note_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("note_tag").execute();
  await db.schema.dropTable("note").execute();
}
