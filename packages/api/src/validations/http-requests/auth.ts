import { zod as z } from "./index.js";

export const authRequestsValidations = () => {
    const me = z.object({
        accessToken: z.jwt(),
    });

    const login = z.object({
        email: z.email(),
        password: z.string().min(2).max(100),
    });

    const passwordReset = z.object({
        passwordResetToken: z.string(),
        password: z.string().min(2).max(100),
    });

    const passwordResetLink = z.object({
        email: z.email(),
    });

    const refreshToken = z.object({
        refreshToken: z.jwt(),
    });

    return {
        me,
        login,
        passwordReset,
        passwordResetLink,
        refreshToken,
    };
};
