import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("refresh_token")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("user_id", "serial", (col) => col.notNull().references("user.id"))
    .addColumn("expires_at", "timestamp", (col) => col.notNull())
    .addColumn("created_by_ip", "varchar", (col) => col.notNull())
    .addColumn("created_by_user_agent", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("refresh_token_id_index")
    .on("refresh_token")
    .column("id")
    .execute();

  await db.schema
    .createIndex("refresh_token_user_id_index")
    .on("refresh_token")
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("refresh_token").execute();
}
