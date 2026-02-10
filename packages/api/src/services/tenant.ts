import { hash } from "@node-rs/argon2";

import { client } from "../database/client.js";

import { tenantRepository } from "../database/repositories/tenant.js";
import { userRepository } from "../database/repositories/user.js";

import type { TenantCreate } from "../database/schema/tenant.js";
import type { UserCreateWithoutTenantId } from "../database/schema/user.js";
import { userRules } from "../rules/user.js";
import { baseService } from "./baseService.js";

const base = baseService<"tenant">(tenantRepository(client));

export const tenantService = {
    ...base,

    createWithUser: async (data: {
        tenant: TenantCreate;
        user: UserCreateWithoutTenantId;
    }) => {
        return await client.transaction().execute(async (trx) => {
            const base = baseService<"tenant">(tenantRepository(trx));
            const userRepositoryInstance = userRepository(trx);

            const { name, email, password } = data.user;

            const tenant = await base.create(data.tenant);

            const hashedPassword = await hash(password);

            await userRules(trx).validateEmailUniqueness(email);

            const user = await userRepositoryInstance.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    tenant_id: tenant.id,
                },
            });

            return {
                tenant,
                user,
            };
        });
    },
};
