"use client";

// <----------- Imports ----------->
// General
import { createContext, useContext, useEffect, useState } from "react";
import { MAX_ANIMATION_SPEED, MIN_ANIMATION_SPEED } from "@/app/lib/utils";
// Graph
import { Grid, Node, NodeType, NodeWeightValue } from "../lib/graphTypes";
import { generateSearchAnimation } from "../lib/graphUtils";
// Animation
import {
  SearchAlgorithmType,
  AnimationSearchType,
} from "../lib/animations/animationTypes";
import {
  buildGrid,
  clearGrid,
  updateSearchPath,
} from "../animations/grid/gridAnimations";
import {
  removeBackgroundImg,
  updateStartNodeImgDirection,
} from "../animations/node/nodeAnimations";
import { getNodeDirection } from "../lib/animations/animationUtils";
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
  isWeightKeyPressed: boolean;
  setIsWeightKeyPressed: (isPressed: boolean) => void;
  lastMousePressedPosition: [number, number];
  setLastMousePressedPosition: (mousePosition: [number, number]) => void;
  isStartNodeDragged: boolean;
  setIsStartNodeDragged: (isDragged: boolean) => void;
  isUpdateNode: boolean;
  setIsUpdateNode: (update: boolean) => void;
  previousNode: Node | null;
  setPreviousNode: (node: Node | null) => void;
  // Animation
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  isAnimationRunning: boolean;
  setIsAnimationRunning: (isRunning: boolean) => void;
  isAnimationCompleted: boolean;
  setIsAnimationCompleted: (isCompleted: boolean) => void;
  requiresReset: boolean;
  // Path
  visitedNodesCount: number;
  setVisitedNodesCount: (count: number) => void;
  shortestPathWeightCost: number;
  setShortestPathWeightCost: (totalCost: number) => void;
  // Variable
  hasExecuted: boolean;
  setHasExecuted: (hasExecuted: boolean) => void;
  // ---> Functions
  // Grid
  resetGridAndAnimation: () => void;
  clearWallsAndGrid: () => void;
  clearSearchPath: () => void;
  // Animation
  runSearchAnimation: (animations: AnimationSearchType) => void;
  updateSearchAnimation: (animations: AnimationSearchType) => void;
  stopAnimation: () => void;
  // Node
  updateNode: (rowIndex: number, columnIndex: number) => void;
  updateStartOrTargetNode: (rowIndex: number, columnIndex: number) => void;
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
    useState<number>(MAX_ANIMATION_SPEED);
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
  // Add weight key
  const [isWeightKeyPressed, setIsWeightKeyPressed] = useState<boolean>(false);
  // Start & Target Dragged
  const [isStartNodeDragged, setIsStartNodeDragged] = useState<boolean>(false);
  const [isUpdateNode, setIsUpdateNode] = useState<boolean>(false);
  // Previous Node
  const [previousNode, setPreviousNode] = useState<Node | null>(null);
  // Path
  const [visitedNodesCount, setVisitedNodesCount] = useState<number>(0);
  const [shortestPathWeightCost, setShortestPathWeightCost] =
    useState<number>(0);
  // Variables
  const [hasExecuted, setHasExecuted] = useState<boolean>(false);
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
    const numColumns = Math.floor(containerWidth / 20);
    const numRows = Math.floor((containerHeight - 300) / 20);

    // ---> Reset clearing timeout so the animation stops
    const highestId = window.setTimeout(() => {
      for (let i = highestId; i >= 0; i--) {
        window.clearTimeout(i);
      }
    }, 0);

    // If the number of rows and columns has change from the previous grid then create a new one
    // if(grid.numRows !== numRows || grid.numColumns !== numColumns) {
    //   setGrid(new Grid(numRows, numColumns));
    // }
    setGrid(new Grid(numRows, numColumns));

    // Set animation states
    setIsAnimationCompleted(false);
    setIsAnimationRunning(false);
  };

  const clearWallsAndGrid = () => {
    // States
    setIsAnimationCompleted(false);
    setIsAnimationRunning(false);

    clearGrid(grid);
  };

  const clearSearchPath = () => {
    // Set animation states
    setIsAnimationRunning(false);
    // Just build the grid without the animations
    buildGrid(grid);
    // After building the grid set is animation completed to false
    // setIsAnimationCompleted(false);
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
    const inverseSpeed = (1 / animationSpeed) * 3000;
    let shortestPathCost = 0;

    // ---> Utility functions
    const updateNodeClass = (
      node: Node,
      isVisited: boolean, // If the node is not visited then is shortest path
      runAnimation: boolean = false
    ) => {
      const nodeId = `node-${node.rowIndex}-${node.columnIndex}`;
      const nodeElement = document.getElementById(nodeId) as HTMLElement;
      if (nodeElement) {
        if (isVisited) {
          nodeElement.className = "node node-visited";
        } else {
          nodeElement.className = "node node-shortest-path";
        }
        if (runAnimation) {
          nodeElement.className += " stopped";
        }
        // Start Node
        if (grid.isSameNodePosition(node, grid.startNode)) {
          nodeElement.style.backgroundImage = "url('/start_right.svg')";
        }
        if (grid.isSameNodePosition(node, grid.targetNode)) {
          nodeElement.style.backgroundImage = "url('/target.svg')";
        }
      }
    };

    // ---> Animate
    // Animate the visited nodes first
    const visitedNodesTimeout = animations.visitedNodes.length * inverseSpeed; // animation is over
    animations.visitedNodes.forEach((node, index) => {
      setTimeout(() => {
        updateNodeClass(node, true, isAnimationRunning);
      }, index * inverseSpeed);
    });
    // Animate the shortest path
    const shortestPathTimeout = animations.shortestPath.length * inverseSpeed;
    setTimeout(() => {
      animations.shortestPath.forEach((node, index) => {
        shortestPathCost += 1;
        if (node.type == NodeType.Weight) {
          shortestPathCost += NodeWeightValue;
        }
        setTimeout(() => {
          updateNodeClass(node, false, isAnimationRunning);
          // After the start node
          if (index == 1) {
            updateStartNodeImgDirection(
              grid.startNode,
              getNodeDirection(grid.startNode, node)
            );
          }
        }, index * inverseSpeed);
      });
    }, visitedNodesTimeout);

    setTimeout(() => {
      setIsAnimationRunning(false);
      setIsAnimationCompleted(true);
      // Set path variables
      setVisitedNodesCount(animations.visitedNodes.length); // Without start
      setShortestPathWeightCost(shortestPathCost - 1);
    }, visitedNodesTimeout + shortestPathTimeout);

    // ---> Reset clearing timeout so the animation stops
    const highestId = window.setTimeout(() => {
      for (let i = highestId; i >= 0; i--) {
        window.clearTimeout(i);
      }
    }, visitedNodesTimeout + shortestPathTimeout);
  };

  const updateSearchAnimation = (animations: AnimationSearchType) => {
    let shortestPathCost = 0;
    animations.shortestPath.forEach((node) => {
      shortestPathCost += 1;
      if (node.type == NodeType.Weight) {
        shortestPathCost += NodeWeightValue;
      }
    });
    // Set path variables
    setVisitedNodesCount(animations.visitedNodes.length); // Without start
    setShortestPathWeightCost(shortestPathCost - 1);
    // Clear the previous search path
    stopAnimation();
    // Change the nodes in the animations arrays (visitedNodes & shortestPath)
    updateSearchPath(animations, isAnimationRunning);
  };

  const stopAnimation = () => {
    // States
    setIsAnimationRunning(false);
    // ---> Reset clearing timeout so the animation stops
    const highestId = window.setTimeout(() => {
      for (let i = highestId; i >= 0; i--) {
        window.clearTimeout(i);
      }
    }, 0);

    buildGrid(grid);
  };

  // ---> Node
  const updateNode = (rowIndex: number, columnIndex: number) => {
    // Just update the node when the animation is not running
    if (isAnimationRunning && !isAnimationCompleted) return;

    // If the current node is a wall remove it, if its not then add it
    const existingWeight = grid.weights.find(
      (weight) =>
        weight.rowIndex === rowIndex && weight.columnIndex === columnIndex
    );
    const existingWall = grid.walls.find(
      (wall) => wall.rowIndex === rowIndex && wall.columnIndex === columnIndex
    );

    if (existingWall) {
      grid.removeWall(rowIndex, columnIndex);
    } else {
      if (!existingWeight && !isWeightKeyPressed) {
        grid.addWall(rowIndex, columnIndex);
      }
    }

    if (existingWeight) {
      grid.removeWeight(rowIndex, columnIndex);
      // removeBackgroundImg(rowIndex, columnIndex);
    } else {
      if (!existingWall && isWeightKeyPressed) {
        grid.addWeight(rowIndex, columnIndex);
      }
    }

    // If the animation is completed just update the path
    clearSearchPath();
    if (isAnimationCompleted && !isAnimationRunning) {
      // Only update the path when the current added/removed is in the visited nodes
      // Nothing to update
      // if (grid.targetNode.weight === Infinity) {
      //   return;
      // }
      generateSearchAnimation(
        searchAlgorithmSelected,
        isAnimationRunning,
        grid,
        updateSearchAnimation
      );
    }
  };

  const updateStartOrTargetNode = (rowIndex: number, columnIndex: number) => {
    if (
      previousNode?.rowIndex == rowIndex &&
      previousNode?.columnIndex == columnIndex
    ) {
      return;
    }
    // Update the grid
    // If the current node is a wall remove it, if its not then add it
    const existingWeight = grid.weights.find(
      (weight) =>
        weight.rowIndex === rowIndex && weight.columnIndex === columnIndex
    );
    const existingWall = grid.walls.find(
      (wall) => wall.rowIndex === rowIndex && wall.columnIndex === columnIndex
    );

    if (existingWall) {
      grid.removeWall(rowIndex, columnIndex);
    }

    if (existingWeight) {
      grid.removeWeight(rowIndex, columnIndex);
    }
    // If the node dragged is not start then is target
    const newNode = new Node(rowIndex, columnIndex);

    if (isStartNodeDragged) {
      // Start
      if (
        grid.isSameNodePosition(grid.startNode, newNode) || // Nothing to update
        grid.isSameNodePosition(grid.targetNode, newNode) // Cannot set targetNode as startNode
      ) {
        return;
      }
      grid.updateStartNode(newNode);
    } else {
      // Target
      if (
        grid.isSameNodePosition(grid.targetNode, newNode) || // Nothing to update
        grid.isSameNodePosition(grid.startNode, newNode) // Cannot set startNode as targetNode
      ) {
        return;
      }
      grid.updateTargetNode(newNode);
    }

    if (previousNode !== null) {
      // if(!isUpdateNode) {
      switch (previousNode.type) {
        case NodeType.Unreachable:
          grid.setNode(
            new Node(
              previousNode.rowIndex,
              previousNode.columnIndex,
              Infinity,
              NodeType.Unreachable
            )
          );
          break;
        case NodeType.Wall:
          grid.addWall(previousNode.rowIndex, previousNode.columnIndex);
          break;
        case NodeType.Weight:
          grid.addWeight(previousNode.rowIndex, previousNode.columnIndex);
          break;
      }
      // }
    }

    // setPreviousNode(grid.getNode(rowIndex, columnIndex));

    // If the animation is completed just update the path
    clearSearchPath();
    if (isAnimationCompleted && !isAnimationRunning) {
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
    isWeightKeyPressed,
    setIsWeightKeyPressed,
    isStartNodeDragged,
    setIsStartNodeDragged,
    isUpdateNode,
    setIsUpdateNode,
    previousNode,
    setPreviousNode,
    // Path
    visitedNodesCount,
    setVisitedNodesCount,
    shortestPathWeightCost,
    setShortestPathWeightCost,
    // Variables
    requiresReset,
    hasExecuted,
    setHasExecuted,
    // ---> Functions
    // Grid
    resetGridAndAnimation,
    clearWallsAndGrid,
    clearSearchPath,
    // Animation
    runSearchAnimation,
    updateSearchAnimation,
    stopAnimation,
    // Node
    updateNode,
    updateStartOrTargetNode,
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
