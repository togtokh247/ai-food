"use client";

import React from "react";

type Props = {
  value: string;
  loading: boolean;
  onChange: (v: string) => void;
  onGenerate: () => void;
};

export const IngredientInput = ({
  value,
  loading,
  onChange,
  onGenerate,
}: Props) => {
  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Food description"
        className="w-full min-h-[120px] resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none text-black"
      />

      <div className="flex justify-end">
        <button
          onClick={onGenerate}
          disabled={!value || loading}
          className="rounded-lg bg-gray-700 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          type="button"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
};
