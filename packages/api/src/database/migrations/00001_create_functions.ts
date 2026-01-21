import { type Kysely, sql } from "kysely";

import type { Database } from "../schema/index.js";

export async function up(db: Kysely<Database>): Promise<void> {
    await sql`create extension if not exists unaccent`.execute(db);
    await sql`create extension if not exists pgcrypto`.execute(db);
    // uuidv7 fallback for PG < 18
    await sql`
        CREATE OR REPLACE FUNCTION uuidv7()
        RETURNS uuid
        AS $$
        DECLARE
            unix_ts_ms bytea;
            uuid_bytes bytea;
        BEGIN
            unix_ts_ms = substring(int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint) from 3);
            
            uuid_bytes = unix_ts_ms || gen_random_bytes(10);
            
            uuid_bytes = set_byte(uuid_bytes, 6, (get_byte(uuid_bytes, 6) & 15) | 112);
            uuid_bytes = set_byte(uuid_bytes, 8, (get_byte(uuid_bytes, 8) & 63) | 128);
            
            RETURN encode(uuid_bytes, 'hex')::uuid;
        END
        $$ LANGUAGE plpgsql VOLATILE;
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
