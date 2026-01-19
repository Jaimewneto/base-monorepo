import type { Insertable, Selectable, Updateable } from "kysely";

import type { AuditTable } from "./audit.js";
import type { CardexTable } from "./cardex.js";
import type { CompanyTable } from "./company.js";
import type { ProductTable } from "./product.js";
import type { StockTable } from "./stock.js";
import type { UserTable } from "./user.js";
import type { WarehouseTable } from "./warehouse.js";

export interface Database {
    audit: AuditTable;
    cardex: CardexTable;
    company: CompanyTable;
    product: ProductTable;
    stock: StockTable;
    user: UserTable;
    warehouse: WarehouseTable;
}

export type Record<T extends keyof Database> = Selectable<Database[T]>;
export type NewRecord<T extends keyof Database> = Insertable<Database[T]>;
export type RecordUpdate<T extends keyof Database> = Updateable<Database[T]>;
