export type ProductImageInsertMany = {
        id?: string;
        tenant_id: string;
        product_id: string;
        url: string;
        main: boolean;
    }[]