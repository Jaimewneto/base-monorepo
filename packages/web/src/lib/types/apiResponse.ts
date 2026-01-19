export type SingleDataSuccessResponse<T> = {
    success: true;
    status: 200 | 201 | 202 | 204;
    message: string;
    meta: {
        timestamp: Date;
    };
    data: T;
};

export type PaginatedDataSuccessResponse<T> = {
    success: true;
    status: 200;
    message: string;
    meta: {
        total: number;
        page: number;
        per_page: number;
        total_pages: number;
        timestamp: Date;
    };
    data: T[];
};

export type ErrorResponse = {
    success: false;
    error: {
        message: string;
        name: string;
    };
};

export type SingleDataResponse<T> =
    | SingleDataSuccessResponse<T>
    | ErrorResponse;

export type PaginatedDataResponse<T> =
    | PaginatedDataSuccessResponse<T>
    | ErrorResponse;
