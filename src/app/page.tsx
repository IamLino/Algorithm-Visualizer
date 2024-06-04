"use client"; // Because we use states
import { useAlgorithmVisualizerContext } from "./context/Visualizer";
import { SpeedSlider } from "@/components/Input/SpeedSlider";
import { AlgorithmSelector } from "@/components/Input/AlgorithmSelector";
import { algorithmsData, algorithmSelectorOptions, generateAnimationArray } from "@/lib/utils";
import { AlgorithmType } from "@/lib/types";
import { RxReset } from "react-icons/rx";
import { FaPlayCircle, FaStop } from "react-icons/fa";

export default function Home() {

  // Get the VisualizerContext
  const {
    // Variables
    arrayToSort, 
    animationSpeed,
    isAnimationRunning,
    requiresReset, 
    algorithmSelected, 
    // States
    setAnimationSpeed,
    setAlgorithmSelected,
    // Functions
    resetArrayAndAnimation,
    runAnimation
  } = useAlgorithmVisualizerContext();

  // ---> Handle functions
  const handleAlgorithmSelectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgorithmSelected(e.target.value as AlgorithmType);
    resetArrayAndAnimation();
  };
  const handleSorting = () => {
    if(requiresReset){
      resetArrayAndAnimation();
      return;
    }

    generateAnimationArray(
      algorithmSelected,
      isAnimationRunning,
      arrayToSort,
      runAnimation
    );
  };

  return (
    <main className="absolute top-0 h-screen w-screen z-[-2] bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#150229_1px)] bg-[size:40px_40px]">
      <div className="flex h-full justify-center">
        <div id="content-container" className="flex max-w-[1020px] w-full flex-col lg:px-0 px-4">

          {/* First Row (Header & Controls) */}
          <div className="h-[66px] relative flex items-center justify-between w-full">
            <h1 className="text-gray-300 text-2xl font-light hidden md:flex">
              Sorting Algorithm Visualizer
            </h1>
            <div className="flex items-center justify-center gap-4">
              <SpeedSlider
                value={animationSpeed}
                isDisable={isAnimationRunning}
                handleChange={(e) => setAnimationSpeed(Number(e.target.value))}
              />
              <AlgorithmSelector
                options={algorithmSelectorOptions}
                defaultAlgorithm={algorithmSelected}
                isDisable={isAnimationRunning}
                onChange={handleAlgorithmSelectorChange}
              />
              <button className="flex items-center justify-center" 
              onClick={handleSorting} > 
                {requiresReset ? (
                  isAnimationRunning ?
                  <FaStop className="text-gray-400 h-6 w-8"/> :
                  <RxReset className="text-gray-400 h-8 w-8"/>
                ):
                (
                  <FaPlayCircle className="text-system-green60 h-8 w-8"/>
                )}
              </button>
            </div>

            <div className="hidden sm:flex absolute top-[120%] left-0 w-full">
                <div className="flex w-full text-gray-400 p-4 rounded border border-system-purple20 bg-system-purple80 bg-opacity-10 gap-6">
                  <div className="flex flex-col items-start justify-start w-3/4 ">
                    <h3 className="text-lg">
                      {algorithmsData[algorithmSelected].title}
                    </h3>
                    <p className="text-sm text-gray-500 pt-2">
                      {algorithmsData[algorithmSelected].description}
                    </p>
                  </div>
                  <div className="flex flex-col items-start justify-start w-1/4 gap-2">
                    <h3 className="text-lg">
                      Time Complexity
                    </h3>
                    <div className="flex flex-col gap-2">
                      <p className="flex w-full text-sm text-grey-500">
                        <span className="w-28 ">Worst Case</span>
                        <span>
                        {algorithmsData[algorithmSelected].worstCase}
                        </span>
                      </p>
                      <p className="flex w-full text-sm text-grey-500">
                        <span className="w-28 ">Average Case</span>
                        <span>
                        {algorithmsData[algorithmSelected].averageCase}
                        </span>
                      </p>
                      <p className="flex w-full text-sm text-grey-500">
                        <span className="w-28 ">Best Case</span>
                        <span>
                        {algorithmsData[algorithmSelected].bestCase}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Second Row (Algorithm Select and Info) */}


          {/* Third Row (Visualizer) */}
          <div className="relative h-[calc(100vh-66px)] w-full">
            <div className="absolute bottom-[32px] w-full mx-auto left-0 right-0 flex justify-center items-end">
              {arrayToSort.map((value, index) => (
                <div className="array-line relative w-1 mx-0.5 shadow-lg opacity-70 rounded-lg default-line-color" 
                key={index}
                style={{
                  height: `${value}px`,
                  transition: `height 0.${(1/animationSpeed) * 200}s ease`
                }}>
                  
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
