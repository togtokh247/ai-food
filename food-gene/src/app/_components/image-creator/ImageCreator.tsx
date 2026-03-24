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

      if (!response.ok) {
        throw new Error(data.error ?? "Зураг үүсгэхэд алдаа гарлаа.");
      }

      if (!data.imageUrl) {
        throw new Error("Зураг буцааж ирсэнгүй.");
      }

      setImageUrl(data.imageUrl);
      setIsFallback(Boolean(data.isFallback));
      setMessage(
        data.message ??
          (data.isFallback
            ? "Demo preview зураг харуулж байна."
            : "Зураг амжилттай үүслээ."),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Зураг үүсгэхэд алдаа гарлаа.",
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
