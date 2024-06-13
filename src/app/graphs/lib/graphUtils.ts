// <----------- Imports ----------->
// General
import { AlgorithmData, AlgorithmSelectorOptions } from "@/app/lib/types";
// Graph
import { Grid } from "./graphTypes";
// ---> Algorithms
// Weighted
import { generateDijkstrasSearchAnimation } from "../algorithms/pathfinder/weighted/dijkstrasSearch";
import { generateAStarSearchAnimation } from "../algorithms/pathfinder/weighted/aStarSearch";
import { generateGreedyBFSearchAnimation } from "../algorithms/pathfinder/weighted/greedyBFSearch";
// Unweighted
// Animation
import { SearchAlgorithmType, AnimationSearchType } from "./animations/animationTypes";
// <-----------/Imports ----------->

export const searchAlgorithmSelectorOptions: AlgorithmSelectorOptions[] = [
  { label: "Dijkstra's", value: "dijkstras" },
  { label: "A*", value: "a_star" },
  { label: "Greedy BFS", value: "greedy_bfs" },
  // { label: "DFS", value: "dfs" },
];

export function generateSearchAnimation(
  selectedAlgorithm: SearchAlgorithmType,
  isAnimationRunning: boolean,
  grid: Grid,
  runAnimation: (animations: AnimationSearchType) => void
) {
  switch (selectedAlgorithm) {
    case "dijkstras":
      generateDijkstrasSearchAnimation(isAnimationRunning, grid, runAnimation);
      break;
    case "a_star":
      generateAStarSearchAnimation(isAnimationRunning, grid, runAnimation);
      break;
    case "greedy_bfs":
      generateGreedyBFSearchAnimation(isAnimationRunning, grid, runAnimation);
      break;
    // case "dfs":
    //   generateDFSSearchAnimation(isAnimationRunning, grid, runAnimation);
    //   break;
    default:
      break;
  };
};

export const searchAlgorithmsData: { [key: string]: AlgorithmData } = {
  dijkstras: {
    title: "Dijkstra's Algorithm",
    description:
      "Dijkstra's algorithm is a graph search algorithm that finds the shortest path from a source node to all other nodes in a weighted graph with non-negative weights. It uses a priority queue to repeatedly select the node with the smallest known distance and explores its neighbors, updating their distances as it goes.",
    worstCase: "O(V²)",
    averageCase: "O(E + V log V)",
    bestCase: "O(E + V log V)",
  },
  a_star: {
    title: "A* Algorithm",
    description:
      "The A* algorithm is a graph traversal and path search algorithm used to find the shortest path between two nodes. It combines the features of Dijkstra's algorithm and a heuristic approach. A* uses a priority queue and evaluates nodes by combining the cost to reach the node and an estimated cost to the goal.",
    worstCase: "O(E)",
    averageCase: "O(E)",
    bestCase: "O(E)",
  },
  greedy_bfs: {
    title: "Greedy Best-First Search",
    description:
      "Greedy Best-First Search is a search algorithm that explores a graph by expanding the most promising node chosen according to a specified rule. Typically, it uses a heuristic function to estimate the cost to reach the goal from the current node and prioritizes nodes with the lowest estimated cost.",
    worstCase: "O(b^d)",
    averageCase: "O(b^d)",
    bestCase: "O(b^d)",
  }

  // dfs: {
  //   title: "Merge Sort",
  //   description:
  //     "Merge sort divides the unsorted list into n sub-lists, each containing one element (a list of one element is considered sorted), and then repeatedly merges these sub-lists to produce new sorted sub-lists until there is only one sub-list remaining, which is the sorted list. This algorithm uses a divide-and-conquer approach, splitting the list in half recursively and merging the sorted halves back together.",
  //   worstCase: "O(n log n)",
  //   averageCase: "O(n log n)",
  //   bestCase: "O(n log n)",
  // }
};