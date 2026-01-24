import { z } from "zod/v4";

import { logger } from "./logger.js";

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    API_URL_DEV: z.url().default("http://localhost"),
    API_URL_PROD: z.url().default("https://base-monorepo.onrender.com"),
    PORT: z.coerce.number().default(3000),

    JWT_SECRET: z.string().min(20),

    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce.number().default(5432),
    DB_USERNAME: z.string().default("postgres"),
    DB_PASSWORD: z.string(),
    DB_DATABASE: z.string(),

    DB_SSL: z
        .preprocess((val) => val === "true" || val === "1", z.boolean())
        .default(false),

    FRONTEND_URL_DEV: z.url().default("http://localhost:5173"),
    FRONTEND_URL_PREVIEW: z.url().default("http://localhost:4173"),
    FRONTEND_URL_PROD: z.url().default("https://base-monorepo.pages.dev"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    logger.error(
        `❌ Invalid environment variables: ${JSON.stringify(_env.error.format())}`,
    );
    process.exit(1);
}

export const env = _env.data;
