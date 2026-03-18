import { GoogleGenAI } from "@google/genai";

export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add it to .env.local to enable Gemini features.",
    );
  }

  return new GoogleGenAI({ apiKey });
};
