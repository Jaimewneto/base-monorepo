import { hash } from "@node-rs/argon2";

import { client } from "../database/client.js";

import { companyRepository } from "../database/repositories/company.js";
import { userRepository } from "../database/repositories/user.js";

import type { CompanyCreate } from "../database/schema/company.js";
import type { UserCreateWithoutCompanyId } from "../database/schema/user.js";

import { baseService } from "./baseService.js";

const base = baseService<"company">(companyRepository(client));

export const companyService = {
    ...base,

    createWithUser: async (data: {
        company: CompanyCreate;
        user: UserCreateWithoutCompanyId;
    }) => {
        return await client.transaction().execute(async (trx) => {
            const base = baseService<"company">(companyRepository(trx));
            const userRepositoryInstance = userRepository(trx);

            const { name, email, password } = data.user;

            const company = await base.create(data.company);

            const hashedPassword = await hash(password);

            const user = await userRepositoryInstance.create({
                email,
                password: hashedPassword,
                name,
                company_id: company.id,
            });

            return {
                company,
                user,
            };
        });
    },
};
