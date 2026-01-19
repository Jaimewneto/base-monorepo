import { stockService } from "../services/stock.js";

import { baseController } from "./baseController.js";

export const stockController = baseController<"stock">(stockService);
