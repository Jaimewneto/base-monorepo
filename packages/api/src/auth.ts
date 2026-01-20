import { verify } from "@node-rs/argon2";

import * as jose from "jose";

import { env } from "./env.js";

import { BadRequestError } from "./error.js";

import { userService } from "./services/user.js";

import type { JWTPayload } from "./types/auth.js";

export const login = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    const user = await userService.findOneByEmail(email);

    if (!user)
        throw new BadRequestError({
            code: 401,
            message: "Wrong email or password",
            name: "InvalidCredentialsError",
        });

    const isValid = await verify(user.password, password);

    if (!isValid)
        throw new BadRequestError({
            code: 401,
            message: "Wrong email or password",
            name: "InvalidCredentialsError",
        });

    const accessToken = await new jose.SignJWT({
        id: user.id,
        company_id: user.company_id,
        name: user.name,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1m")
        .sign(new TextEncoder().encode(env.JWT_SECRET));

    const refreshToken = await new jose.SignJWT({
        id: user.id,
        company_id: user.company_id,
        name: user.name,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(new TextEncoder().encode(env.JWT_SECRET));

    const userRes = {
        ...user,
        password: undefined,
    };

    return { user: userRes, credentials: { accessToken, refreshToken } };
};

export const me = async (token: string) => {
    try {
        const { payload }: { payload: JWTPayload } = await jose.jwtVerify(
            token,
            new TextEncoder().encode(env.JWT_SECRET),
        );

        const user = await userService.findOneById(payload.id);

        if (!user)
            throw new BadRequestError({
                code: 404,
                message: "User not found",
                name: "UserNotFoundError",
            });

        return { ...user, password: undefined };
    } catch {
        throw new BadRequestError({
            code: 401,
            message: "Invalid token",
            name: "InvalidTokenError",
        });
    }
};

export const refreshToken = async (token: string) => {
    try {
        const { payload }: { payload: JWTPayload } = await jose.jwtVerify(
            token,
            new TextEncoder().encode(env.JWT_SECRET),
        );

        const newAccessToken = await new jose.SignJWT({
            id: payload.id,
            company_id: payload.company_id,
            name: payload.name,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("2h")
            .sign(new TextEncoder().encode(env.JWT_SECRET));

        const newRefreshToken = await new jose.SignJWT({
            id: payload.id,
            company_id: payload.company_id,
            name: payload.name,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(new TextEncoder().encode(env.JWT_SECRET));

        return {
            user: payload,
            credentials: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        };
    } catch {
        throw new BadRequestError({
            code: 401,
            message: "Invalid refresh token",
            name: "InvalidRefreshTokenError",
        });
    }
};
