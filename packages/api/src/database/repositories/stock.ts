import { client } from "../client.js";
import { baseRepository } from "./baseRepository.js";

export const stockRepository = (db = client) =>
    baseRepository<"stock">({
        db,
        tableName: "stock",
    });
