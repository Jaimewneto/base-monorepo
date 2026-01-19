import { userService } from "../services/user.js";

import { baseController } from "./baseController.js";

export const userController = baseController<"user">(userService);
