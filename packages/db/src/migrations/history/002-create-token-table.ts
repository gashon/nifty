import { Kysely, sql } from "kysely";
import * as utils from "../utils";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("token")
    .addColumn("id", "serial", (col) =>
      col.primaryKey(),
    )
    .addColumn("user_id", "serial", (col) => col.notNull().references("user.id"))
    .addColumn("strategy", utils.enum("google", "facebook", "github", "email", "invite", "refresh"), (col) => col.notNull())
    .addColumn("expires_at", "timestamp", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("token_id_index")
    .on("token")
    .column("id")
    .execute();

  await db.schema
    .createIndex("token_user_id_index")
    .on("token")
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("token").execute();
}
