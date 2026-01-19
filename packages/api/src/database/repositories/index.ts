import { auditRepository } from "./audit.js";
import { cardexRepository } from "./cardex.js";
import { companyRepository } from "./company.js";
import { productRepository } from "./product.js";
import { stockRepository } from "./stock.js";
import { userRepository } from "./user.js";
import { warehouseRepository } from "./warehouse.js";

export const repositories = {
    audit: auditRepository,
    cardex: cardexRepository,
    company: companyRepository,
    product: productRepository,
    stock: stockRepository,
    user: userRepository,
    warehouse: warehouseRepository,
};
