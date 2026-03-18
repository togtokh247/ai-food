"use client";

import Image from "next/image";

type Props = {
  imageUrl: string | null;
  isFallback?: boolean;
};

export const ImageCreatorResult = ({ imageUrl, isFallback = false }: Props) => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-gray-900">Result</span>
        {isFallback && (
          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
            Demo preview
          </span>
        )}
      </div>

      {!imageUrl ? (
        <p className="mt-2 text-sm text-gray-500">
          First, enter your text to generate an image.
        </p>
      ) : (
        <Image
          src={imageUrl}
          alt="generated food"
          unoptimized
          width={1024}
          height={768}
          className="mt-4 max-h-80 rounded-lg border"
        />
      )}
    </div>
  );
};
