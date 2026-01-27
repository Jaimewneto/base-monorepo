import z from "zod/v4";

import { env } from "../../env.js";

z.config(z.locales[env.LANGUAGE]());

export { z as zod };
