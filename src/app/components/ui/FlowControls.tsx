import { FaPlayCircle, FaStop } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import { RxReset } from "react-icons/rx";

export default function FlowControls({
  requiresReset,
  isAnimationRunning,
  handleSorting,
}: {
  requiresReset: boolean;
  isAnimationRunning: boolean;
  handleSorting: () => void;
}) {
  return (
    <button
      className="flex items-center justify-center"
      onClick={handleSorting}
    >
      {requiresReset ? (
        isAnimationRunning ? (
          <FaStop className="text-gray-400 h-6 w-8" />
        ) : (
          <RxReset className="text-gray-400 h-7 w-8" />
        )
      ) : (
        <FaPlay className="text-gray-400 h-6 w-8" />
        // <FaPlayCircle className="text-gray-400 h-7 w-8" />
      )}
    </button>
  );
}
