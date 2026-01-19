import { client } from "../client.js";
import { baseRepository } from "./baseRepository.js";

export const warehouseRepository = (db = client) =>
    baseRepository<"warehouse">({
        db,
        tableName: "warehouse",
    });
