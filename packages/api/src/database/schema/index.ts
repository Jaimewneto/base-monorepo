import type { Insertable, Selectable, Updateable } from "kysely";

import type { AuditTable } from "./audit.js";
import type { InventoryMovementTable } from "./inventoryMovement.js";
import type { ProductTable } from "./product.js";
import type { ProductImageTable } from "./productImage.js";
import type { StockTable } from "./stock.js";
import type { TenantTable } from "./tenant.js";
import type { UserTable } from "./user.js";
import type { WarehouseTable } from "./warehouse.js";

export interface Database {
    audit: AuditTable;
    inventory_movement: InventoryMovementTable;
    product: ProductTable;
    product_image: ProductImageTable;
    stock: StockTable;
    tenant: TenantTable;
    user: UserTable;
    warehouse: WarehouseTable;
}

export type Record<T extends keyof Database> = Selectable<Database[T]>;
export type NewRecord<T extends keyof Database> = Insertable<Database[T]>;
export type RecordUpdate<T extends keyof Database> = Updateable<Database[T]>;
