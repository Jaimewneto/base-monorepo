import { warehouseService } from "../services/warehouse.js";

import { baseController } from "./baseController.js";

export const warehouseController =
    baseController<"warehouse">(warehouseService);
