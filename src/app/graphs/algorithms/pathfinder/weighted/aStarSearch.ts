import { AnimationSearchType } from "@/app/graphs/lib/animations/animationTypes";
import { reconstructPath } from "@/app/graphs/lib/animations/animationUtils";
import { Grid, Node, NodeType } from "@/app/graphs/lib/graphTypes";

function runAStar(grid: Grid, animations: AnimationSearchType): void {
  // Initialize
  const openSet: Set<Node> = new Set<Node>();
  const closedSet: Set<Node> = new Set<Node>();
  const cameFrom: Map<Node, Node> = new Map<Node, Node>();

  openSet.add(grid.startNode);

  while (openSet.size > 0) {
    // Get the node with the less total cost (f = g + h)
    let currentNode: Node | null = null;
    openSet.forEach((node) => {
      if (
        currentNode === null ||
        node.weight + grid.calculateEuclideanDistance(node, grid.targetNode) <
          currentNode.weight +
            grid.calculateEuclideanDistance(currentNode, grid.targetNode)
      ) {
        currentNode = node;
      }
    });

    if (currentNode === null) break;

    // If we reach the target node reconstruct the path
    if (currentNode === grid.targetNode) {
      reconstructPath(cameFrom, currentNode, animations);
      return;
    }

    // Move the current node from the open set to the closed
    openSet.delete(currentNode);
    closedSet.add(currentNode);
    animations.visitedNodes.push(currentNode);

    // Explore the valid neighbors
    const neighbors = grid.getValidNeighbors(currentNode);
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor)) {
        continue;
      }

      const tentative_gScore = currentNode.weight + 1;

      if (!openSet.has(neighbor)) {
        openSet.add(neighbor);
      } else if (tentative_gScore >= neighbor.weight) {
        continue;
      }

      // This is the best path so far
      cameFrom.set(neighbor, currentNode);
      neighbor.weight = tentative_gScore;
    }
  }

  // Path not found
  animations.shortestPath = [];
}

export function generateAStarSearchAnimation(
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
  runAStar(tempGrid, animations);
  runAnimation(animations);
}
