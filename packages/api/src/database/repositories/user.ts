import { client } from "../client.js";
import { baseRepository } from "./baseRepository.js";

export const userRepository = (db = client) =>
    baseRepository<"user">({
        db,
        tableName: "user",
    });
