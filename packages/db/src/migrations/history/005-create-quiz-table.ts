import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("quiz")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("created_by", "integer", (col) => col.notNull().references("user.id"))
    .addColumn("note_id", "integer", (col) => col.notNull().references("note.id"))
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("multiple_choice_activated", "boolean", (col) => col.notNull())
    .addColumn("free_response_activated", "boolean", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("quiz_id_index")
    .on("quiz")
    .column("id")
    .execute();

  await db.schema
    .createIndex("quiz_created_by_index")
    .on("quiz")
    .column("created_by")
    .execute();

  await db.schema
    .createIndex("quiz_note_id_index")
    .on("quiz")
    .column("note_id")
    .execute();

  await db.schema
    .createIndex("quiz_created_at_index")
    .on("quiz")
    .column("created_at")
    .execute();

  await db.schema
    .createTable("quiz_question_multiple_choice")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("question", "text", (col) => col.notNull())
    .addColumn("quiz_id", "integer", (col) => col.notNull().references("quiz.id"))
    .addColumn("answers", sql<string[]>`varchar[]`, (col) => col.notNull())
    .addColumn("correct_index", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("quiz_question_multiple_choice_id_index")
    .on("quiz_question_multiple_choice")
    .column("id")
    .execute();

  await db.schema
    .createIndex("quiz_question_multiple_choice_quiz_id_index")
    .on("quiz_question_multiple_choice")
    .column("quiz_id")
    .execute();

  await db.schema
    .createTable("quiz_question_free_response")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("question", "text", (col) => col.notNull())
    .addColumn("quiz_id", "integer", (col) => col.notNull().references("quiz.id"))
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("quiz_question_free_response_id_index")
    .on("quiz_question_free_response")
    .column("id")
    .execute();

  await db.schema
    .createIndex("quiz_question_free_response_quiz_id_index")
    .on("quiz_question_free_response")
    .column("quiz_id")
    .execute();

}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("quiz_question_multiple_choice").execute();
  await db.schema.dropTable("quiz_question_free_response").execute();
  await db.schema.dropTable("quiz").execute();
}
