import { AnimationSearchType, Grid, Node, NodeType } from "../lib/graphTypes";

function runDFSSearch(grid: Grid, animations: AnimationSearchType) {
    const visitedNodes: Node[] = [];
    const previousNodes: (Node | null)[][] = Array.from({ length: grid.numRows }, () => Array(grid.numColumns).fill(null));
    const stack: Node[] = [];

    const startNode = grid.startNode;
    const targetNode = grid.targetNode;

    stack.push(startNode);

    while (stack.length > 0) {
        const currentNode = stack.pop();

        if (currentNode === undefined) break;

        if (currentNode.type === NodeType.Wall) continue;

        if (currentNode.isVisited) continue;
        currentNode.isVisited = true;

        visitedNodes.push(currentNode);
        animations.visitedNodes.push(currentNode);

        if (currentNode === targetNode) break;

        const neighbors = grid.getValidNeighbors(currentNode);

        for (const neighbor of neighbors) {
            if (!neighbor.isVisited && previousNodes[neighbor.rowIndex][neighbor.columnIndex] === null) {
                stack.push(neighbor);
                previousNodes[neighbor.rowIndex][neighbor.columnIndex] = currentNode;
            }
        }
    }

    animations.shortestPath = reconstructPath(previousNodes, startNode, targetNode);
}

function reconstructPath(previousNodes: (Node | null)[][], startNode: Node, targetNode: Node): Node[] {
    const path: Node[] = [];
    let currentNode: Node | null = previousNodes[targetNode.rowIndex][targetNode.columnIndex];

    while (currentNode !== null && currentNode !== startNode) {
        path.unshift(currentNode);
        currentNode = previousNodes[currentNode.rowIndex][currentNode.columnIndex];
    }

    if (currentNode === startNode) {
        path.unshift(startNode);
        path.push(targetNode);
    }

    return path;
}

export function generateDFSSearchAnimation(
    isAnimationRunning: boolean,
    grid: Grid,
    runAnimation: (animations: AnimationSearchType) => void,
) {
    // Guards
    if (isAnimationRunning) return;

    const tempGrid = grid;
    const animations: AnimationSearchType = {
        visitedNodes: [],
        shortestPath: []
    };

    runDFSSearch(tempGrid, animations);
    runAnimation(animations);
}
