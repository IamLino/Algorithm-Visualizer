// <----------- Imports ----------->
// Graph
import { Grid, NodeType, Node } from "../graphTypes";
// Animation Types
import { AnimationSearchType } from "./animationTypes";
// <-----------/Imports ----------->

// Get the path from start to target node
export function reconstructPath(
  cameFrom: Map<Node, Node>,
  currentNode: Node,
  animations: AnimationSearchType
): void {
  const path: Node[] = [];
  while (currentNode !== undefined) {
    path.push(currentNode);
    currentNode = cameFrom.get(currentNode) as Node;
  }
  path.reverse();
  animations.shortestPath = path;
}