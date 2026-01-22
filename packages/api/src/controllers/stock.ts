import { create } from "domain";
import type { SqlBool } from "kysely";
import type { Database } from "../database/schema/index.js";
import { BadRequestError } from "../error.js";
import { getCurrentRequestUser } from "../request-context.js";
import { stockService } from "../services/stock.js";
import type { OrderBy } from "../types/http-query/orderBy.js";
import type { Where } from "../types/http-query/where.js";
import type { ZodSortMap, ZodWhereMap } from "../types/http-query/zod.js";
import { buildOrderBy, buildWhereExpression } from "../utils/http-query.js";
import { baseController } from "./baseController.js";

export const base = baseController<"stock">(stockService);

export const stockController = {
    ...base,

    createOrUpdate: async ({
        warehouse_id,
        product_id,
        amount,
    }: {
        warehouse_id: string;
        product_id: string;
        amount: number;
    }) => {
        const user = getCurrentRequestUser();

        if (!user) {
            throw new BadRequestError({
                message: "Usuário não autenticado",
            });
        }

        return await stockService.createOrUpdate({
            company_id: user.company_id,
            warehouse_id,
            product_id,
            amount,
        });
    },
};
