import { Hono } from "hono";

import { authRoutes } from "./auth.js";
import { companyRoutes } from "./company.js";

export const publicRoutes = new Hono()
    .route("/company", companyRoutes)
    .route("/auth", authRoutes);
