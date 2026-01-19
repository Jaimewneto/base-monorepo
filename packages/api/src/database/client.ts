import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";

import { env } from "../env.js";

import type { Database } from "./schema/index.js";

export const client = new Kysely<Database>({
    dialect: new PostgresJSDialect({
        postgres: postgres({
            host: env.DB_HOST,
            port: env.DB_PORT,
            database: env.DB_DATABASE,
            user: env.DB_USERNAME,
            password: env.DB_PASSWORD,
            ssl: env.DB_SSL,
        }),
    }),
});
