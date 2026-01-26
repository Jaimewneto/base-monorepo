import { Hono } from "hono";

import { tenantController } from "../../controllers/tenant.js";
import { successResponse } from "../../utils/http-response.js";
import { zodValidate } from "../../utils/zodValidator.js";
import { tenantRequestsValidations } from "../../validations/http-requests/tenant.js";

const validations = tenantRequestsValidations();

export const tenantRoutes = new Hono().post(
    "/",
    zodValidate({ target: "json", schema: validations.createWithUser }),
    async (c) => {
        const data = c.req.valid("json");

        return c.json(
            successResponse({
                data: await tenantController.create(data),
                status: 201,
            }),
        );
    },
);
