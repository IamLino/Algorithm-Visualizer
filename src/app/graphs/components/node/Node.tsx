"use client";

import updateNodeClassName, {
  getNodeClassName,
  getNodeWeightText,
} from "../../animations/node/nodeAnimations";
import { usePathfinderVisualizerContext } from "../../context/graphContext";
import { NodeType, Node, Grid } from "../../lib/graphTypes";
import "./Node.css";

export default function NodeComponent({
  // States
  node,
}: {
  // States
  node: Node;
}) {
  // Use the PathfinderVisualizerContext
  const {
    isWeightValueShown,
    isMousePressed,
    setIsMousePressed,
    updateNode,
    setLastMousePressedPosition,
    isAnimationRunning,
    isAnimationCompleted,
  } = usePathfinderVisualizerContext();

  // -----> Handle functions <-----
  const handleOnMouseEnter = () => {
    // Just update the node when the animation is completed or its not running & the mouse is pressed

    if (!isMousePressed || isAnimationRunning) {
      return;
    }
    // Update the current node
    updateNode(node.rowIndex, node.columnIndex);
  };
  const handleOnMouseDown = () => {
    // Update the states
    setIsMousePressed(true);
    setLastMousePressedPosition([node.rowIndex, node.columnIndex]);

    // Just update the node when the animation is completed or its not running
    if (isAnimationRunning) return;

    // Update the current node
    updateNode(node.rowIndex, node.columnIndex);
  };
  const handleOnMouseUp = () => {
    // Update the states
    setIsMousePressed(false);
  };
  // ----->/Handle functions <-----

  return (
    <div
      id={`node-${node.rowIndex}-${node.columnIndex}`}
      className={`node `}
      onMouseEnter={handleOnMouseEnter}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      onDrag={(e) => {
        e.preventDefault();
      }}
      onDragStart={(e) => {
        e.preventDefault();
      }}
    >
      {isWeightValueShown && (
        <span
          id={`node-${node.rowIndex}-${node.columnIndex}-weight`}
          className="text-xs flex items-center justify-center select-none"
        >
          {getNodeWeightText(node.weight, node.type)}
        </span>
      )}
    </div>
  );
}
