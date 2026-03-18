"use client";

import React, { useMemo, useState } from "react";
import { RotateCw } from "lucide-react";

import { IngredientInput } from "./IngredientInput";
import { IdentifiedIngredients } from "./IdentifiedIngredients";
import { Button } from "@/components/ui/button";

type IngredientsResponse = {
  ingredients?: string[];
  raw?: string;
  error?: string;
};

export function IngredientRecognition() {
  const [text, setText] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [raw, setRaw] = useState("");

  const canGenerate = useMemo(
    () => !!text.trim() && !loading,
    [text, loading],
  );

  const onReset = () => {
    setText("");
    setIngredients([]);
    setRaw("");
  };

  const parseIngredients = (s: string) => {
    return s
      .replace(/\n/g, " ")
      .replace(/^ingredients\s*:\s*/i, "")
      .trim()
      .split(",")
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 30);
  };

  const onGenerate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setIngredients([]);
    setRaw("");

    try {
      const response = await fetch("/api/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      });

      const data = (await response.json()) as IngredientsResponse;

      if (!response.ok) {
        throw new Error(
          data.error || "Ingredient extraction request failed.",
        );
      }

      setRaw(data.raw ?? "");

      const items = parseIngredients((data.ingredients ?? []).join(", "));
      setIngredients(items.length ? items : ["(No ingredients found)"]);
    } catch (err) {
      setIngredients([
        err instanceof Error ? `Error: ${err.message}` : "Error: Something went wrong.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Paste a food description, then Gemini will extract the ingredients.
        </div>

        <Button variant="outline" size="icon" onClick={onReset} type="button">
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <IngredientInput
        value={text}
        loading={loading}
        onChange={setText}
        onGenerate={onGenerate}
      />

      {raw && (
        <p className="text-xs text-muted-foreground">
          AI output: {raw}
        </p>
      )}

      <IdentifiedIngredients ingredients={ingredients} />

      {!canGenerate && text.trim() && !loading && (
        <p className="text-xs text-muted-foreground">(Ready)</p>
      )}
    </div>
  );
}
