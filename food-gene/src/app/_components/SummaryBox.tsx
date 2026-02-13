"use client";

import React from "react";

export const SummaryBox = ({ summary }: { summary: string }) =>{
  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-gray-900">
          Here is the summary
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        {summary || "First, enter your image to recognize an ingredients."}
      </p>

      {/* <p className="mt-2 text-sm text-gray-500">
        {summary
          ? summary
          : "First, enter your image to recognize ingredients."}
      </p> */}
    </div>
  );
}
