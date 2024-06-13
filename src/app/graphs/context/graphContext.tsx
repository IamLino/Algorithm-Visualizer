"use client";

// <----------- Imports ----------->
// General
import { createContext, useContext, useEffect, useState } from "react";
import { MIN_ANIMATION_SPEED } from "@/app/lib/utils";
// Graph
import { Grid, Node } from "../lib/graphTypes";
import { generateSearchAnimation } from "../lib/graphUtils";
// Animation
import {
  SearchAlgorithmType,
  AnimationSearchType,
} from "../lib/animations/animationTypes";
import { buildGrid, updateSearchPath } from "../animations/grid/gridAnimations";
// <-----------/Imports ----------->

interface PathfinderVisualizerContextType {
  // ---> States
  // Grid
  grid: Grid;
  setGrid: (grid: Grid) => void;
  // General
  searchAlgorithmSelected: SearchAlgorithmType;
  setSearchAlgorithmSelected: (searchAlgorithm: SearchAlgorithmType) => void;
  // Node
  isWeightValueShown: boolean;
  setIsWeightValueShown: (showWeight: boolean) => void;
  isMousePressed: boolean;
  setIsMousePressed: (mousePressed: boolean) => void;
  lastMousePressedPosition: [number, number];
  setLastMousePressedPosition: (mousePosition: [number, number]) => void;
  // Animation
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  isAnimationRunning: boolean;
  setIsAnimationRunning: (isRunning: boolean) => void;
  isAnimationCompleted: boolean;
  setIsAnimationCompleted: (isCompleted: boolean) => void;
  requiresReset: boolean;
  // ---> Functions
  // Grid
  resetGridAndAnimation: () => void;
  clearWallsAndGrid: () => void;
  clearSearchPath: () => void;
  // Animation
  runSearchAnimation: (animations: AnimationSearchType) => void;
  updateSearchAnimation: (animations: AnimationSearchType) => void;
  // Node
  updateNode: (rowIndex: number, columnIndex: number) => void;
}

const PathfinderVisualizerContext = createContext<
  PathfinderVisualizerContextType | undefined
>(undefined);

