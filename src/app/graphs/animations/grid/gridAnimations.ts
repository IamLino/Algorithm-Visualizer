import { AnimationSearchType } from "../../lib/animations/animationTypes";
import { Grid, Node } from "../../lib/graphTypes";
import updateNodeClassName from "../node/nodeAnimations";

export function buildGrid(grid: Grid) {
  grid.nodes.forEach((row) => {
    row.forEach((node) => {
      updateNodeClassName(node);
    });
  });
}

function runSearchAnimation(animations: AnimationSearchType) {}

export function updateSearchPath(animations: AnimationSearchType) {
  animations.visitedNodes.forEach((node, index) => {
    updateNodeClassName(node, true, false);
  });

  // Animate the shortest path
  animations.shortestPath.forEach((node, index) => {
    updateNodeClassName(node, false, true);
  });
}

function clearSearchPath(grid: Grid) {
  grid.clearGrid();
  buildGrid(grid);
}
