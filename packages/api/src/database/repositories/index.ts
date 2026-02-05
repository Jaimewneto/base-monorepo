import { auditRepository } from "./audit.js";
import { inventoryRepository } from "./inventory.js";
import { inventoryMovementRepository } from "./inventoryMovement.js";
import { productRepository } from "./product.js";
import { tenantRepository } from "./tenant.js";
import { userRepository } from "./user.js";
import { warehouseRepository } from "./warehouse.js";

export const repositories = {
    audit: auditRepository,
    inventoryMovement: inventoryMovementRepository,
    tenant: tenantRepository,
    product: productRepository,
    inventory: inventoryRepository,
    user: userRepository,
    warehouse: warehouseRepository,
};
