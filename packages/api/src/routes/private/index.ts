import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.js";
import { inventoryRoutes } from "./inventory.js";
import { inventoryMovementRoutes } from "./inventoryMovement.js";
import { productRoutes } from "./product.js";
import { tenantRoutes } from "./tenant.js";
import { userRoutes } from "./user.js";
import { warehouseRoutes } from "./warehouse.js";

export const privateRoutes = new Hono()
    .use("*", authMiddleware)
    .route("/tenant", tenantRoutes)
    .route("/user", userRoutes)
    .route("/product", productRoutes)
    .route("/warehouse", warehouseRoutes)
    .route("/inventory", inventoryRoutes)
    .route("/inventory-movement", inventoryMovementRoutes);
