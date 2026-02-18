import { GoogleGenAI } from "@google/genai";

import { BadRequestError } from "../../error.js";

import { env } from "../../env.js";
import { getMessage } from "../../utils/messageTranslator.js";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export const getPartDescriptionWithAi = async (partNumber: string) => {
  const prompt = `Localize a peça código "${partNumber}" no mercado brasileiro e retorne apenas um JSON no formato:
  {"description": "<descrição técnica CURTA da peça em ${env.LANGUAGE === "en" ? "inglês" : "português"}>", "error": false (ou true caso não encontre)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    if (!response.text) {
      throw new BadRequestError({
        message: getMessage({ key: "noProductDescriptionFound" }),
      });
    }

    if (typeof response.text !== "string") {
      throw new BadRequestError({
        message: getMessage({ key: "noProductDescriptionFound" }),
      });
    }

    const cleanJson = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result: { description: string; error: boolean } = JSON.parse(cleanJson)

    if (result.error) {
      throw new BadRequestError({
        message: getMessage({ key: "errorFetchingProductDescription" }),
      });
    }

    return result.description;
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw new BadRequestError({
        message: error.message,
      });
    }

    throw new BadRequestError({
      message: getMessage({ key: "errorFetchingProductDescription" }),
    });
  }
};
