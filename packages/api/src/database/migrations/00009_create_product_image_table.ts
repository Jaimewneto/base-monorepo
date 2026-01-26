import { type Kysely, sql } from "kysely";

import type { Database } from "../schema/index.js";

export async function up(db: Kysely<Database>): Promise<void> {
    await db.schema
        .createTable("product_image")
        .addColumn("id", "uuid", (col) =>
            col.primaryKey().defaultTo(sql`uuidv7()`),
        )
        .addColumn(
            "tenant_id",
            "uuid",
            (col) => col.references("tenant.id").notNull(), // foreign key
        )
        .addColumn(
            "product_id",
            "uuid",
            (col) => col.references("product.id").notNull(), // foreign key
        )
        .addColumn("url", "varchar(255)", (col) => col.notNull())
        .addColumn("main", "boolean", (col) => col.notNull().defaultTo(false))
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
    await db.schema.dropTable("product_image").execute();
}
