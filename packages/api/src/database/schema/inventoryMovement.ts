import type {
    //
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface InventoryMovementTable {
    id: Generated<string>;
    tenant_id: string;
    product_id: string;
    warehouse_id: string;
    entry: number;
    exit: number;
    description: string;
    created_at: ColumnType<Date, string | undefined, never>;
    updated_at: ColumnType<Date, string | undefined, undefined | Date>;
    deleted_at: ColumnType<Date, string | undefined, Date>;
}

export type InventoryMovement = Selectable<InventoryMovementTable>;
export type InventoryMovementCreate = Insertable<InventoryMovementTable>;
export type InventoryMovementUpdate = Updateable<InventoryMovementTable>;

export type InventoryMovementCreateWithoutTenantId = Omit<
    InventoryMovementCreate,
    "tenant_id"
>;
