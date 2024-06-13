"use client";

// <----------- Imports ----------->
// General
import { createContext, useContext, useEffect, useState } from "react";
import { generateRandomNumberFromInterval, MAX_ANIMATION_SPEED, MIN_ANIMATION_SPEED } from "@/app/lib/utils";
// Array types
import { SortingAlgorithmType, AnimationArrayType } from "@/app/arrays/lib/arrayTypes";
// <-----------/Imports ----------->

interface SortingVisualizerContextType {
   // States
   arrayToSort: number[];
   setArrayToSort: (array: number[]) => void;
   sortingAlgorithmSelected: SortingAlgorithmType;
   setSortingAlgorithmSelected: (sortingAlgorithm: SortingAlgorithmType) => void;
   animationSpeed: number;
   setAnimationSpeed: (speed: number) => void;
   isAnimationRunning: boolean;
   setIsAnimationRunning: (isRunning: boolean) => void;
   isAnimationCompleted: boolean;
   setIsAnimationCompleted: (isCompleted: boolean) => void;
   requiresReset: boolean;
   // Functions
   resetArrayAndAnimation: () => void;
   runSortingAnimation: (animations: AnimationArrayType) => void;
}

const SortingVisualizerContext = createContext<SortingVisualizerContextType | undefined>(undefined);

// Provider
export const SortingVisualizerProvider = ({children} : {children: React.ReactNode}) => {
    // <---------- States ---------->
    // Array of numbers
    const [arrayToSort, setArrayToSort] = useState<number []>([]);
    // Array of ALgorithm Types
    const [sortingAlgorithmSelected, setSortingAlgorithmSelected] = useState<SortingAlgorithmType>("bubble");
    // Animation speed
    const [animationSpeed, setAnimationSpeed] = useState<number>(MIN_ANIMATION_SPEED);
    // Animation is running
    const [isAnimationRunning, setIsAnimationRunning] = useState<boolean>(false);
    // Animations is completed
    const [isAnimationCompleted, setIsAnimationCompleted] = useState<boolean>(false);
    // <----------/States ---------->

    // Flag that determines whether 
    const requiresReset = isAnimationRunning || isAnimationCompleted;

    // Call the 'resetArrayAndAnimation' func whenever the component first render or the window resizes
    useEffect(() => {
        resetArrayAndAnimation();

        // Whenever the windows resizes we call the resetArrayAndAnimation so that the lines keeps it's proportion
        window.addEventListener("resize", resetArrayAndAnimation);
        return () => {
            window.removeEventListener("resize", resetArrayAndAnimation);
        };
    }, []);

    // <--------- Functions -------->
    const resetArrayAndAnimation = () => {
        // Retrieve the container
        const contentContainer = document.getElementById("content-container");
        if (!contentContainer) return;

        // Variables
        const containerWidth = contentContainer.clientWidth;
        const containerHeight = window.innerHeight;
        const numLines = containerWidth / 8;
        const maxLineHeight = Math.max(containerHeight - 420, 100);
        const tempArray: number[] = []; // Contains our array's to sort
        
        // Generate Temp Array to sort
        for (let i = 0; i < numLines; i++) {
            tempArray.push(generateRandomNumberFromInterval(35, maxLineHeight));
        }

        setArrayToSort(tempArray);
        setIsAnimationCompleted(false);
        setIsAnimationRunning(false);

        // ---> Reset lines height and clearing timeout so the animation stops
        const highestId = window.setTimeout(() => {
            for (let i = highestId; i >= 0; i--){
                window.clearTimeout(i);
            };
        }, 0);

        setTimeout(() => {
            const arrayLines = document.getElementsByClassName("array-line") as HTMLCollectionOf<HTMLElement>;
            for(let i = 0; i < arrayLines.length; i++){
                arrayLines[i].classList.remove("pulse-animation", "changed-line-color");
                arrayLines[i].classList.add("default-line-color");
            }
        }, 0);
    };

    const runSortingAnimation = (animations: AnimationArrayType) => {
        // ---> States
        setIsAnimationRunning(true);
        
        // ---> Variables
        // Because if the speed increases we need to go slower
        const inverseSpeed = (1/animationSpeed) * 200;
        const arrayLines = document.getElementsByClassName("array-line") as HTMLCollectionOf<HTMLElement>;

        // ---> Utility functions
        // Change the color
        const updateClassList = (indexes: number[], addClassName: string, removeClassName: string) => {
            indexes.forEach((index) => {
                arrayLines[index].classList.add(addClassName);
                arrayLines[index].classList.remove(removeClassName);
            });
        };
        // Change the height
        const updateHeightValue = (lineIndex: number, newHeight: number | undefined) => {
            if (newHeight === undefined) return;
            arrayLines[lineIndex].style.height = `${newHeight}px`;
        };

        // ---> Animate
        animations.forEach((animation, index) => {
            setTimeout(() => {
                const [values, isSwapping] = animation;

                if(!isSwapping){ // Change the color
                    updateClassList(values, "changed-line-color", "default-line-color");
                    setTimeout(() => {
                        updateClassList(values, "default-line-color", "changed-line-color");
                    }, inverseSpeed);
                }else{ // Change the height
                    const [lineIndex, newHeight] = values;
                    updateHeightValue(lineIndex, newHeight);
                }

            }, index * inverseSpeed);
        });

        // Final 'pulse' animation
        const finalTimeout = animations.length * inverseSpeed + 50; // animation is over
        
        setTimeout(() => {
            Array.from(arrayLines).forEach((line) => {
                line.classList.add("pulse-animation", "changed-line-color");
                line.classList.remove("default-line-color");
            });
            setIsAnimationRunning(false);
            setIsAnimationCompleted(true);
            setTimeout(() => {
                Array.from(arrayLines).forEach((line) => {
                    line.classList.remove("pulse-animation", "changed-line-color");
                    line.classList.add("default-line-color");
                });
            }, 1000);
        }, finalTimeout);
    };
    // <---------/Functions -------->

    const value = {
        // States
        arrayToSort,
        setArrayToSort,
        sortingAlgorithmSelected,
        setSortingAlgorithmSelected,
        animationSpeed,
        setAnimationSpeed,
        isAnimationRunning,
        setIsAnimationRunning,
        isAnimationCompleted,
        setIsAnimationCompleted,
        // Variables
        requiresReset,
        // Functions
        resetArrayAndAnimation,
        runSortingAnimation
    }

    // Return the Provider on our context
    return <SortingVisualizerContext.Provider value={value}>{children}</SortingVisualizerContext.Provider>;
}

// Create Context
export const useSortingVisualizerContext = () => {
    const context = useContext(SortingVisualizerContext);
    
    if(!context){
        throw new Error("useSortingVisualizerContext must be within a SortingVisualizerProvider");
    }

    return context;
}