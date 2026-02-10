"use client";

import React from "react";

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
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-gray-100" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {fileName ?? "Choose File"}
            </span>
            <span className="text-xs text-gray-500">JPG, PNG</span>
          </div>
        </div>

        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={onPickFile}
        />
      </label>

      <button
        onClick={onGenerate}
        disabled={!canGenerate}
        className="
            rounded-lg px-5 py-2 text-sm font-semibold bg-gray-300 text-white enabled:bg-gray-700 enabled:hover:bg-gray-800 disabled:cursor-not-allowed
           "
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      <button
        onClick={onGenerate}
        disabled={!canGenerate}
        className="h-11 rounded-lg bg-gray-700 px-6 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        type="button"
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}
