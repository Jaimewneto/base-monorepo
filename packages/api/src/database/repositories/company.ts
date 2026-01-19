import { client } from "../client.js";
import { baseRepository } from "./baseRepository.js";

export const companyRepository = (db = client) =>
    baseRepository<"company">({
        db,
        tableName: "company",
    });
