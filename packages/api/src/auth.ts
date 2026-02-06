import { verify } from "@node-rs/argon2";

import * as jose from "jose";

import nodemailer from "nodemailer";

import { env } from "./env.js";

import { BadRequestError } from "./error.js";

import { userService } from "./services/user.js";

import type { JWTPayload } from "./types/auth.js";

import { getMessage } from "./utils/messageTranslator.js";

import { logger } from "./logger.js";

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
            message: getMessage({
                key: "wrongEmailOrPassword",
            }),
            name: "InvalidCredentialsError",
        });

    const isValid = await verify(user.password, password);

    if (!isValid)
        throw new BadRequestError({
            code: 401,
            message: getMessage({
                key: "wrongEmailOrPassword",
            }),
            name: "InvalidCredentialsError",
        });

    const accessToken = await new jose.SignJWT({
        id: user.id,
        tenant_id: user.tenant_id,
        name: user.name,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(new TextEncoder().encode(env.JWT_SECRET));

    const refreshToken = await new jose.SignJWT({
        id: user.id,
        tenant_id: user.tenant_id,
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
                message: getMessage({
                    key: "notFound",
                }),
                name: "UserNotFoundError",
            });

        return { ...user, password: undefined };
    } catch {
        throw new BadRequestError({
            code: 401,
            message: getMessage({
                key: "invalidToken",
            }),
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
            tenant_id: payload.tenant_id,
            name: payload.name,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("2h")
            .sign(new TextEncoder().encode(env.JWT_SECRET));

        const newRefreshToken = await new jose.SignJWT({
            id: payload.id,
            tenant_id: payload.tenant_id,
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
            message: getMessage({
                key: "invalidToken",
            }),
            name: "InvalidRefreshTokenError",
        });
    }
};

export const sendPasswordResetLink = async (email: string) => {
    const user = await userService.findOneByEmail(email);

    if (!user) return { message: getMessage({ key: "passwordResetLinkSent" }) };

    const passwordResetToken = await new jose.SignJWT({
        id: user.id,
        tenant_id: user.tenant_id,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(new TextEncoder().encode(env.PASSWORD_RESET_JWT_SECRET));

    try {
        let transporter = nodemailer.createTransport({
            service: "gmail", // Or another email service
            auth: {
                user: env.API_EMAIL,
                pass: env.API_EMAIL_PASSWORD,
            },
        });

        const baseUrl = env.NODE_ENV === "development" ? env.FRONTEND_URL_DEV : env.FRONTEND_URL_PROD;

        const url = `${baseUrl}/password-reset?passwordResetToken=${passwordResetToken}`;

        await transporter.sendMail({
            from: `"My App" <${env.API_EMAIL}>`, // Preferebly set a env variable for App name
            to: email,
            subject: getMessage({ key: "passwordResetEmailTitle" }),
            text: url,
        });
    } catch (error) {
        logger.error(error);
        throw new BadRequestError({
            code: 401,
            message: getMessage({
                key: "unableToSendPasswordResetLink",
            }),
            name: "UnableToSendPasswordResetLinkError",
        });
    }
};
