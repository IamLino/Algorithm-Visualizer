export enum NodeType {
    Normal,
    Start,
    Target,
    Wall,
    Weight,
    Unreachable
}

export class Node {
    type: NodeType;
    rowIndex: number;
    columnIndex: number;
    weight: number;
    isVisited: boolean;

    constructor(
        rowIndex: number,
        columnIndex: number,
        weight: number = 0,
        type: NodeType = NodeType.Normal,
        isVisited: boolean = false
    ) {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
        this.weight = weight;
        this.type = type;
        this.isVisited = isVisited;
    }
}

export class Grid {
    numColumns: number;
    numRows: number;
    startNode: Node;
    targetNode: Node;
    walls: Node[];
    nodes: Node[][];
    // --------------------> Grid functions <--------------------
    constructor(numRows: number, numColumns: number) {
        // Initialize
        this.numColumns = numColumns;
        this.numRows = numRows;
        this.nodes = [];
        this.walls = [];
        // Set start node position in the first half the Grid
        this.startNode = new Node(
            Math.floor(numRows / 2), // Row Index
            Math.floor(numColumns / 4), // Column Index
            0,
            NodeType.Start
        );
        // Set target node position in the third half the Grid
        this.targetNode = new Node(
            Math.floor(numRows / 2), // Row Index
            Math.floor((numColumns / 4) * 3), // Column Index
            this.calculateAbsoluteNodeWeight(
                Math.floor(numRows / 2), // Row
                Math.floor((numColumns / 4) * 3) // Column
            ),
            NodeType.Target
        );

        // Build the Grid;
        this.buildGrid();
    }

    buildGrid(): void {
        // If we don't have a valid Grid return
        if (this.numColumns == 0 || this.numRows == 0) {
            return;
            // throw new Error(`ERROR: The number of columns and rows cannot be 0`);
        }
        // Initialize the Nodes of the Grid
        this.nodes = [];
        for (let row = 0; row < this.numRows; row++) {
            const rowNodes: Node[] = [];
            for (let column = 0; column < this.numColumns; column++) {
                rowNodes.push(
                    new Node(
                        row,
                        column,
                        this.calculateAbsoluteNodeWeight(row, column),
                        NodeType.Normal,
                        false
                    )
                );
            }
            this.nodes.push(rowNodes);
        }
        // Update target node weight
        this.targetNode.weight = this.calculateAbsoluteNodeWeight(this.targetNode.rowIndex, this.targetNode.columnIndex);
        // Set Start & Target Node
        this.setNode(this.startNode);
        this.setNode(this.targetNode);
        // // Update the nodes weight's
        // this.updateNodesWeight();
    }

    // Remove walls & weights
    clearGrid(): void {
        // Clear walls
        this.walls = [];
        // Clear the nodes
        this.buildGrid();
        // // Update nodes weight's
        // this.updateNodesWeight();
    }
    // -------------------->/Grid functions <--------------------

    // --------------------> Node functions <--------------------
    updateStartNode(newStartNode: Node): void {
        // Valid node
        if (this.isValidPosition(newStartNode.rowIndex, newStartNode.columnIndex)) {
            throw new Error(`ERROR: Cannot add startNode outside of the grid range`);
        }
        // Set old startNode to normal type
        this.updateNode(
            this.startNode,
            new Node(
                this.startNode.rowIndex,
                this.startNode.columnIndex,
                0,
                NodeType.Normal
            )
        );
        // Update current startNode
        this.startNode = new Node(
            newStartNode.rowIndex,
            newStartNode.columnIndex,
            0,
            NodeType.Start
        );
        // Update our nodes
        this.setNode(this.startNode);
        // Update nodes weight
        this.updateNodesWeight();
    }

    updateTargetNode(newTargetNode: Node): void {
        // Valid node
        if (
            this.isValidPosition(newTargetNode.rowIndex, newTargetNode.columnIndex)
        ) {
            throw new Error(`ERROR: Cannot add targetNode outside of the grid range`);
        }
        // Set old targetNode to normal type
        this.updateNode(
            this.targetNode,
            new Node(
                this.targetNode.rowIndex,
                this.targetNode.columnIndex,
                this.calculateAbsoluteNodeWeight(
                    this.targetNode.rowIndex,
                    this.targetNode.columnIndex
                ),
                NodeType.Normal
            )
        );
        // Update current targetNode
        this.targetNode = new Node(
            newTargetNode.rowIndex,
            newTargetNode.columnIndex,
            this.calculateAbsoluteNodeWeight(
                newTargetNode.rowIndex,
                newTargetNode.columnIndex
            ),
            NodeType.Target
        );
        // Update our nodes
        this.setNode(this.targetNode);
    }

    addWall(row: number, column: number): void {
        // Valid node
        // if (this.isValidPosition(newWallNode.rowIndex, newWallNode.columnIndex)) {
        //     throw new Error(`ERROR: Cannot add wallNode outside of the grid range`);
        // }
        // Initialize the new node
        const newWallNode = new Node(row, column, Infinity, NodeType.Wall);
        // Cannot set start or target node as wall
        if (
            this.isSameNodePosition(this.startNode, newWallNode) ||
            this.isSameNodePosition(this.targetNode, newWallNode)
        ) {
            return;
            // throw new Error(`ERROR: Cannot set startNode or targetNode as a wallNode`);
        }
        // Update our nodes
        this.setNode(newWallNode);
        // Push into wall's
        this.walls.push(newWallNode);
        this.updateNodesWeight();
    }

