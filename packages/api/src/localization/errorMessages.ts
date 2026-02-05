export const errorMessages = {
    // HTTP
    badRequest: {
        pt: "Requisição inválida",
        en: "Invalid request",
    },
    unauthorized: {
        pt: "Não autorizado",
        en: "Unauthorized",
    },
    forbidden: {
        pt: "Proibido",
        en: "Forbidden",
    },
    notFound: {
        pt: "Não encontrado",
        en: "Not found",
    },
    internalServerError: {
        pt: "Erro interno do servidor",
        en: "Internal server error",
    },
    badGateway: {
        pt: "Erro de gateway",
        en: "Bad gateway",
    },
    serviceUnavailable: {
        pt: "Serviço indisponível",
        en: "Service unavailable",
    },
    gatewayTimeout: {
        pt: "Tempo limite de gateway",
        en: "Gateway timeout",
    },
    // AUTH
    wrongEmailOrPassword: {
        pt: "Email ou senha incorretos",
        en: "Wrong email or password",
    },
    missingOrInvalidAuthHeader: {
        pt: "Cabeçalho de autorização ausente ou inválido",
        en: "Missing or invalid authorization header",
    },
    unauthedUser: {
        pt: "Usuário não autenticado",
        en: "Unauthenticated user",
    },
    invalidToken: {
        pt: "Token inválido",
        en: "Invalid token",
    },
    expiredToken: {
        pt: "Token expirado",
        en: "Expired token",
    },
    // USER
    userEmailAlreadyExists: {
        pt: "Email já cadastrado",
        en: "Email already exists",
    },
    // PRODUCT
    cannotDeleteProductWithExistingStock: {
        pt: "Não é possível excluir um produto com estoque maior que zero",
        en: "Cannot delete product with existing stock greater than zero",
    },
    cannotUploadMoreThanTenImages: {
        pt: "Não é possível enviar mais de dez imagens",
        en: "Cannot upload more than ten images",
    },
    oneMainImageOnly: {
        pt: "Só é possível enviar uma imagem principal",
        en: "Only one main image is allowed",
    },
    productSkuAlreadyExists: {
        pt: "SKU já cadastrado",
        en: "SKU already exists",
    },
    productMpnAlreadyExists: {
        pt: "Código de fabricante já cadastrado",
        en: "Manufacturer code already exists",
    },
    productGtinAlreadyExists: {
        pt: "Código de barras já cadastrado",
        en: "Barcode already exists",
    },
    // STOCK
    cannotCreateStockWithZeroAmount: {
        pt: "Não é possível criar um estoque com quantidade zero",
        en: "Cannot create stock with zero amount",
    },
    // WAREHOUSE
    cannotDeleteWarehouseWithExistingStock: {
        pt: "Não é possível excluir um estoque com quantidade maior que zero",
        en: "Cannot delete warehouse with existing stock greater than zero",
    },
} as const;
