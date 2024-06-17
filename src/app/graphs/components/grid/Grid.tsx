"use client";

import { useEffect } from "react";
import { buildGrid } from "../../animations/grid/gridAnimations";
import { usePathfinderVisualizerContext } from "../../context/graphContext";
import NodeComponent from "../node/Node";

export default function GridComponent() {
  // Use context
  const { grid, setIsMousePressed } =
    usePathfinderVisualizerContext();

  // -----> Handle functions <-----
  const handleOnMouseLeave = () => {
    setIsMousePressed(false);
  };
  // ----->/Handle functions <-----

  useEffect(() => {
    buildGrid(grid);
  }, [grid]);

  return (
    <div
      id="grid"
      className="flex flex-col justify-center items-center"
      onMouseLeave={handleOnMouseLeave}
    >
      {grid.nodes.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center justify-center">
          {row.map((node, columnIndex) => (
            <NodeComponent key={`${rowIndex}-${columnIndex}`} node={node} />
          ))}
        </div>
      ))}
    </div>
  );
}
