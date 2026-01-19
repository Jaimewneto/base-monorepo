import type { SqlBool } from "kysely";
import type { CardexCreate } from "../database/schema/cardex.js";

import { cardexService } from "../services/cardex.js";
import type {
    CardexSortZodValidation,
    CardexWhereZodValidation,
} from "../types/http-query/zod.js";
import { buildOrderBy, buildWhereExpression } from "../utils/http-query.js";

export const cardexController = {
    findMany: async ({
        limit,
        page,
        where,
        sort,
    }: {
        limit: number;
        page: number;
        where?: CardexWhereZodValidation;
        sort?: CardexSortZodValidation;
    }) => {
        const finalWhere = buildWhereExpression<"cardex">(where);
        const orderBy = buildOrderBy<"cardex">(sort);

        return await cardexService.findMany({
            limit,
            page,
            where: finalWhere
                ? (eb) => finalWhere(eb) as unknown as SqlBool
                : undefined,
            orderBy,
        });
    },

    create: async (data: CardexCreate) => {
        return await cardexService.create(data);
    },
};
