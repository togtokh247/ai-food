"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type TabKey = "analysis" | "ingredients" | "creator";

export function AIToolsTabs({
  tab,
  onChange,
}: {
  tab: TabKey;
  onChange: (t: TabKey) => void;
}) {
  return (
    <Tabs
      value={tab}
      onValueChange={(v) => onChange(v as TabKey)}
      className="mb-6"
    >
      <TabsList className="grid w-fit grid-cols-3 rounded-full bg-muted p-1">
        <TabsTrigger
          value="analysis"
          className="rounded-full px-4 data-[state=active]:shadow-sm"
        >
          Image analysis
        </TabsTrigger>

        <TabsTrigger
          value="ingredients"
          className="rounded-full px-4 data-[state=active]:shadow-sm"
        >
          Ingredient recognition
        </TabsTrigger>

        <TabsTrigger
          value="creator"
          className="rounded-full px-4 data-[state=active]:shadow-sm"
        >
          Image creator
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
