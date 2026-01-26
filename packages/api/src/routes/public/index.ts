import { Hono } from "hono";

import { authRoutes } from "./auth.js";
import { tenantRoutes } from "./tenant.js";

export const publicRoutes = new Hono()
    .route("/tenant", tenantRoutes)
    .route("/auth", authRoutes);
