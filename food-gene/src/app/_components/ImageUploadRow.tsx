"use client";

import React, { useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Upload } from "lucide-react";

export function ImageUploadRow({
  fileName,
  accept = "image/png,image/jpeg",
  loading,
  canGenerate,
  onPickFile,
  onGenerate,
}: {
  fileName?: string;
  accept?: string;
  loading: boolean;
  canGenerate: boolean;
  onPickFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
}) {
  const inputId = useId();

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
      {/* File picker */}
      <label
        htmlFor={inputId}
        className={cn(
          "flex cursor-pointer items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3",
          "hover:bg-muted/50",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-muted">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {fileName ?? "Choose file"}
            </span>
            <span className="text-xs text-muted-foreground">JPG, PNG</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Upload className="h-4 w-4" />
          Browse
        </div>

        <Input
          id={inputId}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onPickFile}
        />
      </label>
      <Button
        onClick={onGenerate}
        disabled={!canGenerate}
        className="h-11 px-6"
        type="button"
      >
        {loading ? "Generating..." : "Generate"}
      </Button>
    </div>
  );
}
