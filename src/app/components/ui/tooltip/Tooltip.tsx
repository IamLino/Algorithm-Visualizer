import React, { useState } from "react";
import "./Tooltip.css";

export default function Tooltip({
  infoText,
  children,
}: {
  infoText: string;
  children: React.ReactNode;
}) {
  // State to manage tooltip visibility
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="tooltip-container">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>

      {/* Tooltip content */}
      <div className={`tooltip ${showTooltip ? "open" : ""}`}>
        {infoText}
        {/* Arrow indicator */}
        {/* <div className="arrow" /> */}
      </div>
    </div>
  );
}
