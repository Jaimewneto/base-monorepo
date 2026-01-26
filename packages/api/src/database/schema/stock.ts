import type {
    //
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface StockTable {
    id: Generated<string>;
    tenant_id: string;
    product_id: string;
    warehouse_id: string | null;
    amount: number;
    created_at: ColumnType<Date, string | undefined, never>;
    updated_at: ColumnType<Date, string | undefined, undefined | Date>;
    deleted_at: ColumnType<Date, string | undefined, Date>;
}

export type Stock = Selectable<StockTable>;
export type StockCreate = Insertable<StockTable>;
export type StockUpdate = Updateable<StockTable>;
