import { type Kysely, sql } from "kysely";

import type { Database } from "../schema/index.js";

export async function up(db: Kysely<Database>): Promise<void> {
    await db.schema
        .createTable("product")
        .addColumn("id", "uuid", (col) =>
            col.primaryKey().defaultTo(sql`uuidv7()`),
        )
        .addColumn(
            "company_id",
            "uuid",
            (col) => col.references("company.id").notNull(), // foreign key
        )
        .addColumn("internal_code", "varchar(255)", (col) => col.notNull())
        .addColumn("description", "varchar(255)", (col) => col.notNull())
        .addColumn("sku", "varchar(255)", (col) => col.notNull())
        .addColumn("observations", "varchar(255)")
        .addColumn("created_at", "timestamptz", (col) =>
            col.defaultTo(sql`now()`),
        )
        .addColumn("updated_at", "timestamptz", (col) =>
            col.defaultTo(sql`now()`),
        )
        .addColumn("deleted_at", "timestamptz", (col) => col.defaultTo(null))
        .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
    await db.schema.dropTable("product").execute();
}
