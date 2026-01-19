import { client } from "../client.js";
import { baseRepository } from "./baseRepository.js";

export const auditRepository = (db = client) =>
    baseRepository<"audit">({
        db,
        tableName: "audit",
    });
