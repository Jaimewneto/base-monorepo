import { productRepository } from "../database/repositories/product.js";

import { baseService } from "./baseService.js";

export const productService = baseService<"product">(productRepository());
