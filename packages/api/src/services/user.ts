import { hash } from "@node-rs/argon2";
import type { SqlBool } from "kysely";

import { userRepository } from "../database/repositories/user.js";

import type { UserCreate } from "../database/schema/user.js";

import { baseService } from "./baseService.js";

const base = baseService<"user">(userRepository());

export const userService = {
    ...base,

    findOneByEmail: async (email: string) => {
        return await base.findOneByCondition(
            (eb) =>
                eb.and({
                    "user.email": email,
                }) as unknown as SqlBool,
        );
    },

    create: async (user: UserCreate) => {
        const hashedPassword = await hash(user.password);

        user.password = hashedPassword;

        return await base.create(user);
    },
};
