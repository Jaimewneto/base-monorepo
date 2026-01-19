import { productService } from "../services/product.js";

import { baseController } from "./baseController.js";

export const productController = baseController<"product">(productService);
