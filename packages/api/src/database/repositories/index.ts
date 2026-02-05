import { auditRepository } from "./audit.js";
import { inventoryMovementRepository } from "./inventoryMovement.js";
import { productRepository } from "./product.js";
import { stockRepository } from "./stock.js";
import { tenantRepository } from "./tenant.js";
import { userRepository } from "./user.js";
import { warehouseRepository } from "./warehouse.js";

export const repositories = {
    audit: auditRepository,
    inventoryMovement: inventoryMovementRepository,
    tenant: tenantRepository,
    product: productRepository,
    stock: stockRepository,
    user: userRepository,
    warehouse: warehouseRepository,
};
