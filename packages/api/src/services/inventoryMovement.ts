import { inventoryMovementRepository } from "../database/repositories/inventoryMovement.js";

import { baseService } from "./baseService.js";

export const inventoryMovementService = baseService<"inventory_movement">(
    inventoryMovementRepository(),
);
