import { AnimationSearchType } from "@/app/graphs/lib/animations/animationTypes";
import { Grid, Node, NodeType } from "@/app/graphs/lib/graphTypes";

function runDFS(grid: Grid, animations: AnimationSearchType): void {
  const stack: Node[] = [];
  const cameFrom: Map<Node, Node> = new Map<Node, Node>();
  const visited: Set<Node> = new Set<Node>();

  stack.push(grid.startNode);

  while (stack.length > 0) {
    const currentNode = stack.pop();
    if (!currentNode) continue;

    if (visited.has(currentNode)) {
      continue;
    }

    visited.add(currentNode);
    animations.visitedNodes.push(currentNode);

    // If we reach the target node, reconstruct the path
    if (currentNode === grid.targetNode) {
      reconstructPath(cameFrom, currentNode, animations);
      return;
    }

    const neighbors = getOrderedNeighbors(grid, currentNode);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && !grid.isWall(neighbor.rowIndex, neighbor.columnIndex)) {
        stack.push(neighbor);
        cameFrom.set(neighbor, currentNode);
      }
    }
  }

  // Path not found
  animations.shortestPath = [];
}

function getOrderedNeighbors(grid: Grid, node: Node): Node[] {
  const neighbors: Node[] = [];
  const directions = [
    { row: -1, col: 0 },  // Up
    { row: 0, col: -1 },  // Left
    { row: 0, col: 1 },   // Right
    { row: 1, col: 0 }    // Down
  ];

  for (const direction of directions) {
    const neighborRow = node.rowIndex + direction.row;
    const neighborCol = node.columnIndex + direction.col;

    if (grid.isValidPosition(neighborRow, neighborCol)) {
      neighbors.push(grid.getNode(neighborRow, neighborCol));
    }
  }

  return neighbors;
}

function reconstructPath(cameFrom: Map<Node, Node>, currentNode: Node, animations: AnimationSearchType): void {
  const path: Node[] = [];
  let temp: Node | undefined = currentNode;

  while (temp !== undefined) {
    path.unshift(temp);
    temp = cameFrom.get(temp);
  }

  animations.shortestPath = path;
}

export function generateDFSSearchAnimation(
  isAnimationRunning: boolean,
  grid: Grid,
  runAnimation: (animations: AnimationSearchType) => void
) {
  // Guards
  if (isAnimationRunning) return;

  // Initialize
  const tempGrid = grid;
  const animations: AnimationSearchType = {
    visitedNodes: [],
    shortestPath: [],
  };

  // Animation
  runDFS(tempGrid, animations);
  runAnimation(animations);
}
