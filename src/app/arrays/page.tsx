"use client";

import { SortingVisualizerProvider } from "@/app/arrays/context/arrayContext";
import ArraysVisualizer from "@/app/arrays/components/SortingVisualizer";

export default function ArraysPage() {
  return (
    <SortingVisualizerProvider>
      <div className="w-full flex justify-center">
        <ArraysVisualizer />
      </div>
    </SortingVisualizerProvider>
  );
}
