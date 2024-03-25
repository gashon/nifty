import * as dotenv from "dotenv";
dotenv.config({path: __dirname + "/../../../../../.env"});
import { Pool } from "pg";
import { Kysely, PostgresDialect, CamelCasePlugin } from "kysely";
import { DB } from "@nifty/db/types";

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: process.env.NO_SSL === "true" ? false : true,
    }),
  }),
  plugins: [new CamelCasePlugin()],
});
