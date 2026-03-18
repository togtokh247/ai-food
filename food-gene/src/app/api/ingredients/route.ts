import { NextRequest, NextResponse } from "next/server";
import { Type } from "@google/genai";

import { getGeminiClient } from "@/lib/gemini";

export const runtime = "nodejs";

type IngredientPayload = {
  ingredients?: string[];
};

const parseIngredientPayload = (text: string): string[] => {
  const parsed = JSON.parse(text) as IngredientPayload;
  const items = Array.isArray(parsed.ingredients) ? parsed.ingredients : [];

  return items
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 30);
};

export async function POST(req: NextRequest) {
  try {
    const { text } = (await req.json()) as { text?: string };

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Food description is required." },
        { status: 400 },
      );
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract the ingredients from this food description. Return only the requested JSON shape.\n\nFood description: ${text.trim()}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ["ingredients"],
        },
      },
    });

    const raw = response.text?.trim() ?? "";
    const ingredients = raw ? parseIngredientPayload(raw) : [];

    return NextResponse.json({
      raw,
      ingredients,
    });
  } catch (error: unknown) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to extract ingredients.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
