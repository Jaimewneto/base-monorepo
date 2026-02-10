import { type Kysely, sql } from "kysely";

import type { Database } from "../schema/index.js";

export async function up(db: Kysely<Database>): Promise<void> {
    await db.schema
        .createTable("product")
        .addColumn("id", "uuid", (col) =>
            col.primaryKey().defaultTo(sql`uuidv7()`),
        )
        .addColumn(
            "tenant_id",
            "uuid",
            (col) => col.references("tenant.id").notNull(), // foreign key
        )
        .addColumn("sku", "varchar(255)", (col) => col.notNull())
        .addColumn("description", "varchar(255)", (col) => col.notNull())
        .addColumn("mpn", "varchar(255)")
        .addColumn("gtin", "varchar(14)")
        .addColumn("ncm", "varchar(8)")
        .addColumn("default_price", "numeric", (col) =>
            col.notNull().defaultTo(0),
        )
        .addColumn("unit_of_measure", "varchar(5)", (col) =>
            col.notNull().defaultTo("UN"),
        )
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
