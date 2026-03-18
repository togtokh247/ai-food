"use client";

import Image from "next/image";
import React from "react";

export const ImagePreview = ({ previewUrl }: { previewUrl: string }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="mb-3 text-sm font-medium text-gray-700">Preview</p>
      <Image
        src={previewUrl}
        alt="preview"
        unoptimized
        width={640}
        height={400}
        className="max-h-72 w-auto rounded-md border border-gray-200 bg-white"
      />
    </div>
  );
};
