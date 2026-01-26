import type {
    //
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface AuditTable {
    id: Generated<string>;
    tenant_id: string;
    user_id: string;
    previous_value: string | null;
    new_value: string;
    created_at: ColumnType<Date, string | undefined, never>;
    updated_at: ColumnType<Date, string | undefined, undefined | Date>;
    deleted_at: ColumnType<Date, string | undefined, Date>;
}

export type Audit = Selectable<AuditTable>;
export type AuditCreate = Insertable<AuditTable>;
export type AuditUpdate = Updateable<AuditTable>;
