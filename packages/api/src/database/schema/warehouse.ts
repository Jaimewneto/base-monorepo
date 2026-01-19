import type {
    //
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface WarehouseTable {
    id: Generated<string>;
    company_id: string;
    description: string;
    observations: string | null;
    created_at: ColumnType<Date, string | undefined, never>;
    updated_at: ColumnType<Date, string | undefined, undefined | Date>;
    deleted_at: ColumnType<Date, string | undefined, Date>;
}

export type Warehouse = Selectable<WarehouseTable>;
export type WarehouseCreate = Insertable<WarehouseTable>;
export type WarehouseUpdate = Updateable<WarehouseTable>;

export type WarehouseCreateWithoutCompanyId = Omit<
    WarehouseCreate,
    "company_id"
>;
