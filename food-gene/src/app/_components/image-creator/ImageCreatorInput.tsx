"use client";

import { Button } from "@/components/ui/button";

type Props = {
  prompt: string;
  loading: boolean;
  onChange: (v: string) => void;
  onGenerate: () => void;
};

export function ImageCreatorInput({
  prompt,
  loading,
  onChange,
  onGenerate,
}: Props) {
  return (
    <div className="space-y-3">
      <textarea
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Хоолны тайлбар"
        className="w-full min-h-[120px] resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
      />

      <div className="flex justify-end">
        <Button
          onClick={onGenerate}
          disabled={!prompt || loading}
          className="
            rounded-lg px-5 py-2 text-sm font-semibold text-white
            bg-gray-300
            enabled:bg-gray-700 enabled:hover:bg-gray-800
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>
    </div>
  );
}
