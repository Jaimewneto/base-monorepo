import { cardexRepository } from "../database/repositories/cardex.js";

import { baseService } from "./baseService.js";

export const cardexService = baseService<"cardex">(cardexRepository());
