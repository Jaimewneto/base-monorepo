import { client } from "../client.js";
import { baseRepository } from "./baseRepository.js";

export const cardexRepository = (db = client) =>
    baseRepository<"cardex">({
        db,
        tableName: "cardex",
    });
