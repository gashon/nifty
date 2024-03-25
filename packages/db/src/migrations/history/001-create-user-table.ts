import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("email", "varchar", (col) => col.unique().notNull())
    .addColumn("first_name", "varchar", (col) => col)
    .addColumn("last_name", "varchar", (col) => col)
    .addColumn("avatar_url", "varchar", (col) => col)
    .addColumn("last_login", "timestamp", (col) => col)
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("user_id_index")
    .on("user")
    .column("id")
    .execute();

  await sql`CREATE INDEX "user_email_index" ON "user" USING HASH(email)`.execute(db);

}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user").execute();
}
