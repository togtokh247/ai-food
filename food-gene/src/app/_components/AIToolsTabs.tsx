"use client";

import React from "react";

export type TabKey = "analysis" | "ingredients" | "creator";

export function AIToolsTabs({
  tab,
  onChange,
}: {
  tab: TabKey;
  onChange: (t: TabKey) => void;
}) {
  return (
    <div className="mb-8 flex w-fit gap-2 rounded-full bg-gray-100 p-1">
      <TabButton
        active={tab === "analysis"}
        onClick={() => onChange("analysis")}
      >
        Image analysis
      </TabButton>
      <TabButton
        active={tab === "ingredients"}
        onClick={() => onChange("ingredients")}
      >
        Ingredient recognition
      </TabButton>
      <TabButton active={tab === "creator"} onClick={() => onChange("creator")}>
        Image creator
      </TabButton>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={[
        "rounded-full px-4 py-2 text-sm font-medium transition",
        active
          ? "bg-white text-gray-900 shadow"
          : "text-gray-500 hover:text-gray-800",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
