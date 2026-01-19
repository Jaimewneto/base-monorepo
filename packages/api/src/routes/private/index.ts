import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.js";
import { cardexRoutes } from "./cardex.js";
import { companyRoutes } from "./company.js";
import { productRoutes } from "./product.js";
import { stockRoutes } from "./stock.js";
import { userRoutes } from "./user.js";
import { warehouseRoutes } from "./warehouse.js";

export const privateRoutes = new Hono()
    .use("*", authMiddleware)
    .route("/company", companyRoutes)
    .route("/user", userRoutes)
    .route("/product", productRoutes)
    .route("/warehouse", warehouseRoutes)
    .route("/stock", stockRoutes)
    .route("/cardex", cardexRoutes);
