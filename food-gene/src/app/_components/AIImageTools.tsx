"use client";

import React, { useMemo, useState } from "react";
import { ImageUploadRow } from "./ImageUploadRow";
import { ImagePreview } from "./ImagePreview";
import { SummaryBox } from "./SummaryBox";
import { IngredientRecognition } from "./IngredientRecognition";
import { ImageCreator } from "./image-creator/ImageCreator";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

type Props = {
  endpoint?: string;
  title?: string;
  accept?: string;
};

type TabKey = "analysis" | "ingredients" | "creator";

export const AIImageTools = ({
  endpoint = "/api/ai/image-analysis",
  title = "AI tools",
  accept = "image/png,image/jpeg",
}: Props) => {
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
        err instanceof Error ? `Error: ${err.message}` : "Error: Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>Upload an image and generate results.</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="creator">Creator</TabsTrigger>
              </TabsList>

              <Separator className="my-6" />

              <TabsContent value="analysis" className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Image analysis</h2>
                  <p className="text-sm text-muted-foreground">
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
              </TabsContent>

              <TabsContent value="ingredients" className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Ingredient recognition</h2>
                  <p className="text-sm text-muted-foreground">
                    Энэ tab дээр ingredients-ийг tag/chip болгож харуулж болно.
                  </p>
                </div>

                <IngredientRecognition />
              </TabsContent>

              <TabsContent value="creator" className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Image creator</h2>
                  <p className="text-sm text-muted-foreground">
                    Энэ tab дээр text prompt-аас image үүсгэдэг UI хийж болно.
                  </p>
                </div>

                <ImageCreator />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
