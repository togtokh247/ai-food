"use client";

import React from "react";

type Props = {
  ingredients: string[];
};

export function IdentifiedIngredients({ ingredients }: Props) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-gray-900">
          Identified Ingredients
        </span>
      </div>

      {ingredients.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">
          First, enter your text to recognize an ingredients.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {ingredients.map((item, idx) => (
            <span
              key={idx}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
