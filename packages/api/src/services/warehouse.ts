import { warehouseRepository } from "../database/repositories/warehouse.js";

import { baseService } from "./baseService.js";

export const warehouseService = baseService<"warehouse">(warehouseRepository());
