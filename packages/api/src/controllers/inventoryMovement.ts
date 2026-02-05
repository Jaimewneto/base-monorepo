import { inventoryMovementService } from "../services/inventoryMovement.js";

import { baseController } from "./baseController.js";

export const inventoryMovementController = baseController<"inventory_movement">(
    inventoryMovementService,
);
