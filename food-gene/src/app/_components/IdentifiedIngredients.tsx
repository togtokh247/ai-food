"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Props = {
  ingredients: string[];
};

export function IdentifiedIngredients({ ingredients }: Props) {
  return (
    <div className="pt-6">
      <Separator className="mb-4" />

      <div className="flex items-center gap-2">
        <span className="text-base font-semibold">
          Identified Ingredients
        </span>
      </div>

      {ingredients.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          First, enter your text to recognize ingredients.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {ingredients.map((item, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="rounded-full px-3 py-1 text-sm"
            >
              {item}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
