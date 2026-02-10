import { hash } from "@node-rs/argon2";
import type { SqlBool } from "kysely";

import { userRepository } from "../database/repositories/user.js";

import type { UserCreate, UserUpdate } from "../database/schema/user.js";

import { userRules } from "../rules/user.js";

import { baseService } from "./baseService.js";

const base = baseService<"user">(userRepository());

export const userService = {
    ...base,

    findOneByEmail: async (email: string) => {
        const userRepositoryInstance = userRepository();

        return await userRepositoryInstance.findOneByCondition(
            (eb) =>
                eb.and({
                    "user.email": email,
                }) as unknown as SqlBool,
        );
    },

    create: async (user: UserCreate) => {
        await userRules().validateEmailUniqueness(user.email);

        const hashedPassword = await hash(user.password);

        user.password = hashedPassword;

        const userRepositoryInstance = userRepository();

        return await userRepositoryInstance.create({ data: user });
    },

    updateById: async (params: { id: string; data: UserUpdate }) => {
        if (params.data.password) {
            const hashedPassword = await hash(params.data.password);

            params.data.password = hashedPassword;
        }

        const userRepositoryInstance = userRepository();

        return await userRepositoryInstance.updateById(params);
    },
};
