import { client } from "../database/client.js";

import { logger } from "../logger.js";

const toMB = (n: number) => (n / 1024 / 1024).toFixed(2);

const memoryMonitor = (ms = 5000) => {
    setInterval(() => {
        const mem = process.memoryUsage();

        logger.info({
            rss: `${toMB(mem.rss)} MB`,
            heapUsed: `${toMB(mem.heapUsed)} MB`,
            heapTotal: `${toMB(mem.heapTotal)} MB`,
            external: `${toMB(mem.external)} MB`,
        });
    }, ms);
};

const shutdown = async (signal: string) => {
    logger.info(`Shutting down (${signal})...`);

    const timeout = setTimeout(() => {
        logger.error("Forced shutdown");
        process.exit(1);
    }, 10_000);

    try {
        await client.destroy();
        logger.info(`Database connection closed...`);

        clearTimeout(timeout);
        process.exit(0);
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
};

export const processUtils = {
    memoryMonitor,
    shutdown,
};
