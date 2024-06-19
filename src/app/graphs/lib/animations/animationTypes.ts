import {Node} from "../graphTypes";

export type SearchAlgorithmType =
    // Weighted
    "dijkstras" |
    "a_star" |
    "greedy_bfs" |
    // Unweighted
    "dfs";

export type AnimationSearchType = {
    visitedNodes: Node[];
    shortestPath: Node[];
};