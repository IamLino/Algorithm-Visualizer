// <----------- Imports ----------->
// Graph
import { Grid, NodeType, Node, NodeDirection } from "../graphTypes";
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

export function getNodeDirection(node: Node, targetNode: Node): NodeDirection {
  // Up
  if (targetNode.rowIndex < node.rowIndex) {
    return NodeDirection.Up;
  }
  // Left or Right
  if (targetNode.rowIndex == node.rowIndex) {
    if (targetNode.columnIndex < node.columnIndex) {
      return NodeDirection.Left;
    }
    if (targetNode.columnIndex > node.columnIndex) {
      return NodeDirection.Right;
    }
  }
  // Down
  if (targetNode.rowIndex > node.rowIndex) {
    return NodeDirection.Down;
  }

  // Left by default
  return NodeDirection.Left;
}
