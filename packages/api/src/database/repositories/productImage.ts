import { client } from "../client.js";
import { baseRepository } from "./baseRepository.js";

export const productImageRepository = (db = client) =>
    baseRepository<"product_image">({
        db,
        tableName: "product_image",
    });
