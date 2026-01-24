export type ProductImageInsertMany = {
        id?: string;
        company_id: string;
        product_id: string;
        url: string;
        main: boolean;
    }[]