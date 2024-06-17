import { AnimationSearchType } from "@/app/graphs/lib/animations/animationTypes";
import { Grid, Node, NodeType, NodeWeightValue } from "@/app/graphs/lib/graphTypes";

function runDijkstrasSearch(grid: Grid, animations: AnimationSearchType) {
  const visitedNodes: Node[] = [];
  const previousNodes: (Node | null)[][] = Array.from(
    { length: grid.numRows },
    () => Array(grid.numColumns).fill(null)
  );
  const distances: number[][] = Array.from({ length: grid.numRows }, () =>
    Array(grid.numColumns).fill(Infinity)
  );

  const startNode = grid.startNode;
  const targetNode = grid.targetNode;

  distances[startNode.rowIndex][startNode.columnIndex] = 0;
  const unvisitedNodes: Set<Node> = new Set(grid.nodes.flat());

  while (unvisitedNodes.size > 0) {
    // Encuentra el nodo con la distancia mínima conocida
    const currentNode = Array.from(unvisitedNodes).reduce((closestNode, node) =>
      distances[node.rowIndex][node.columnIndex] < distances[closestNode.rowIndex][closestNode.columnIndex]
       ? node
        : closestNode
    );

    // Si el nodo actual es una pared, lo ignoramos
    if (grid.isWall(currentNode.rowIndex, currentNode.columnIndex)) {
      unvisitedNodes.delete(currentNode);
      continue;
    }

    // Si el nodo actual ha sido visitado (distancia infinita), terminamos
    if (distances[currentNode.rowIndex][currentNode.columnIndex] === Infinity) {
      break;
    }

    // Marcar el nodo actual como visitado
    visitedNodes.push(currentNode);
    animations.visitedNodes.push(currentNode);

    // Eliminar el nodo actual de los nodos no visitados
    unvisitedNodes.delete(currentNode);

    // Explorar vecinos
    const neighbors = grid.getValidNeighbors(currentNode);

    for (const neighbor of neighbors) {
      let additionalCost = 1;
      if (neighbor.type === NodeType.Weight) {
        additionalCost += NodeWeightValue;
      }
      const alt = distances[currentNode.rowIndex][currentNode.columnIndex] + additionalCost;
      if (alt < distances[neighbor.rowIndex][neighbor.columnIndex]) {
        distances[neighbor.rowIndex][neighbor.columnIndex] = alt;
        previousNodes[neighbor.rowIndex][neighbor.columnIndex] = currentNode;
      }
    }

    // Comprobar si hemos llegado al nodo objetivo
    if (currentNode === targetNode) {
      break;
    }
  }

  // Reconstruir el camino más corto
  animations.shortestPath = reconstructPath(previousNodes, startNode, targetNode);
}

function reconstructPath(previousNodes: (Node | null)[][], startNode: Node, targetNode: Node): Node[] {
  const path: Node[] = [];
  let currentNode: Node | null = previousNodes[targetNode.rowIndex][targetNode.columnIndex];

  while (currentNode!== null && currentNode!== startNode) {
    path.unshift(currentNode);
    currentNode = previousNodes[currentNode.rowIndex][currentNode.columnIndex];
  }

  if (currentNode === startNode) {
    path.unshift(startNode);
    path.push(targetNode);
  }

  return path;
}

export function generateDijkstrasSearchAnimation(
  isAnimationRunning: boolean,
  grid: Grid,
  runAnimation: (animations: AnimationSearchType) => void
) {
  // Guards
  if (isAnimationRunning) return;

  const tempGrid = grid;
  const animations: AnimationSearchType = {
    visitedNodes: [],
    shortestPath: [],
  };

  runDijkstrasSearch(tempGrid, animations);
  runAnimation(animations);
}
