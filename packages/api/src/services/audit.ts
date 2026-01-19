import { auditRepository } from "../database/repositories/audit.js";

import { baseService } from "./baseService.js";

export const auditService = baseService<"audit">(auditRepository());
