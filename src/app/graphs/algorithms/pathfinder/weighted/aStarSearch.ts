import { AnimationSearchType } from "@/app/graphs/lib/animations/animationTypes";
import { reconstructPath } from "@/app/graphs/lib/animations/animationUtils";
import { Grid, Node, NodeType, NodeWeightValue } from "@/app/graphs/lib/graphTypes";

function runAStar(grid: Grid, animations: AnimationSearchType): void {
  // Initialize
  const openSet: Set<Node> = new Set<Node>(); // Nodes to be evaluated
  const closedSet: Set<Node> = new Set<Node>(); // Nodes already evaluated
  const cameFrom: Map<Node, Node> = new Map<Node, Node>(); // Map of navigated nodes

  // Add the start node to the open set
  openSet.add(grid.startNode);

  // Initialize the start node's weight (distance from start)
  grid.startNode.weight = 0;

  while (openSet.size > 0) {
    // Get the node in the open set with the lowest f score (f = g + h)
    let currentNode: Node | null = null;
    for (const node of openSet) {
      if (!currentNode || node.weight + grid.calculateEuclideanDistance(node, grid.targetNode) < currentNode.weight + grid.calculateEuclideanDistance(currentNode, grid.targetNode)) {
        currentNode = node;
      }
    }

    if (!currentNode) break;

    // If we reach the target node, reconstruct the shortest path
    if (currentNode === grid.targetNode) {
      reconstructPath(cameFrom, currentNode, animations);
      return;
    }

    // Move the current node from the open set to the closed set
    openSet.delete(currentNode);
    closedSet.add(currentNode);
    animations.visitedNodes.push(currentNode);

    // Explore neighbors
    const neighbors = grid.getValidNeighbors(currentNode);
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor)) {
        continue; // Skip nodes that have already been evaluated
      }

      // Calculate tentative g score, including additional cost for Weight nodes
      let additionalCost = 1;
      if (neighbor.type === NodeType.Weight) {
        additionalCost += NodeWeightValue;
      }
      const tentative_gScore = currentNode.weight + additionalCost;

      // Discover a new node or find a better path to the neighbor
      if (!openSet.has(neighbor) || tentative_gScore < neighbor.weight) {
        cameFrom.set(neighbor, currentNode);
        neighbor.weight = tentative_gScore;

        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        }
      }
    }
  }

  // If we reach here, there is no path
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

  // Run A* algorithm
  runAStar(tempGrid, animations);

  // Execute animation
  runAnimation(animations);
}
