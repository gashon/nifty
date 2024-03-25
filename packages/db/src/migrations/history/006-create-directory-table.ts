import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("directory")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("created_by", "integer", (col) => col.notNull().references("user.id"))
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("parent_id", "integer", (col) => col.references("directory.id"))
    .addColumn("alias", "varchar")
    .addColumn("credits", "integer")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("directory_id_index")
    .on("directory")
    .column("id")
    .execute();

  await db.schema
    .createIndex("directory_created_by_index")
    .on("directory")
    .column("created_by")
    .execute();

  await db.schema
    .createIndex("directory_parent_id_index")
    .on("directory")
    .column("parent_id")
    .execute();

  await db.schema
    .createIndex("directory_created_at_index")
    .on("directory")
    .column("created_at")
    .execute();

  await db.schema
    .createTable("directory_note")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("directory_id", "integer", (col) => col.notNull().references("directory.id"))
    .addColumn("note_id", "integer", (col) => col.notNull().references("note.id"))
    .addUniqueConstraint("directory_note_unique_note", ["directory_id", "note_id"])
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("directory_note_id_index")
    .on("directory_note")
    .column("id")
    .execute();

  await db.schema
    .createIndex("directory_note_directory_id_index")
    .on("directory_note")
    .column("directory_id")
    .execute();

  await db.schema
    .createIndex("directory_note_note_id_index")
    .on("directory_note")
    .column("note_id")
    .execute();

}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("directory_note").execute();
  await db.schema.dropTable("directory").execute();
}
