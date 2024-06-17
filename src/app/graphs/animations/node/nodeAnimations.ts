import { Node, NodeDirection, NodeType } from "@/app/graphs/lib/graphTypes";

export default function updateNodeClassName(
  node: Node,
  isVisited: boolean = false,
  isShortestPath: boolean = false,
  isAnimationRunning: boolean = false
) {
  const nodeId = `node-${node.rowIndex}-${node.columnIndex}`;
  const nodeElement = document.getElementById(nodeId) as HTMLElement;
  if (nodeElement) {
    nodeElement.className = getNodeClassName(
      node.type,
      isVisited,
      isShortestPath,
      isAnimationRunning
    );
    if (node.type == NodeType.Weight) {
      updateWeightNodeImg(node);
    } else if (
      node.type == NodeType.Wall ||
      node.type == NodeType.Unreachable ||
      node.type == NodeType.Normal
    ) {
      nodeElement.style.backgroundImage = "none";
    }
    const nodeWeightId = nodeId + "-weight";
    const nodeWeightElement = document.getElementById(
      nodeWeightId
    ) as HTMLElement;
    if (nodeWeightElement) {
      nodeWeightElement.textContent = getNodeWeightText(node.weight, node.type);
    }
  }
}

export function getNodeWeightText(weight: number, nodeType: NodeType): string {
  let weightText = "";
  switch (nodeType) {
    case NodeType.Wall:
      weightText = "X";
      break;
    case NodeType.Unreachable:
      weightText = "-";
      break;
    default:
      if (weight === Infinity) {
        weightText = "NA";
      } else {
        weightText = weight.toString();
      }
      break;
  }
  return weightText;
}

export function getNodeClassName(
  nodeType: NodeType,
  isVisited: boolean = false,
  isShortestPath: boolean = false,
  isAnimationRunning: boolean = false
): string {
  let nodeClass = "node ";
  switch (nodeType) {
    case NodeType.Normal:
      nodeClass += "node-normal ";
      if (isVisited) {
        nodeClass += "node-visited ";
      }
      if (isShortestPath) {
        nodeClass += "node-shortest-path ";
      }
      if (!isAnimationRunning) {
        nodeClass += "stopped ";
      }
      break;
    case NodeType.Start:
      nodeClass += "node-start ";
      if (isVisited) {
        nodeClass += "node-visited ";
      }
      if (isShortestPath) {
        nodeClass += "node-shortest-path ";
      }
      if (!isAnimationRunning) {
        nodeClass += "stopped ";
      }
      break;
    case NodeType.Target:
      nodeClass += "node-target ";
      if (isVisited) {
        nodeClass += "node-visited ";
      }
      if (isShortestPath) {
        nodeClass += "node-shortest-path ";
      }
      if (!isAnimationRunning) {
        nodeClass += "stopped ";
      }
      break;
    case NodeType.Wall:
      nodeClass += "node-wall ";
      break;
    case NodeType.Weight:
      nodeClass += "node-weight ";
      if (isVisited) {
        nodeClass += "node-visited ";
      }
      if (isShortestPath) {
        nodeClass += "node-shortest-path ";
      }
      if (!isAnimationRunning) {
        nodeClass += "stopped ";
      }
      break;
    case NodeType.Unreachable:
      nodeClass += "node-unreachable ";
      break;
    default:
      nodeClass += "node-normal ";
      break;
  }
  return nodeClass;
}

export function updateStartNodeImgDirection(
  startNode: Node,
  direction: NodeDirection
): void {
  const nodeId = `node-${startNode.rowIndex}-${startNode.columnIndex}`;
  const nodeElement = document.getElementById(nodeId) as HTMLElement;
  if (nodeElement) {
    switch (direction) {
      case NodeDirection.Left:
        nodeElement.style.backgroundImage = "url('/start_left.svg')";
        break;
      case NodeDirection.Right:
        nodeElement.style.backgroundImage = "url('/start_right.svg')";
        break;
      case NodeDirection.Up:
        nodeElement.style.backgroundImage = "url('/start_up.svg')";
        break;
      case NodeDirection.Down:
        nodeElement.style.backgroundImage = "url('/start_down.svg')";
        break;
      default:
        // Left by default
        nodeElement.style.backgroundImage = "url('/start_left.svg')";
        break;
    }
  }
}

export function updateTargetNodeImg(targetNode: Node): void {
  const nodeId = `node-${targetNode.rowIndex}-${targetNode.columnIndex}`;
  const nodeElement = document.getElementById(nodeId) as HTMLElement;
  if (nodeElement) {
    nodeElement.style.backgroundImage = "url('/target.svg')";
  }
}

export function updateWeightNodeImg(weightNode: Node): void {
  const nodeId = `node-${weightNode.rowIndex}-${weightNode.columnIndex}`;
  const nodeElement = document.getElementById(nodeId) as HTMLElement;
  if (nodeElement) {
    nodeElement.style.backgroundImage = "url('/weight.svg')";
  }
}

export function removeBackgroundImg(row: number, column: number): void {
  const nodeId = `node-${row}-${column}`;
  const nodeElement = document.getElementById(nodeId) as HTMLElement;
  if (nodeElement) {
    nodeElement.style.backgroundImage = "none";
  }
}
