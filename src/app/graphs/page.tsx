"use client";

import PathfinderVisualizer from "./components/SearchVisualizer";
import { PathfinderVisualizerProvider } from "./context/graphContext";

export default function GraphsPage() {
  return (
    <PathfinderVisualizerProvider>
      <div className="w-full flex justify-center">
        <PathfinderVisualizer />
      </div>
    </PathfinderVisualizerProvider>
  );
}
