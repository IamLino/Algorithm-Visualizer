import { AnimationSearchType } from "../../lib/animations/animationTypes";
import { getNodeDirection } from "../../lib/animations/animationUtils";
import { Grid, Node, NodeDirection } from "../../lib/graphTypes";
import updateNodeClassName, {
  updateStartNodeImgDirection,
  updateTargetNodeImg,
} from "../node/nodeAnimations";

export function buildGrid(grid: Grid) {
  grid.nodes.forEach((row) => {
    row.forEach((node) => {
      updateNodeClassName(node);
    });
  });
  updateStartNodeImgDirection(grid.startNode, NodeDirection.Right);
  updateTargetNodeImg(grid.targetNode);
}

function runSearchAnimation(animations: AnimationSearchType) {}

export function updateSearchPath(
  animations: AnimationSearchType,
  isAnimationRunning: boolean = false
) {
  animations.visitedNodes.forEach((node, index) => {
    updateNodeClassName(node, true, false, isAnimationRunning);
  });

  // Animate the shortest path
  animations.shortestPath.forEach((node, index) => {
    updateNodeClassName(node, false, true);
  });

  if (animations.shortestPath.length > 0) {
    // Update the startNode image direction
    // After the start node
    const startNode = animations.shortestPath[0];
    const nextNode = animations.shortestPath[1]
    updateStartNodeImgDirection(
      startNode,
      getNodeDirection(startNode, nextNode)
    );
  }
}

export function clearGrid(grid: Grid) {
  grid.clearGrid();
  buildGrid(grid);
}
