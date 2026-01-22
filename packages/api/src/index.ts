import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { env } from "./env.js";
import { BadRequestError } from "./error.js";
import { logger } from "./logger.js";
import { routes } from "./routes/index.js";
import { processUtils } from "./utils/process.js";

const server = new Hono()
    .use(
        "*",
        cors({
            origin:
                env.NODE_ENV === "production"
                    ? env.FRONTEND_URL_PROD
                    : [env.FRONTEND_URL_DEV, env.FRONTEND_URL_PREVIEW],
            allowHeaders: ["Authorization", "Content-Type"],
            allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            maxAge: 86400,
        }),
    )
    .onError((err, c) => {
        if (err instanceof BadRequestError) {
            return c.json(
                {
                    success: false,
                    error: {
                        message: err.message,
                        name: err.name,
                    },
                } as const,
                err.code,
            );
        }

        logger.error(err);

        return c.json(
            {
                success: false,
                error: {
                    message: "Internal server error",
                },
            },
            500,
        );
    })
    .route("/", routes);

serve(
    {
        fetch: server.fetch,
        port: env.PORT,
    },
    (info) => {
        logger.info(`Server is running on https://localhost:${info.port}`);

        if (env.NODE_ENV === "development") {
            processUtils.memoryMonitor();
        }
    },
);

process.on("SIGINT", processUtils.shutdown);
process.on("SIGTERM", processUtils.shutdown);

export { server };

export type AppType = typeof server;
