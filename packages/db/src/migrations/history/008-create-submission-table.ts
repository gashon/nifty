import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("submission")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("created_by", "integer", (col) => col.notNull().references("user.id"))
    .addColumn("quiz_id", "integer", (col) => col.notNull().references("quiz.id"))
    .addColumn("total_questions", "integer", (col) => col.notNull())
    .addColumn("total_correct", "integer", (col) => col.notNull())
    .addColumn("total_incorrect", "integer", (col) => col.notNull())
    .addColumn("total_unanswered", "integer", (col) => col.notNull())
    .addColumn("score", "integer", (col) => col.notNull())
    .addColumn("time_taken", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("submission_id_index")
    .on("submission")
    .column("id")
    .execute();

  await db.schema
    .createIndex("submission_created_by_index")
    .on("submission")
    .column("created_by")
    .execute();

  await db.schema
    .createIndex("submission_created_at_index")
    .on("submission")
    .column("created_at")
    .execute();

  await db.schema
    .createIndex("submission_quiz_id_index")
    .on("submission")
    .column("quiz_id")
    .execute();

  // multiple choice
  await db.schema
    .createTable("submission_answer_multiple_choice")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("submission_id", "integer", (col) => col.notNull().references("submission.id"))
    .addColumn("question_id", "integer", (col) => col.notNull().references("quiz_question_multiple_choice.id"))
    .addColumn("answer_index", "integer")
    .addColumn("is_correct", "boolean")
    .addColumn("correct_index", "integer")
    .addColumn("feedback_text", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("submission_answer_multiple_choice_id_index")
    .on("submission_answer_multiple_choice")
    .column("id")
    .execute();

  await db.schema
    .createIndex("submission_answer_multiple_choice_submission_id_index")
    .on("submission_answer_multiple_choice")
    .column("submission_id")
    .execute();

  await db.schema
    .createIndex("submission_answer_multiple_choice_question_id_index")
    .on("submission_answer_multiple_choice")
    .column("question_id")
    .execute();

  // free response
  await db.schema
    .createTable("submission_answer_free_response")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("submission_id", "integer", (col) => col.notNull().references("submission.id"))
    .addColumn("question_id", "integer", (col) => col.notNull().references("quiz_question_free_response.id"))
    .addColumn("answer_text", "text")
    .addColumn("feedback_text", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("submission_answer_free_response_id_index")
    .on("submission_answer_free_response")
    .column("id")
    .execute();

  await db.schema
    .createIndex("submission_answer_free_response_submission_id_index")
    .on("submission_answer_free_response")
    .column("submission_id")
    .execute();

  await db.schema
    .createIndex("submission_answer_free_response_question_id_index")
    .on("submission_answer_free_response")
    .column("question_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("submission_answer").execute();
  await db.schema.dropTable("submission").execute();
}