    removeWall(row: number, column: number): void {
        // Valid node
        // if (this.isValidPosition(oldWallNode.rowIndex, oldWallNode.columnIndex)) {
        //     throw new Error(`ERROR: Cannot remove wallNode outside of the grid range`);
        // }
        // Not valid position
        if (!this.isValidPosition(row, column)) {
            return;
        }
        // oldNode is not Wall
        if (!this.isWall(row, column)) {
            return;
        }

        const indexToRemove = this.walls.findIndex(wall => wall.rowIndex === row && wall.columnIndex === column);
        if (indexToRemove !== -1) { // Remove from walls
            this.walls.splice(indexToRemove, 1);
        } else { // wall not in walls
            return;
        }
        // Update nodes
        this.updateNode(
            this.getNode(
                row,
                column
            ),
            new Node(
                row,
                column,
                Infinity,
                NodeType.Normal
            )
        );
        // Update the weights
        this.updateNodesWeight();
    }
    // -------------------->/Node functions <--------------------

    // --------------------> Weight functions <--------------------
    // Calculate the Manhattan distance base on the start node
    calculateAbsoluteNodeWeight(row: number, column: number): number {
        // Current node is Wall
        if (this.isWall(row, column)) return Infinity;

        return this.calculateManhattanDistance(this.startNode, new Node(row, column));
    }

    // Get the adjacent neighbors that are not walls
    getValidNeighbors(node: Node): Node[] {
        const neighbors: Node[] = [];
        const directions = [
            [-1, 0], // Up 
            [1, 0],  // Down
            [0, -1], // Left
            [0, 1] //Right
        ];

        directions.forEach(([dr, dc]) => {
            const newRow = node.rowIndex + dr;
            const newColumn = node.columnIndex + dc;

            if (this.isValidPosition(newRow, newColumn)) {
                const neighbor = this.nodes[newRow][newColumn];
                // Only consider neighbor's that are not wall's
                if (!this.isWall(newRow, newColumn)) {
                    neighbors.push(neighbor);
                }
            }
        });

        return neighbors;
    }

    // Update nodes weight using Dijkstra's
    updateNodesWeight(): void {
        // Set all nodes with a weight of infinity & notVisited
        this.nodes.forEach(row => {
            row.forEach(node => {
                node.weight = Infinity;
                node.isVisited = false;
            });
        });

        // Mark startNode as visited
        this.startNode.weight = 0;
        this.startNode.isVisited = true;

        // ---> Dijkstra's
        let currentNode = this.startNode;
        const visitedNodes = new Set<Node>();

        while (true) {
            const neighbors = this.getValidNeighbors(currentNode);
            neighbors.forEach(neighbor => {
                const newWeight = currentNode.weight + 1;
                if (newWeight < neighbor.weight) {
                    neighbor.weight = newWeight;
                }
            });

            currentNode.isVisited = true;
            visitedNodes.add(currentNode);

            // Get the next unVisited node with the lower weight
            let nextNode: Node | null = null;
            this.nodes.forEach(row => {
                row.forEach(node => {
                    if (!node.isVisited && (nextNode === null || node.weight < nextNode.weight)) {
                        nextNode = node;
                    }
                });
            });

            if (nextNode === null) break; // No more nodes to visit
            currentNode = nextNode;
        }

        // Mark unreachable nodes
        this.nodes.forEach(row => {
            row.forEach(node => {
                if (node.weight === Infinity && node.type !== NodeType.Wall) {
                    if (node.type !== NodeType.Target) {
                        node.type = NodeType.Unreachable;
                        // node.isVisited = false;
                    }
                }
                if (node.weight !== Infinity && node.type === NodeType.Unreachable) {
                    node.type = NodeType.Normal;
                }
                // node.isVisited = false;
            });
        });
    }

    // Get the Euclidean distance between 2 nodes
    calculateEuclideanDistance(node: Node, target: Node): number {
        return Math.abs(node.rowIndex - target.rowIndex) + Math.abs(node.columnIndex - target.columnIndex);
    }
    // Get the Manhattan distance between 2 nodes
    calculateManhattanDistance(node: Node, target: Node): number {
        return (
            Math.abs(node.rowIndex - target.rowIndex) +
            Math.abs(node.columnIndex - target.columnIndex)
        );
    }
    // -------------------->/Weight functions <--------------------

    // --------------------> Utility functions <--------------------
    getNode(row: number, column: number): Node {
        return this.nodes[row][column];
    }

    updateNode(oldNode: Node, newNode: Node): void {
        this.nodes[oldNode.rowIndex][oldNode.columnIndex] = newNode;
    }

    setNode(node: Node): void {
        this.nodes[node.rowIndex][node.columnIndex] = node;
    }

    isValidPosition(row: number, column: number): boolean {
        return (
            row >= 0 &&
            row < this.numRows &&
            column >= 0 &&
            column < this.numColumns
        );
    }

    isSameNodePosition(oldNode: Node, newNode: Node): boolean {
        return (
            oldNode.rowIndex == newNode.rowIndex &&
            oldNode.columnIndex == newNode.columnIndex
        );
    }

    isEdgeNode(node: Node): boolean {
        return (
            (node.rowIndex == 0 || node.columnIndex == 0) ||
            (node.rowIndex == this.numRows || node.columnIndex == this.numColumns)
        );
    }

    isWall(row: number, column: number): boolean {
        return this.walls.some(
            wall =>
                wall.rowIndex === row &&
                wall.columnIndex === column
        );
    }
    // -------------------->/Utility functions <--------------------
}