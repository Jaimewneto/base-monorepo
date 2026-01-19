export const successResponse = <T>({
    data,
    message = "Request succeeded",
    status = 200,
}: {
    data: T;
    message?: string;
    status?: 200 | 201 | 202 | 204;
}) => {
    return {
        success: true,
        status,
        message,
        meta: {
            timestamp: new Date().toISOString(),
        },
        data,
    } as const;
};

export const paginatedResponse = <T>({
    list,
    total,
    page,
    per_page,
    message = "Request succeeded",
}: {
    list: T[];
    total: number;
    page: number;
    per_page: number;
    message?: string;
}) => {
    return {
        success: true,
        status: 200,
        message,
        meta: {
            page,
            per_page,
            total_pages: Math.ceil(total / per_page),
            total_registers: total,
            timestamp: new Date().toISOString(),
        },
        data: list,
    } as const;
};