// Provider
export const PathfinderVisualizerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // <---------- States ---------->
  // Grid
  const [grid, setGrid] = useState<Grid>(new Grid(0, 0));
  // Algorithm selected
  const [searchAlgorithmSelected, setSearchAlgorithmSelected] =
    useState<SearchAlgorithmType>("dijkstras");
  // Animation speed
  const [animationSpeed, setAnimationSpeed] =
    useState<number>(MIN_ANIMATION_SPEED);
  // Animation is running
  const [isAnimationRunning, setIsAnimationRunning] = useState<boolean>(false);
  // Animations is completed
  const [isAnimationCompleted, setIsAnimationCompleted] =
    useState<boolean>(false);
  // Show weight value
  const [isWeightValueShown, setIsWeightValueShown] = useState<boolean>(false);
  // Is mouse pressed
  const [isMousePressed, setIsMousePressed] = useState<boolean>(false);
  // Last pressed mouse position
  const [lastMousePressedPosition, setLastMousePressedPosition] = useState<
    [number, number]
  >([Infinity, Infinity]);
  // <----------/States ---------->

  // Flag that determines whether
  const requiresReset = isAnimationRunning || isAnimationCompleted;

  // Call the 'resetGridAndAnimation' func whenever the component first render or the window resizes
  useEffect(() => {
    resetGridAndAnimation();

    // Whenever the windows resizes we call the resetArrayAndAnimation so that the lines keeps it's proportion
    window.addEventListener("resize", resetGridAndAnimation);
    return () => {
      window.removeEventListener("resize", resetGridAndAnimation);
    };
  }, []);

  // <--------- Functions -------->
  // ---> Grid
  const resetGridAndAnimation = () => {
    // Retrieve the container
    const contentContainer = document.getElementById("content-container");
    if (!contentContainer) return;

    // Variables
    const containerWidth = contentContainer.clientWidth;
    const containerHeight = window.innerHeight;
    const numColumns = Math.floor(containerWidth / 30);
    const numRows = Math.floor((containerHeight - 300) / 30);

    // If the number of rows and columns has change from the previous grid then create a new one
    // if(grid.numRows !== numRows || grid.numColumns !== numColumns) {
    //   setGrid(new Grid(numRows, numColumns));
    // }
    setGrid(new Grid(numRows, numColumns));

    // Clear any search path
    // clearSearchPath();

    // Set animation states
    setIsAnimationCompleted(false);
    setIsAnimationRunning(false);

    // ---> Reset clearing timeout so the animation stops
    const highestId = window.setTimeout(() => {
      for (let i = highestId; i >= 0; i--) {
        window.clearTimeout(i);
      }
    }, 0);
  };

  const clearWallsAndGrid = () => {
    // States
    setIsAnimationCompleted(false);
    setIsAnimationRunning(false);
    
    // Remove the walls from the grid
    grid.clearGrid();
    // Rebuild the grid
    buildGrid(grid);
  };

  const clearSearchPath = () => {
    // Set animation states
    // setIsAnimationCompleted(false);
    setIsAnimationRunning(false);
    // Just build the grid without the animations
    buildGrid(grid);
  };

  // ---> Animation
  const runSearchAnimation = (animations: AnimationSearchType) => {
    // If animation is completed just update the nodes
    if (isAnimationCompleted) {
      return;
    }
    // Clean the grid
    clearSearchPath();
    // ---> States
    setIsAnimationRunning(true);

    // ---> Variables
    // Because if the speed increases we need to go slower (wait less)
    const inverseSpeed = (1 / animationSpeed) * 200;

    // ---> Utility functions
    const updateNodeClass = (node: Node, isVisited: boolean) => {
      const nodeId = `node-${node.rowIndex}-${node.columnIndex}`;
      const nodeElement = document.getElementById(nodeId) as HTMLElement;
      if (nodeElement) {
        if (isVisited) {
          nodeElement.className = "node node-visited";
        } else {
          nodeElement.className = "node node-shortest-path";
        }
      }
    };

    // ---> Animate
    // Animate the visited nodes first
    const visitedNodesTimeout = animations.visitedNodes.length * inverseSpeed; // animation is over
    animations.visitedNodes.forEach((node, index) => {
      setTimeout(() => {
        updateNodeClass(node, true);
      }, index * inverseSpeed);
    });
    // Animate the shortest path
    setTimeout(() => {  
      animations.shortestPath.forEach((node, index) => {
        setTimeout(() => {
          updateNodeClass(node, false);
        }, index * inverseSpeed);
      });
      setIsAnimationRunning(false);
      setIsAnimationCompleted(true);
    }, visitedNodesTimeout);
  };

  const updateSearchAnimation = (animations: AnimationSearchType) => {
    // Clear the previous search path
    buildGrid(grid);

    // Change the nodes in the animations arrays (visitedNodes & shortestPath)
    updateSearchPath(animations);
  };

  // ---> Node
  const updateNode = (rowIndex: number, columnIndex: number) => {
    // Just update the node when the animation is not running
    if(isAnimationRunning && !isAnimationCompleted) return;

    // If the current node is a wall remove it, if its not then add it
    const existingWall = grid.walls.find(
      (wall) => wall.rowIndex === rowIndex && wall.columnIndex === columnIndex
    );
    if (existingWall) {
      grid.removeWall(rowIndex, columnIndex);
    } else {
      grid.addWall(rowIndex, columnIndex);
    }

    // If the animation is completed just update the path
    clearSearchPath();
    if(isAnimationCompleted && !isAnimationRunning){
      generateSearchAnimation(
        searchAlgorithmSelected,
        isAnimationRunning,
        grid,
        updateSearchAnimation
      );
    }
  };
  // <---------/Functions -------->

  const value = {
    // States
    grid,
    setGrid,
    searchAlgorithmSelected,
    setSearchAlgorithmSelected,
    animationSpeed,
    setAnimationSpeed,
    isAnimationRunning,
    setIsAnimationRunning,
    isAnimationCompleted,
    setIsAnimationCompleted,
    isWeightValueShown,
    setIsWeightValueShown,
    isMousePressed,
    setIsMousePressed,
    lastMousePressedPosition,
    setLastMousePressedPosition,
    // Variables
    requiresReset,
    // ---> Functions
    // Grid
    resetGridAndAnimation,
    clearWallsAndGrid,
    clearSearchPath,
    // Animation
    runSearchAnimation,
    updateSearchAnimation,
    // Node
    updateNode,
  };

  // Return the Provider on our context
  return (
    <PathfinderVisualizerContext.Provider value={value}>
      {children}
    </PathfinderVisualizerContext.Provider>
  );
};

// Create Context
export const usePathfinderVisualizerContext = () => {
  const context = useContext(PathfinderVisualizerContext);

  if (!context) {
    throw new Error(
      "usePathfinderVisualizerContext must be within a PathfinderVisualizerProvider"
    );
  }

  return context;
};