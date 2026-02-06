import { Hono } from "hono";

import { authController } from "../../controllers/auth.js";
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

            return c.json(
                successResponse({ data: await authController.login(data) }),
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
    .post(
        "/refresh",
        zodValidate({ target: "json", schema: validations.refreshToken }),
        async (c) => {
            const { refreshToken } = c.req.valid("json");

            return c.json(
                successResponse({
                    data: await authController.refreshToken(refreshToken),
                }),
            );
        },
    )
    .post(
        "/password-reset-link",
        zodValidate({
            target: "json",
            schema: validations.passwordReset,
        }),
        async (c) => {
            const { email } = c.req.valid("json");

            return c.json(
                successResponse({
                    data: await authController.sendPasswordResetLink(email),
                }),
            );
        },
    );
