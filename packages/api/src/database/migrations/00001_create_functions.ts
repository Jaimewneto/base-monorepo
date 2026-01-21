import { type Kysely, sql } from "kysely";

import type { Database } from "../schema/index.js";

export async function up(db: Kysely<Database>): Promise<void> {
    await sql`create extension if not exists unaccent`.execute(db);
    await sql`create extension if not exists pgcrypto`.execute(db);
    // uuidv7 fallback for PG < 18
    await sql`
        do $$
        begin
            if not exists (
                select 1
                from pg_proc
                where proname = 'uuidv7'
            ) then
                create function uuidv7()
                returns uuid
                language sql
                volatile
                as $fn$
                    with ts as (
                        select (extract(epoch from clock_timestamp()) * 1000)::bigint as ms
                    )
                    select (
                        lpad(to_hex((ms >> 16) & 65535), 4, '0') ||
                        lpad(to_hex(ms & 65535), 4, '0') ||
                        lpad(to_hex((random() * 65535)::int), 4, '0') ||
                        lpad(to_hex((random() * 4095)::int | 28672), 4, '0') ||
                        lpad(to_hex((random() * 16383)::int | 32768), 4, '0') ||
                        lpad(to_hex((random() * 65535)::int), 4, '0') ||
                        lpad(to_hex((random() * 65535)::int), 4, '0')
                    )::uuid
                    from ts;
                $fn$;
            end if;
        end
        $$;
    `.execute(db);
}

export async function down(db: Kysely<Database>): Promise<void> {
    await sql`drop extension if exists unaccent`.execute(db);
    await sql`drop extension if exists pgcrypto`.execute(db);
    await sql`
        do $$
        begin
            if exists (
                select 1
                from pg_proc
                where proname = 'uuidv7'
            ) then
                drop function uuidv7();
            end if;
        end
        $$;
    `.execute(db);
}
