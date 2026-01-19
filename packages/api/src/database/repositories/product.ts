import { client } from "../client.js";
import { baseRepository } from "./baseRepository.js";

export const productRepository = (db = client) =>
    baseRepository<"product">({
        db,
        tableName: "product",
    });
