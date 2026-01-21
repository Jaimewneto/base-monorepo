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
                    select encode(
                        set_byte(
                            set_byte(
                                set_byte(
                                    set_byte(
                                        set_byte(
                                            gen_random_bytes(16),
                                            6,
                                            (get_byte(gen_random_bytes(1), 0) & 15) | 112
                                        ),
                                        8,
                                        (get_byte(gen_random_bytes(1), 0) & 63) | 128
                                    ),
                                    0,
                                    ((extract(epoch from clock_timestamp()) * 1000)::bigint >> 40)::int
                                ),
                                1,
                                ((extract(epoch from clock_timestamp()) * 1000)::bigint >> 32)::int
                            ),
                            2,
                            ((extract(epoch from clock_timestamp()) * 1000)::bigint >> 24)::int
                        ),
                        3,
                        ((extract(epoch from clock_timestamp()) * 1000)::bigint >> 16)::int
                    )::uuid;
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
