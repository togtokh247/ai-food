"use client";

import { useState } from "react";
import { ImageCreatorInput } from "./ImageCreatorInput";
import { ImageCreatorResult } from "./ImageCreatorResult";

type ImageResponse = {
  imageUrl?: string;
  error?: string;
  message?: string;
  isFallback?: boolean;
};

export const ImageCreator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isFallback, setIsFallback] = useState(false);

  const onGenerate = async () => {
    if (!prompt) return;

    setLoading(true);
    setImageUrl(null);
    setError("");
    setMessage("");
    setIsFallback(false);

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = (await response.json()) as ImageResponse;

      if (!response.ok) {
        throw new Error(data.error || "Image generation request failed.");
      }

      setImageUrl(data.imageUrl ?? null);
      setMessage(data.message ?? "");
      setIsFallback(Boolean(data.isFallback));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong while generating the image.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Food image creator
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          What food image do you want? Describe it briefly.
        </p>
      </div>

      <ImageCreatorInput
        prompt={prompt}
        loading={loading}
        onChange={setPrompt}
        onGenerate={onGenerate}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && (
        <p className="text-sm text-amber-700">
          {message}
        </p>
      )}

      <ImageCreatorResult imageUrl={imageUrl} isFallback={isFallback} />
    </div>
  );
};
