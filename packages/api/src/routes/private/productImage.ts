import { Hono } from "hono";

import { productImageController } from "../../controllers/productImage.js";

import { successResponse } from "../../utils/http-response.js";

import { zodValidate } from "../../utils/zodValidator.js";

import { productImageRequestsValidations } from "../../validations/http-requests/productImage.js";

const validations = productImageRequestsValidations();

export const productImageRoutes = new Hono().post(
    "/",
    zodValidate({ target: "json", schema: validations.insertMany }),
    async (c) => {
        const data = c.req.valid("json");

        return c.json(
            successResponse({
                data: await productImageController.insertMany(data),
                status: 201,
            }),
        );
    },
);
