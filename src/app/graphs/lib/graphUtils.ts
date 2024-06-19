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
import {
  SearchAlgorithmType,
  AnimationSearchType,
} from "./animations/animationTypes";
import { generateDFSSearchAnimation } from "../algorithms/pathfinder/unweighted/depthFirstSearch";
// <-----------/Imports ----------->

export const searchAlgorithmSelectorOptions: AlgorithmSelectorOptions[] = [
  { label: "Dijkstra's", value: "dijkstras" },
  { label: "A*", value: "a_star" },
  { label: "Greedy BFS", value: "greedy_bfs" },
  { label: "DFS", value: "dfs" },
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
    case "dfs":
      generateDFSSearchAnimation(isAnimationRunning, grid, runAnimation);
      break;
    default:
      break;
  }
}

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
  },
  dfs: {
    title: "Depth-First Search (DFS)",
    description:
      "Depth-First Search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root (selecting some arbitrary node as the root in the case of a graph) and explores as far as possible along each branch before backtracking. It uses a stack to remember to get the next vertex to start a search when a dead end occurs in any iteration.",
    worstCase: "O(V + E)",
    averageCase: "O(V + E)",
    bestCase: "O(V + E)",
  },
};
