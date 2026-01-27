import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { FileMigrationProvider, Kysely, Migrator } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { env } from "../../env.js";
import type { Database } from "../schema/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateToLatest() {
    const db = new Kysely<Database>({
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

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: path.resolve(__dirname, "../migrations"),
        }),
    });

    const { error, results } = await migrator.migrateToLatest();

    results?.forEach((it) => {
        if (it.status === "Success") {
            console.log(
                `migration "${it.migrationName}" was executed successfully`,
            );
        } else if (it.status === "Error") {
            console.error(`failed to execute migration "${it.migrationName}"`);
        }
    });

    if (error) {
        console.error("failed to migrate");
        console.error(error);
        process.exit(1);
    }

    await db.destroy();
}

migrateToLatest();
