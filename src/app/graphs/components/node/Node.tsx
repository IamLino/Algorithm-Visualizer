"use client";

import { useState } from "react";
import updateNodeClassName, {
  getNodeClassName,
  getNodeWeightText,
  updateTargetNodeImg,
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
    isWeightKeyPressed,
    setIsWeightKeyPressed,
    updateNode,
    setLastMousePressedPosition,
    isAnimationRunning,
    isAnimationCompleted,
    isStartNodeDragged,
    setIsStartNodeDragged,
    previousNode,
    setPreviousNode,
    isUpdateNode,
    setIsUpdateNode,
    updateStartOrTargetNode,
  } = usePathfinderVisualizerContext();

  // -----> Handle functions <-----
  const handleOnMouseEnter = () => {
    // Just update the node when the animation is not running & the mouse is pressed

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
    // setIsWeightKeyPressed(false);
  };
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "w") {
      setIsWeightKeyPressed(true);
    }
  };
  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "w") {
      setIsWeightKeyPressed(false);
    }
  };
  const handleOnDragStart = (e: React.DragEvent) => {
    if (node.type === NodeType.Start) {
      setIsMousePressed(false);
      setIsStartNodeDragged(true);
      return;
    }
    if (node.type === NodeType.Target) {
      setIsMousePressed(false);
      setIsStartNodeDragged(false);
      return;
    }
    e.preventDefault();
  };
  const handleOnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // If the node haven't changed or the animation is not completed then there is nothing to update
    if (
      (previousNode?.rowIndex == node.rowIndex &&
        previousNode?.columnIndex == node.columnIndex) ||
      (!isAnimationCompleted && previousNode !== null)
    ) {
      return;
    }
    setIsUpdateNode(false);
    // ! TODO: Only call the updateStartOrTargetNode once
    updateStartOrTargetNode(node.rowIndex, node.columnIndex);
    setPreviousNode(node);
  };
  const handleOnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // ---> States
    // Set node dragged to false
    setIsStartNodeDragged(false);
    // Update the node
    setIsUpdateNode(true);
    // Update the grid
    updateStartOrTargetNode(node.rowIndex, node.columnIndex);
    // Set previous node as null
    // setPreviousNode(null);
  };
  // ----->/Handle functions <-----

  return (
    <div
      // Node info
      id={`node-${node.rowIndex}-${node.columnIndex}`}
      className={`node `}
      // Key Events
      onKeyDown={handleOnKeyDown}
      onKeyUp={handleOnKeyUp}
      tabIndex={0}
      // Mouse Events
      onMouseEnter={handleOnMouseEnter}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      // Drag Events
      draggable={
        (node.type === NodeType.Start || node.type === NodeType.Target) &&
        !isAnimationRunning
      }
      onDragOver={handleOnDragOver}
      onDragStart={handleOnDragStart}
      onDrop={handleOnDrop}
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
