import { Buffer } from "node:buffer";

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GEMINI_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Image file is required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing." },
        { status: 500 },
      );
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Analyze this food image. Name the likely dish and list visible ingredients. Reply in 2-4 short friendly sentences.",
                },
                {
                  inlineData: {
                    mimeType: image.type || "image/jpeg",
                    data: imageBuffer.toString("base64"),
                  },
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text().catch(() => "");
      return NextResponse.json(
        { error: error || "Gemini image analysis failed." },
        { status: response.status },
      );
    }

    const data = (await response.json()) as GeminiResponse;
    const summary =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim() || "No summary returned.";

    return NextResponse.json({ summary });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to analyze image.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
