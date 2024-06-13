import { Node, NodeType } from "@/app/graphs/lib/graphTypes";

export default function updateNodeClassName(
  node: Node,
  isVisited: boolean = false,
  isShortestPath: boolean = false
) {
  const nodeId = `node-${node.rowIndex}-${node.columnIndex}`;
  const nodeElement = document.getElementById(nodeId) as HTMLElement;
  if (nodeElement) {
    nodeElement.className = getNodeClassName(node.type, isVisited, isShortestPath);
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
  isShortestPath: boolean = false
): string {
  let nodeClass = "node ";
  switch (nodeType) {
    case NodeType.Normal:
      if (isVisited) {
        nodeClass += "node-visited";
        return nodeClass;
      }
      if (isShortestPath) {
        nodeClass += "node-shortest-path";
        return nodeClass;
      }
      nodeClass += "node-normal";
      break;
    case NodeType.Start:
      nodeClass += "node-start";
      break;
    case NodeType.Target:
      nodeClass += "node-target";
      break;
    case NodeType.Wall:
      nodeClass += "node-wall";
      break;
    case NodeType.Weight:
      nodeClass += "node-weight";
      break;
    case NodeType.Unreachable:
      nodeClass += "node-unreachable";
      break;
    default:
      nodeClass += "node-normal";
      break;
  }
  return nodeClass;
}
