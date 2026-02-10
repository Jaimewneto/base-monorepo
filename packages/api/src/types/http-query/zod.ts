import type { z } from "zod/v4";

import { database } from "../../database/constSchema.js";

import { queryRequestsValidations } from "../../validations/http-requests/query.js";

// Audit
const auditWhereSortSchema = queryRequestsValidations({
    tableName: database.auditTable.name,
    tableKeys: database.auditTable.keys,
}).WhereSortSchema;

export type AuditWhereSortZodValidation = z.infer<typeof auditWhereSortSchema>;
export type AuditWhereZodValidation = AuditWhereSortZodValidation["where"];
export type AuditSortZodValidation = AuditWhereSortZodValidation["sort"];

// InventoryMovement
const inventoryMovementWhereSortSchema = queryRequestsValidations({
    tableName: database.inventoryMovementTable.name,
    tableKeys: database.inventoryMovementTable.keys,
}).WhereSortSchema;

export type InventoryMovementWhereSortZodValidation = z.infer<
    typeof inventoryMovementWhereSortSchema
>;
export type InventoryMovementWhereZodValidation =
    InventoryMovementWhereSortZodValidation["where"];
export type InventoryMovementSortZodValidation =
    InventoryMovementWhereSortZodValidation["sort"];

// Tenant
const tenantWhereSortSchema = queryRequestsValidations({
    tableName: database.tenantTable.name,
    tableKeys: database.tenantTable.keys,
}).WhereSortSchema;

export type TenantWhereSortZodValidation = z.infer<
    typeof tenantWhereSortSchema
>;
export type TenantWhereZodValidation = TenantWhereSortZodValidation["where"];
export type TenantSortZodValidation = TenantWhereSortZodValidation["sort"];

// Product
const productWhereSortSchema = queryRequestsValidations({
    tableName: database.productTable.name,
    tableKeys: database.productTable.keys,
}).WhereSortSchema;

export type ProductWhereSortZodValidation = z.infer<
    typeof productWhereSortSchema
>;
export type ProductWhereZodValidation = ProductWhereSortZodValidation["where"];
export type ProductSortZodValidation = ProductWhereSortZodValidation["sort"];

// Product image
const productImageWhereSortSchema = queryRequestsValidations({
    tableName: database.productImageTable.name,
    tableKeys: database.productImageTable.keys,
}).WhereSortSchema;

export type ProductImageWhereSortZodValidation = z.infer<
    typeof productImageWhereSortSchema
>;
export type ProductImageWhereZodValidation =
    ProductImageWhereSortZodValidation["where"];
export type ProductImageSortZodValidation =
    ProductImageWhereSortZodValidation["sort"];

// Inventory
const inventoryWhereSortSchema = queryRequestsValidations({
    tableName: database.inventoryTable.name,
    tableKeys: database.inventoryTable.keys,
}).WhereSortSchema;

export type InventoryWhereSortZodValidation = z.infer<
    typeof inventoryWhereSortSchema
>;
export type InventoryWhereZodValidation =
    InventoryWhereSortZodValidation["where"];
export type InventorySortZodValidation =
    InventoryWhereSortZodValidation["sort"];

// User
const userWhereSortSchema = queryRequestsValidations({
    tableName: database.userTable.name,
    tableKeys: database.userTable.keys,
}).WhereSortSchema;

export type UserWhereSortZodValidation = z.infer<typeof userWhereSortSchema>;
export type UserWhereZodValidation = UserWhereSortZodValidation["where"];
export type UserSortZodValidation = UserWhereSortZodValidation["sort"];

// Warehouse
const warehouseWhereSortSchema = queryRequestsValidations({
    tableName: database.warehouseTable.name,
    tableKeys: database.warehouseTable.keys,
}).WhereSortSchema;

export type WarehouseWhereSortZodValidation = z.infer<
    typeof warehouseWhereSortSchema
>;
export type WarehouseWhereZodValidation =
    WarehouseWhereSortZodValidation["where"];
export type WarehouseSortZodValidation =
    WarehouseWhereSortZodValidation["sort"];

export type ZodWhereMap = {
    audit: AuditWhereZodValidation;
    inventory_movement: InventoryMovementWhereZodValidation;
    product: ProductWhereZodValidation;
    product_image: ProductImageWhereZodValidation;
    inventory: InventoryWhereZodValidation;
    tenant: TenantWhereZodValidation;
    user: UserWhereZodValidation;
    warehouse: WarehouseWhereZodValidation;
};

export type ZodSortMap = {
    audit: AuditSortZodValidation;
    inventory_movement: InventoryMovementSortZodValidation;
    product: ProductSortZodValidation;
    product_image: ProductImageSortZodValidation;
    inventory: InventorySortZodValidation;
    tenant: TenantSortZodValidation;
    user: UserSortZodValidation;
    warehouse: WarehouseSortZodValidation;
};
