"use client";

import React, { useMemo, useState } from "react";
import { AIToolsTabs, TabKey } from "./AIToolsTabs";
import { ImageUploadRow } from "./ImageUploadRow";
import { ImagePreview } from "./ImagePreview";
import { SummaryBox } from "./SummaryBox";
import { IngredientRecognition } from "./IngredientRecognition";
import { ImageCreator } from "./image-creator/ImageCreator";

type Props = {
  endpoint?: string;
  title?: string;
  accept?: string;
};

export function AIImageTools({
  endpoint = "/api/ai/image-analysis",
  title = "AI tools",
  accept = "image/png,image/jpeg",
}: Props) {
  const [tab, setTab] = useState<TabKey>("analysis");

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string>("");

  const canGenerate = useMemo(() => !!file && !loading, [file, loading]);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;

    setFile(f);
    setSummary("");

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  };

  const onGenerate = async () => {
    if (!file) return;

    setLoading(true);
    setSummary("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || "Request failed");
      }

      const data = (await res.json()) as { summary?: string };
      setSummary(data.summary ?? "No summary returned.");
    } catch (err) {
      setSummary(
        err instanceof Error
          ? `Error: ${err.message}`
          : "Error: Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload an image and generate results.
          </p>
        </div>

        <AIToolsTabs tab={tab} onChange={setTab} />

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {tab === "analysis" && (
            <div className="space-y-6">
              <div>
                <span className="text-lg font-semibold text-gray-900">
                  Image analysis
                </span>
                <p className="mt-2 text-sm text-gray-500">
                  Upload a food photo, and AI will detect the ingredients.
                </p>
              </div>

              <ImageUploadRow
                fileName={file?.name}
                accept={accept}
                loading={loading}
                canGenerate={canGenerate}
                onPickFile={onPickFile}
                onGenerate={onGenerate}
              />

              {previewUrl && <ImagePreview previewUrl={previewUrl} />}

              <SummaryBox summary={summary} />
            </div>
          )}

          {tab === "ingredients" && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Ingredient recognition
              </h2>
              <p className="text-sm text-gray-500">
                Энэ tab дээр ingredients-ийг tag/chip болгож харуулж болно.
              </p>
            </div>
          )}
          {tab === "ingredients" && <IngredientRecognition />}
          {tab === "creator" && <ImageCreator />}

          {tab === "creator" && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Image creator
              </h2>
              <p className="text-sm text-gray-500">
                Энэ tab дээр text prompt-аас image үүсгэдэг UI хийж болно.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
