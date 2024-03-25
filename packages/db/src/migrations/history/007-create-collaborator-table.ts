import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("collaborator")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("created_by", "integer", (col) => col.notNull().references("user.id"))
    .addColumn("user_id", "integer", (col) => col.notNull().references("user.id"))
    .addColumn("permissions", "integer", (col) => col.notNull())
    .addColumn("last_viewed_at", "timestamp")
    .addColumn("type", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("collaborator_id_index")
    .on("collaborator")
    .column("id")
    .execute();

  await db.schema
    .createIndex("collaborator_user_id_index")
    .on("collaborator")
    .column("user_id")
    .execute();

  // note join table
  await db.schema
    .createTable("note_collaborator")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("note_id", "integer", (col) => col.notNull().references("note.id"))
    .addColumn("collaborator_id", "integer", (col) => col.notNull().references("collaborator.id"))
    .addUniqueConstraint("note_unique_collaborator", ["note_id", "collaborator_id"])
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("note_collaborator_note_id_index")
    .on("note_collaborator")
    .column("note_id")
    .execute();

  await db.schema
    .createIndex("note_collaborator_collaborator_id_index")
    .on("note_collaborator")
    .column("collaborator_id")
    .execute();

  // quiz join table
  await db.schema
    .createTable("quiz_collaborator")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("quiz_id", "integer", (col) => col.notNull().references("quiz.id"))
    .addColumn("collaborator_id", "integer", (col) => col.notNull().references("collaborator.id"))
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .addUniqueConstraint("quiz_unique_collaborator", ["quiz_id", "collaborator_id"])
    .execute();

  await db.schema
    .createIndex("quiz_collaborator_quiz_id_index")
    .on("quiz_collaborator")
    .column("quiz_id")
    .execute();

  await db.schema
    .createIndex("quiz_collaborator_collaborator_id_index")
    .on("quiz_collaborator")
    .column("collaborator_id")
    .execute();

  // directory join table
  await db.schema
    .createTable("directory_collaborator")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("directory_id", "integer", (col) => col.notNull().references("directory.id"))
    .addColumn("collaborator_id", "integer", (col) => col.notNull().references("collaborator.id"))
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .addUniqueConstraint("directory_unique_collaborator", ["directory_id", "collaborator_id"])
    .execute();

  await db.schema
    .createIndex("directory_collaborator_directory_id_index")
    .on("directory_collaborator")
    .column("directory_id")
    .execute();

  await db.schema
    .createIndex("directory_collaborator_collaborator_id_index")
    .on("directory_collaborator")
    .column("collaborator_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("note_collaborator").execute();
  await db.schema.dropTable("directory_collaborator").execute();
  await db.schema.dropTable("quiz_collaborator").execute();

  await db.schema.dropTable("collaborator").execute();
}
