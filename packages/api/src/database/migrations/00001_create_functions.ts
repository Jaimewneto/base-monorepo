import { type Kysely, sql } from "kysely";

import type { Database } from "../schema/index.js";

export async function up(db: Kysely<Database>): Promise<void> {
    await sql`create extension if not exists unaccent`.execute(db);
}

export async function down(db: Kysely<Database>): Promise<void> {
    await sql`drop extension if exists unaccent`.execute(db);
}
