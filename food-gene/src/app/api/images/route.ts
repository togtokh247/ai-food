import { Buffer } from "node:buffer";

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_HF_MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to generate image.";
};

const toDataUrl = (mimeType: string, base64Data: string) =>
  `data:${mimeType};base64,${base64Data}`;

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
  const endpoint =
    process.env.HUGGINGFACE_API_URL?.trim() ||
    `https://router.huggingface.co/hf-inference/models/${model}`;

  return { apiKey, endpoint, model };
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

    const { apiKey, endpoint, model } = getHuggingFaceConfig();
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "image/png",
      },
      body: JSON.stringify({
        inputs: buildFoodPrompt(prompt),
        parameters: {
          negative_prompt:
            "collage, grid, diptych, triptych, multiple burgers, repeated objects, split screen, tiles, mosaic, text, watermark, logo",
          width: 1024,
          height: 768,
          num_inference_steps: 35,
          guidance_scale: 8,
        },
        options: {
          wait_for_model: true,
          use_cache: false,
        },
      }),
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok) {
      let details = `Hugging Face request failed with status ${response.status}.`;

      if (contentType.includes("application/json")) {
        const payload = (await response.json()) as {
          error?: string;
          estimated_time?: number;
        };

        if (payload.error) {
          details = payload.error;
        } else if (typeof payload.estimated_time === "number") {
          details = `Model is loading. Try again in about ${Math.ceil(payload.estimated_time)} seconds.`;
        }
      } else {
        const text = await response.text();

        if (text.trim()) {
          details = text.trim();
        }
      }

      return NextResponse.json({ error: details }, { status: response.status });
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const mimeType = contentType || "image/png";

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
    });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
