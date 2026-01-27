import { BadRequestError } from "../error.js";
import { getCurrentRequestUser } from "../request-context.js";
import { stockService } from "../services/stock.js";
import { getErrorMessage } from "../utils/messageTranslator.js";
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
                message: getErrorMessage({ key: "unauthedUser" }),
            });
        }

        return await stockService.createOrUpdate({
            tenant_id: user.tenant_id,
            warehouse_id,
            product_id,
            amount,
        });
    },
};
