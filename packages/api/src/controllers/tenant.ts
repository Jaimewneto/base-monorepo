import type { TenantCreate } from "../database/schema/tenant.js";

import type { UserCreateWithoutTenantId } from "../database/schema/user.js";

import { tenantService } from "../services/tenant.js";

import { baseController } from "./baseController.js";

export const base = baseController<"tenant">(tenantService);

export const tenantController = {
    ...base,

    create: async (data: {
        tenant: TenantCreate;
        user: UserCreateWithoutTenantId;
    }) => {
        return await tenantService.createWithUser(data);
    },
};
