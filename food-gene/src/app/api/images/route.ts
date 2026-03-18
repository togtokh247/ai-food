import { NextRequest, NextResponse } from "next/server";

import { getGeminiClient } from "@/lib/gemini";

export const runtime = "nodejs";

const toDataUrl = (mimeType: string, base64Data: string) =>
  `data:${mimeType};base64,${base64Data}`;

const createFallbackImage = (prompt: string) => {
  const safePrompt = prompt.trim() || "Food concept";
  const title = safePrompt.slice(0, 42).replace(/[<&>]/g, "");
  const subtitle = safePrompt.slice(42, 92).replace(/[<&>]/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="768" viewBox="0 0 1024 768">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fff3d6" />
          <stop offset="45%" stop-color="#ffbe7a" />
          <stop offset="100%" stop-color="#c85a3d" />
        </linearGradient>
      </defs>
      <rect width="1024" height="768" fill="url(#bg)" rx="32" />
      <circle cx="172" cy="154" r="96" fill="#fff9ef" fill-opacity="0.45" />
      <circle cx="842" cy="140" r="128" fill="#7f3220" fill-opacity="0.16" />
      <circle cx="832" cy="614" r="148" fill="#fff0db" fill-opacity="0.24" />
      <rect x="86" y="98" width="852" height="572" rx="40" fill="#fffaf4" fill-opacity="0.86" />
      <text x="126" y="230" fill="#884027" font-size="38" font-family="Segoe UI, Arial, sans-serif" font-weight="700">
        AI Food Preview
      </text>
      <text x="126" y="322" fill="#3d2419" font-size="56" font-family="Segoe UI, Arial, sans-serif" font-weight="700">
        ${title || "Food concept"}
      </text>
      <text x="126" y="392" fill="#5a4034" font-size="28" font-family="Segoe UI, Arial, sans-serif">
        ${subtitle || "Preview shown because live image generation is unavailable on this plan."}
      </text>
      <text x="126" y="510" fill="#8d5f47" font-size="24" font-family="Segoe UI, Arial, sans-serif">
        Gemini image generation needs a paid plan, so this is a local demo preview.
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to generate image.";
};

export async function POST(req: NextRequest) {
  const { prompt } = (await req.json()) as { prompt?: string };

  try {
    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Image prompt is required." },
        { status: 400 },
      );
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: prompt.trim(),
      config: {
        numberOfImages: 1,
        aspectRatio: "4:3",
        outputMimeType: "image/png",
      },
    });

    const image = response.generatedImages?.[0]?.image;
    const imageBytes = image?.imageBytes;
    const mimeType = image?.mimeType ?? "image/png";

    if (!imageBytes) {
      return NextResponse.json(
        { error: "Gemini did not return an image for this prompt." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      imageUrl: toDataUrl(mimeType, imageBytes),
      isFallback: false,
    });
  } catch (error: unknown) {
    console.error(error);
    const message = getErrorMessage(error);
    const needsPaidPlan =
      message.toLowerCase().includes("paid plans") ||
      message.toLowerCase().includes("only available on paid plans") ||
      message.toLowerCase().includes("imagen 3");

    if (needsPaidPlan) {
      return NextResponse.json({
        imageUrl: createFallbackImage(prompt ?? ""),
        isFallback: true,
        message:
          "Live Gemini image generation needs a paid Google AI plan. Showing a local demo preview instead.",
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
