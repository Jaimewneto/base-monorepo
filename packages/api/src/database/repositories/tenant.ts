import { client } from "../client.js";
import { baseRepository } from "./baseRepository.js";

export const tenantRepository = (db = client) =>
    baseRepository<"tenant">({
        db,
        tableName: "tenant",
    });
