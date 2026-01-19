import type { CompanyCreate } from "../database/schema/company.js";

import type { UserCreateWithoutCompanyId } from "../database/schema/user.js";

import { companyService } from "../services/company.js";

import { baseController } from "./baseController.js";

export const base = baseController<"company">(companyService);

export const companyController = {
    ...base,

    create: async (data: {
        company: CompanyCreate;
        user: UserCreateWithoutCompanyId;
    }) => {
        return await companyService.createWithUser(data);
    },
};
