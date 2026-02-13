"use client";

import { useState } from "react";
import { ImageCreatorInput } from "./ImageCreatorInput";
import { ImageCreatorResult } from "./ImageCreatorResult";

export function ImageCreator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onGenerate = async () => {
    if (!prompt) return;

    setLoading(true);
    setImageUrl(null);
    setTimeout(() => {
      setImageUrl(
        "https://images.unsplash.com/photo-1604908177522-432e3b5a1a5d",
      );
      setLoading(false);
    }, 1000);
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

      <ImageCreatorResult imageUrl={imageUrl} />
    </div>
  );
}
