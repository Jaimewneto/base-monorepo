import { Hono } from "hono";

import { companyController } from "../../controllers/company.js";
import { successResponse } from "../../utils/http-response.js";
import { zodValidate } from "../../utils/zodValidator.js";
import { companyRequestsValidations } from "../../validations/http-requests/company.js";

const validations = companyRequestsValidations();

export const companyRoutes = new Hono().post(
    "/",
    zodValidate({ target: "json", schema: validations.createWithUser }),
    async (c) => {
        const data = c.req.valid("json");

        return c.json(
            successResponse({
                data: await companyController.create(data),
                status: 201,
            }),
        );
    },
);
