"use client";

import React, { useState } from "react";
import { IngredientInput } from "./IngredientInput";
import { IdentifiedIngredients } from "./IdentifiedIngredients";

type Props = {
  endpoint?: string;
};

export function IngredientRecognition({
  endpoint = "/api/ai/ingredient-recognition",
}: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);

  const onGenerate = async () => {
    if (!text) return;

    setLoading(true);
    setIngredients([]);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setIngredients(data.ingredients ?? []);
    } catch {
      setIngredients(["Error detecting ingredients"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-black">
          Ingredient recognition
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Describe the food, and AI will detect the ingredients.
        </p>
      </div>

      <IngredientInput
        value={text}
        loading={loading}
        onChange={setText}
        onGenerate={onGenerate}
      />

      <IdentifiedIngredients ingredients={ingredients} />
    </div>
  );
}
