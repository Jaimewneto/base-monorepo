import type {
    //
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface TenantTable {
    id: Generated<string>;
    name: string;
    //document: string;
    created_at: ColumnType<Date, string | undefined, never>;
    updated_at: ColumnType<Date, string | undefined, undefined | Date>;
    deleted_at: ColumnType<Date, string | undefined, Date>;
}

export type Tenant = Selectable<TenantTable>;
export type TenantCreate = Insertable<TenantTable>;
export type TenantUpdate = Updateable<TenantTable>;
