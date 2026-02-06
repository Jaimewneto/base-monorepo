import type { Kysely, SqlBool } from "kysely";

import { userRepository } from "../database/repositories/user.js";

import type { Database } from "../database/schema/index.js";

import { BadRequestError } from "../error.js";

import { getMessage } from "../utils/messageTranslator.js";

export const userRules = (db: Kysely<Database>) => ({
    validateEmailUniqueness: async (email: string) => {
        const existingUser = await userRepository(db).findOneByCondition(
            (eb) =>
                eb.and({
                    "user.email": email,
                }) as unknown as SqlBool,
        );

        if (existingUser)
            throw new BadRequestError({
                message: getMessage({ key: "userEmailAlreadyExists" }),
            });
    },
});
