import { Buffer } from "node:buffer";

import {
  InferenceClient,
  PROVIDERS_OR_POLICIES,
  type InferenceProviderOrPolicy,
} from "@huggingface/inference";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_HF_MODEL = "black-forest-labs/FLUX.1-schnell";
const DEFAULT_HF_PROVIDER: InferenceProviderOrPolicy = "auto";
const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to generate image.";
};

const toDataUrl = (mimeType: string, base64Data: string) =>
  `data:${mimeType};base64,${base64Data}`;

const escapeSvgText = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const buildFallbackImage = (prompt: string) => {
  const safePrompt = escapeSvgText(prompt.trim()).slice(0, 96);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="768" viewBox="0 0 1024 768">
  <defs>
    <linearGradient id="plate" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#fff7ed"/>
      <stop offset="48%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="48%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="768" fill="#1f1308"/>
  <rect x="64" y="64" width="896" height="640" rx="48" fill="url(#plate)"/>
  <circle cx="512" cy="384" r="245" fill="url(#glow)"/>
  <circle cx="512" cy="392" r="190" fill="#fffaf0" stroke="#7c2d12" stroke-opacity="0.22" stroke-width="18"/>
  <circle cx="442" cy="342" r="54" fill="#ef4444"/>
  <circle cx="548" cy="334" r="48" fill="#22c55e"/>
  <circle cx="598" cy="432" r="62" fill="#facc15"/>
  <circle cx="462" cy="454" r="70" fill="#fb923c"/>
  <path d="M359 506c106 62 216 62 326 0" fill="none" stroke="#7c2d12" stroke-opacity="0.38" stroke-width="18" stroke-linecap="round"/>
  <text x="512" y="124" text-anchor="middle" fill="#7c2d12" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700">Food Gene Preview</text>
  <text x="512" y="658" text-anchor="middle" fill="#431407" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="600">${safePrompt || "Generated food image"}</text>
</svg>`.trim();

  return toDataUrl("image/svg+xml", Buffer.from(svg).toString("base64"));
};

const buildFoodPrompt = (prompt: string) =>
  [
    "A single plated food photograph.",
    "Photorealistic professional food photography.",
    "One dish only, centered composition.",
    "Close-up hero shot with natural lighting, shallow depth of field.",
    "Highly detailed textures, realistic colors, clean background.",
    "No collage, no grid, no split panels, no multiple copies, no text, no watermark.",
    `Dish: ${prompt.trim()}.`,
  ].join(" ");

const getHuggingFaceConfig = () => {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "HUGGINGFACE_API_KEY is missing. Add it to .env.local to enable image generation.",
    );
  }

  const model = process.env.HUGGINGFACE_MODEL?.trim() || DEFAULT_HF_MODEL;
  const endpointUrl = normalizeEndpointUrl(process.env.HUGGINGFACE_API_URL);
  const provider = parseProvider(process.env.HUGGINGFACE_PROVIDER);

  return { apiKey, endpointUrl, model, provider };
};

const parseProvider = (
  provider: string | undefined,
): InferenceProviderOrPolicy => {
  const normalized = provider?.trim();

  if (!normalized) {
    return DEFAULT_HF_PROVIDER;
  }

  if (PROVIDERS_OR_POLICIES.includes(normalized as InferenceProviderOrPolicy)) {
    return normalized as InferenceProviderOrPolicy;
  }

  throw new Error(
    `Unsupported HUGGINGFACE_PROVIDER "${normalized}". Use "auto" or a supported Hugging Face Inference Provider.`,
  );
};

const normalizeEndpointUrl = (endpointUrl: string | undefined) => {
  const normalized = endpointUrl?.trim();

  if (!normalized) {
    return undefined;
  }

  if (normalized.includes("router.huggingface.co/hf-inference")) {
    return undefined;
  }

  return normalized;
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

    const { apiKey, endpointUrl, model, provider } = getHuggingFaceConfig();
    const client = new InferenceClient(apiKey);
    const image = await client.textToImage(
      {
        ...(endpointUrl ? { endpointUrl } : { model, provider }),
        inputs: buildFoodPrompt(prompt),
        parameters: {
          negative_prompt:
            "collage, grid, diptych, triptych, multiple burgers, repeated objects, split screen, tiles, mosaic, text, watermark, logo",
          width: 1024,
          height: 768,
          num_inference_steps: 28,
          guidance_scale: 7,
        },
      },
      { outputType: "blob" },
    );

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const mimeType = image.type || "image/png";

    if (!imageBuffer.length) {
      return NextResponse.json(
        { error: "Hugging Face returned an empty image response." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      imageUrl: toDataUrl(mimeType, imageBuffer.toString("base64")),
      isFallback: false,
      model,
      provider,
    });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error(error);
    return NextResponse.json({
      imageUrl: buildFallbackImage(prompt ?? ""),
      isFallback: true,
      message: `AI image provider түр ажиллахгүй байна. Demo preview харуулж байна. (${message})`,
      error: message,
    });
  }
}
