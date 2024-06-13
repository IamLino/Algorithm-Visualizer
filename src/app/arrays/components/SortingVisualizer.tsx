"use client";
// <----------- Imports ----------->
// Context
import {
  SortingVisualizerProvider,
  useSortingVisualizerContext,
} from "@/app/arrays/context/arrayContext";
// ---> General
// Components
import SpeedSlider from "@/app/components/input/SpeedSlider";
import AlgorithmSelector from "@/app/components/input/AlgorithmSelector";
// Array utils
import {
  sortingAlgorithmsData,
  sortingAlgorithmSelectorOptions,
  generateSortingAnimationArray,
} from "@/app/arrays/lib/arrayUtils";
// Array types
import { SortingAlgorithmType } from "@/app/arrays/lib/arrayTypes";
import AlgorithmInformation from "@/app/components/ui/AlgorithmInformation";
import FlowControls from "@/app/components/ui/FlowControls";
// <-----------/Imports ----------->

export default function SortingVisualizer() {
  // Use the SortingVisualizerContext
  const {
    // Variables
    arrayToSort,
    animationSpeed,
    isAnimationRunning,
    requiresReset,
    sortingAlgorithmSelected,
    // States
    setAnimationSpeed,
    setSortingAlgorithmSelected,
    // Functions
    resetArrayAndAnimation,
    runSortingAnimation,
  } = useSortingVisualizerContext();

  // -----> Handle functions <-----
  const handleAlgorithmSelectorChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSortingAlgorithmSelected(e.target.value as SortingAlgorithmType);
    resetArrayAndAnimation();
  };
  const handleSorting = () => {
    if (requiresReset) {
      resetArrayAndAnimation();
      return;
    }

    generateSortingAnimationArray(
      sortingAlgorithmSelected,
      isAnimationRunning,
      arrayToSort,
      runSortingAnimation
    );
  };
  // ----->/Handle functions <-----

  return (
    <main className="w-full flex justify-center">
      <div
        id="content-container"
        className="flex max-w-[1020px] w-full flex-col lg:px-0 px-4"
      >
        {/* Header, Controls & Algorithm Information */}
        <div className="h-[66px] relative flex items-center justify-between w-full">
          <h1 className="text-gray-300 text-2xl font-light hidden md:flex">
            Sorting Algorithm Visualizer by Lino
          </h1>
          <div className="flex items-center justify-center gap-4">
            <SpeedSlider
              value={animationSpeed}
              isDisable={isAnimationRunning}
              handleChange={(e) => setAnimationSpeed(Number(e.target.value))}
            />
            <AlgorithmSelector
              options={sortingAlgorithmSelectorOptions}
              defaultAlgorithm={sortingAlgorithmSelected}
              isDisable={isAnimationRunning}
              onChange={handleAlgorithmSelectorChange}
            />
            <FlowControls
              requiresReset={requiresReset}
              isAnimationRunning={isAnimationRunning}
              handleSorting={handleSorting}
            />
          </div>

          <div className="hidden sm:flex absolute top-[120%] left-0 w-full">
            <AlgorithmInformation
              algorithmData={sortingAlgorithmsData[sortingAlgorithmSelected]}
            />
          </div>
        </div>

        {/* Visualizer */}
        <div className="relative h-[calc(100vh-66px)] w-full">
          <div className="absolute bottom-[32px] w-full mx-auto left-0 right-0 flex justify-center items-end">
            {arrayToSort.map((value, index) => (
              <div
                className="array-line relative w-1 mx-0.5 shadow-lg opacity-70 rounded-lg default-line-color"
                key={index}
                style={{
                  height: `${value}px`,
                  transition: `transform 0.${
                    (1 / animationSpeed) * 200
                  }s ease, height 0.${(1 / animationSpeed) * 200}s ease`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
