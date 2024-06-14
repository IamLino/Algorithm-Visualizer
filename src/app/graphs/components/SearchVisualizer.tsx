"use client";

// <----------- Imports ----------->
// Context
import { usePathfinderVisualizerContext } from "../context/graphContext";
// General
import { AiOutlineClear } from "react-icons/ai";
import FlowControls from "@/app/components/ui/FlowControls";
import SpeedSlider from "@/app/components/input/SpeedSlider";
import AlgorithmSelector from "@/app/components/input/AlgorithmSelector";
import AlgorithmInformation from "@/app/components/ui/AlgorithmInformation";
// Grid
import GridComponent from "./grid/Grid";
// Graph
import {
  generateSearchAnimation,
  searchAlgorithmsData,
  searchAlgorithmSelectorOptions,
} from "../lib/graphUtils";
// Animation
import { SearchAlgorithmType } from "../lib/animations/animationTypes";
import { updateSearchPath } from "../animations/grid/gridAnimations";
// <-----------/Imports ----------->

export default function PathfinderVisualizer() {
  // Use the PathfinderVisualizerContext
  const {
    // Variables
    grid,
    animationSpeed,
    isAnimationRunning,
    isAnimationCompleted,
    isWeightValueShown,
    requiresReset,
    searchAlgorithmSelected,
    // States
    setGrid,
    setAnimationSpeed,
    setIsWeightValueShown,
    setSearchAlgorithmSelected,
    setIsAnimationCompleted,
    // Functions
    // Grid
    resetGridAndAnimation,
    clearWallsAndGrid,
    clearSearchPath,
    // Animation
    runSearchAnimation,
    stopAnimation
  } = usePathfinderVisualizerContext();

  // -----> Handle functions <-----
  const handleAlgorithmSelectorChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSearchAlgorithmSelected(e.target.value as SearchAlgorithmType);
    clearSearchPath();
    setIsAnimationCompleted(false);
  };

  const handleSearch = () => {
    if(isAnimationRunning){
      // Stop animation
      stopAnimation();
      return;
    }
    // If the animation is completed clear the path
    if (isAnimationCompleted) {
      clearSearchPath();
      setIsAnimationCompleted(false);
      return;
    }

    // Else generate the animation
    generateSearchAnimation(
      searchAlgorithmSelected,
      isAnimationRunning,
      grid,
      runSearchAnimation
    );
  };

  const handleShowWeightValue = () => {
    setIsWeightValueShown(!isWeightValueShown);
  };

  // Clear all the grid walls
  const handleClearGrid = () => {
    clearWallsAndGrid();
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
            Pathfinder Visualizer by Lino
          </h1>
          <div className="flex items-center justify-center gap-4">
            <button
              className="flex items-center justify-center"
              onClick={handleClearGrid}
              disabled={isAnimationRunning}
            >
              <AiOutlineClear className="text-gray-400 h-6 w-8" />
            </button>
            <input
              type="checkbox"
              checked={isWeightValueShown}
              onChange={handleShowWeightValue}
            />
            <SpeedSlider
              value={animationSpeed}
              isDisable={isAnimationRunning}
              handleChange={(e) => setAnimationSpeed(Number(e.target.value))}
            />
            <AlgorithmSelector
              options={searchAlgorithmSelectorOptions}
              defaultAlgorithm={searchAlgorithmSelected}
              isDisable={isAnimationRunning}
              onChange={handleAlgorithmSelectorChange}
            />
            <FlowControls
              requiresReset={requiresReset}
              isAnimationRunning={isAnimationRunning}
              handleSorting={handleSearch}
            />
          </div>

          <div className="hidden sm:flex absolute top-[120%] left-0 w-full">
            <AlgorithmInformation
              algorithmData={searchAlgorithmsData[searchAlgorithmSelected]}
            />
          </div>
        </div>

        {/* Visualizer */}
        <div className="relative h-[calc(100vh-66px)] w-full">
          <div className="absolute bottom-[32px] w-full mx-auto left-0 right-0 flex flex-col justify-center items-center">
            <GridComponent />
          </div>
        </div>
      </div>
    </main>
  );
}
