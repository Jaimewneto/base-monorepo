import z from "zod/v4";

export const authRequestsValidations = () => {
    const me = z.object({
        accessToken: z.jwt(),
    });

    const login = z.object({
        email: z.email(),
        password: z.string().min(2).max(100),
    });

    const refreshToken = z.object({
        refreshToken: z.jwt(),
    });

    return {
        me,
        login,
        refreshToken,
    };
};
