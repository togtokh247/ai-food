"use client";

import React from "react";

export function ImagePreview({ previewUrl }: { previewUrl: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="mb-3 text-sm font-medium text-gray-700">Preview</p>
      <img
        src={previewUrl}
        alt="preview"
        className="max-h-72 w-auto rounded-md border border-gray-200 bg-white"
      />
    </div>
  );
}
