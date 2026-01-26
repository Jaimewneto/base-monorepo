import { auditRepository } from "./audit.js";
import { cardexRepository } from "./cardex.js";
import { productRepository } from "./product.js";
import { stockRepository } from "./stock.js";
import { tenantRepository } from "./tenant.js";
import { userRepository } from "./user.js";
import { warehouseRepository } from "./warehouse.js";

export const repositories = {
    audit: auditRepository,
    cardex: cardexRepository,
    tenant: tenantRepository,
    product: productRepository,
    stock: stockRepository,
    user: userRepository,
    warehouse: warehouseRepository,
};
