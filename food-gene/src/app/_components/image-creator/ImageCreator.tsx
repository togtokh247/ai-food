"use client";

import { useState } from "react";

import { ImageCreatorInput } from "./ImageCreatorInput";
import { ImageCreatorResult } from "./ImageCreatorResult";

type ImageResponse = {
  imageUrl?: string;
  isFallback?: boolean;
  message?: string;
  error?: string;
};

const escapeSvgText = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const createFallbackImage = (prompt: string) => {
  const safePrompt = escapeSvgText(prompt).slice(0, 96);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="768" viewBox="0 0 1024 768">
  <rect width="1024" height="768" fill="#1f1308"/>
  <rect x="72" y="72" width="880" height="624" rx="44" fill="#fed7aa"/>
  <circle cx="512" cy="390" r="210" fill="#fff7ed" stroke="#9a3412" stroke-opacity="0.25" stroke-width="18"/>
  <circle cx="438" cy="342" r="54" fill="#ef4444"/>
  <circle cx="555" cy="335" r="48" fill="#22c55e"/>
  <circle cx="600" cy="440" r="62" fill="#facc15"/>
  <circle cx="460" cy="458" r="70" fill="#fb923c"/>
  <text x="512" y="132" text-anchor="middle" fill="#7c2d12" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700">Food Gene Preview</text>
  <text x="512" y="650" text-anchor="middle" fill="#431407" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="600">${safePrompt || "Generated food image"}</text>
</svg>`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const ImageCreator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const onGenerate = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setLoading(true);
    setImageUrl(null);
    setIsFallback(false);
    setError("");
    setMessage("Зураг үүсгэж байна...");

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      });

      const data = (await response.json()) as ImageResponse;

      if (!response.ok || !data.imageUrl) {
        throw new Error(data.error ?? "Зураг үүсгэхэд алдаа гарлаа.");
      }

      setImageUrl(data.imageUrl);
      setIsFallback(Boolean(data.isFallback));
      setMessage(data.message ?? "Зураг амжилттай үүслээ.");
    } catch (err) {
      const details =
        err instanceof Error ? err.message : "Зураг үүсгэхэд алдаа гарлаа.";

      setImageUrl(createFallbackImage(trimmedPrompt));
      setIsFallback(true);
      setError("");
      setMessage(
        `AI provider түр ажиллахгүй байна. Demo preview харуулж байна. (${details})`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Food image creator</h2>
        <p className="mt-1 text-sm text-gray-500">
          Хоолны зургийг browser дотор үүсгэнэ 
        </p>
      </div>

      <ImageCreatorInput
        prompt={prompt}
        loading={loading}
        onChange={setPrompt}
        onGenerate={onGenerate}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-amber-700">{message}</p>}

      <ImageCreatorResult imageUrl={imageUrl} isFallback={isFallback} />
    </div>
  );
};
