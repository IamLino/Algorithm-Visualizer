"use client";

import { usePathfinderVisualizerContext } from "../../context/graphContext";
import NodeComponent from "../node/Node";

export default function GridComponent() {
  // Use context
  const { grid, setIsMousePressed } = usePathfinderVisualizerContext();

  // -----> Handle functions <-----
  const handleOnMouseLeave = () => {
    setIsMousePressed(false);
  };
  // ----->/Handle functions <-----

  return (
    <div
      id="grid"
      className="flex flex-col justify-center items-center"
      onMouseLeave={handleOnMouseLeave}
    >
      {grid.nodes.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((node, columnIndex) => (
            <NodeComponent key={`${rowIndex}-${columnIndex}`} node={node} />
          ))}
        </div>
      ))}
    </div>
  );
}
