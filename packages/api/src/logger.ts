import pino from "pino";

export const logger = pino({
    // Nível mínimo de log (info, debug, error, etc)
    level: process.env.LOG_LEVEL || "info",

    // No desenvolvimento, usamos o pino-pretty para legibilidade.
    // Em produção, deixamos o JSON puro para máxima performance.
    transport:
        process.env.NODE_ENV !== "production"
            ? {
                  target: "pino-pretty",
                  options: {
                      colorize: true,
                      translateTime: "HH:MM:ss Z",
                      ignore: "pid,hostname",
                  },
              }
            : undefined,
});
