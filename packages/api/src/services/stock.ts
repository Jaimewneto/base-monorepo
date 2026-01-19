import { stockRepository } from "../database/repositories/stock.js";

import { baseService } from "./baseService.js";

export const stockService = baseService<"stock">(stockRepository());
