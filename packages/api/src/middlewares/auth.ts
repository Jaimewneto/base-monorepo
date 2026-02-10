import { createMiddleware } from "hono/factory";

import * as jose from "jose";

import { env } from "../env.js";

import { BadRequestError } from "../error.js";

import { requestContext } from "../request-context.js";

import type { JWTPayload } from "../types/auth.js";

import { getMessage } from "../utils/messageTranslator.js";

export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new BadRequestError({
            code: 401,
            message: getMessage({ key: "missingOrInvalidAuthHeader" }),
            name: "UnauthorizedError",
        });
    }

    const accessToken = authHeader.replace("Bearer ", "");

    try {
        const { payload } = await jose.jwtVerify(
            accessToken,
            new TextEncoder().encode(env.JWT_SECRET),
            {
                algorithms: ["HS256"],
            },
        );

        c.set("user", payload as JWTPayload);

        await requestContext.run({ user: payload as JWTPayload }, async () => {
            await next();
        });
    } catch (error) {
        if (error instanceof jose.errors.JWTExpired) {
            throw new BadRequestError({
                code: 401,
                message: getMessage({ key: "expiredToken" }),
                name: "ExpiredTokenError",
            });
        }

        throw new BadRequestError({
            code: 401,
            message: getMessage({ key: "invalidToken" }),
            name: "UnauthorizedError",
        });
    }
});
