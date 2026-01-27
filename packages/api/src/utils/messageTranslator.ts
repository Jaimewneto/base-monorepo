import { env } from "../env.js";

import { errorMessages } from "../localization/errorMessages.js";

type Language = "en" | "pt";

type MessageKey = keyof typeof errorMessages;

const messages = { ...errorMessages };

export const getErrorMessage = ({
    key,
    language = env.LANGUAGE,
}: {
    key: MessageKey;
    language?: Language;
}) => {
    return messages[key][language];
};
