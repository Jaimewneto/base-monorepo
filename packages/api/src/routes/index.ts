import { Hono } from "hono";

import { privateRoutes } from "./private/index.js";
import { publicRoutes } from "./public/index.js";

export const routes = new Hono()
    .route("/public", publicRoutes)
    .route("/private", privateRoutes);
