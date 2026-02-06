import { env } from "../env.js";

import { errorMessages } from "../localization/errorMessages.js";
import { generalMessages } from "../localization/generalMessages.js";

type Language = "en" | "pt";

const messages = { ...errorMessages, ...generalMessages };

type MessageKey = keyof typeof messages;

export const getMessage = ({
    key,
    language = env.LANGUAGE,
}: {
    key: MessageKey;
    language?: Language;
}) => {
    return messages[key][language];
};
