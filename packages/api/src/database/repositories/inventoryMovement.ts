import { client } from "../client.js";
import { baseRepository } from "./baseRepository.js";

export const inventoryMovementRepository = (db = client) =>
    baseRepository<"inventory_movement">({
        db,
        tableName: "inventory_movement",
    });
