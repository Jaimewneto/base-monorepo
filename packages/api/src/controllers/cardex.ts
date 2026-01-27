import { cardexService } from "../services/cardex.js";

import { baseController } from "./baseController.js";

export const cardexController = baseController<"cardex">(cardexService);
