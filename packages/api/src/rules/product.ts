import type { Kysely, SqlBool } from "kysely";

import { productRepository } from "../database/repositories/product.js";

import type { Database } from "../database/schema/index.js";
import type {
    ProductCreate,
    ProductUpdate,
} from "../database/schema/product.js";
import { BadRequestError } from "../error.js";
import { getErrorMessage } from "../utils/messageTranslator.js";

const validateSkuUniqueness = async ({
    sku,
    id,
    db,
}: {
    sku: string;
    id?: string;
    db: Kysely<Database>;
}) => {
    const existingProduct = await productRepository(db).findOneByCondition(
        (eb) => {
            const conditions = [
                eb("product.sku", "=", sku),
                eb("product.deleted_at", "is", null),
            ];

            if (id) {
                conditions.push(eb("product.id", "!=", id));
            }

            return eb.and(conditions) as unknown as SqlBool;
        },
    );

    if (existingProduct)
        throw new BadRequestError({
            message: getErrorMessage({ key: "productSkuAlreadyExists" }),
        });
};

const validateMpnUniqueness = async ({
    mpn,
    id,
    db,
}: {
    mpn: string;
    id?: string;
    db: Kysely<Database>;
}) => {
    const existingProduct = await productRepository(db).findOneByCondition(
        (eb) => {
            const conditions = [
                eb("product.mpn", "=", mpn),
                eb("product.deleted_at", "is", null),
            ];

            if (id) {
                conditions.push(eb("product.id", "!=", id));
            }

            return eb.and(conditions) as unknown as SqlBool;
        },
    );

    if (existingProduct)
        throw new BadRequestError({
            message: getErrorMessage({ key: "productMpnAlreadyExists" }),
        });
};

const validateGtinUniqueness = async ({
    gtin,
    id,
    db,
}: {
    gtin: string;
    id?: string;
    db: Kysely<Database>;
}) => {
    const existingProduct = await productRepository(db).findOneByCondition(
        (eb) => {
            const conditions = [
                eb("product.gtin", "=", gtin),
                eb("product.deleted_at", "is", null),
            ];

            if (id) {
                conditions.push(eb("product.id", "!=", id));
            }

            return eb.and(conditions) as unknown as SqlBool;
        },
    );

    if (existingProduct)
        throw new BadRequestError({
            message: getErrorMessage({ key: "productGtinAlreadyExists" }),
        });
};

export const productRules = ({ db }: { db: Kysely<Database> }) => ({
    validateCreate: async (product: ProductCreate) => {
        await validateSkuUniqueness({ sku: product.sku, db });
        if (product.mpn) await validateMpnUniqueness({ mpn: product.mpn, db });
        if (product.gtin)
            await validateGtinUniqueness({ gtin: product.gtin, db });
    },
    validateUpdate: async (product: ProductUpdate) => {
        if (product.sku)
            await validateSkuUniqueness({
                sku: product.sku,
                id: product.id,
                db,
            });
        if (product.mpn) await validateMpnUniqueness({ mpn: product.mpn, db });
        if (product.gtin)
            await validateGtinUniqueness({ gtin: product.gtin, db });
    },
});
