import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import { authController } from "../../controllers/auth.js";
import { env } from "../../env.js";
import { BadRequestError } from "../../error.js";
import { successResponse } from "../../utils/http-response.js";
import { zodValidate } from "../../utils/zodValidator.js";
import { authRequestsValidations } from "../../validations/http-requests/auth.js";

const validations = authRequestsValidations();

export const authRoutes = new Hono()
    .post(
        "/login",
        zodValidate({
            target: "json",
            schema: validations.login,
        }),
        async (c) => {
            const data = c.req.valid("json");

            const result = await authController.login(data);

            setCookie(c, "refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                sameSite: env.NODE_ENV === "production" ? "None" : "Lax",
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: "/",
            });

            return c.json(
                successResponse({
                    data: {
                        user: result.user,
                        accessToken: result.accessToken,
                    },
                }),
            );
        },
    )
    .post(
        "/me",
        zodValidate({ target: "json", schema: validations.me }),
        async (c) => {
            const { accessToken } = c.req.valid("json");

            return c.json(
                successResponse({ data: await authController.me(accessToken) }),
            );
        },
    )
    .post("/refresh", async (c) => {
        const refreshToken = getCookie(c, "refreshToken");

        if (!refreshToken) {
            throw new BadRequestError({
                code: 401,
                message: "Refresh token not found", // TODO: criar msg de erro
                name: "InvalidCredentialsError",
            });
        }

        const result = await authController.refreshToken(refreshToken);

        setCookie(c, "refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
        });

        return c.json(
            successResponse({
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                },
            }),
        );
    })
    .post("/logout", async (c) => {
        // Limpa o cookie
        deleteCookie(c, "refreshToken");
        return c.json(successResponse({ data: { success: true } }));
    })
    .post(
        "/password-reset-link",
        zodValidate({
            target: "json",
            schema: validations.passwordResetLink,
        }),
        async (c) => {
            const { email } = c.req.valid("json");

            return c.json(
                successResponse({
                    data: await authController.sendPasswordResetLink(email),
                }),
            );
        },
    )
    .post(
        "/reset-password",
        zodValidate({
            target: "json",
            schema: validations.passwordReset,
        }),
        async (c) => {
            const { passwordResetToken, password } = c.req.valid("json");

            return c.json(
                successResponse({
                    data: await authController.resetPassword({
                        passwordResetToken,
                        password,
                    }),
                }),
            );
        },
    );
