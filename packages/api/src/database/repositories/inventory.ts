import { client } from "../client.js";
import { baseRepository } from "./baseRepository.js";

export const inventoryRepository = (db = client) =>
    baseRepository<"inventory">({
        db,
        tableName: "inventory",
    });
