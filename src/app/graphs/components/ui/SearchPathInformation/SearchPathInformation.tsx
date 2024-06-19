export default function SearchPathInformation({
  visitedNodesCount,
  shortestPathWeight,
}: {
  visitedNodesCount: number;
  shortestPathWeight: number;
}) {
  return (
    <div className="flex w-full text-gray-400 p-1 rounded">
      <div className="flex flex-row items-center justify-start w-full space-x-2 select-none">
        <span className="font-bold text-xs">Visited Nodes:</span>
        <span className="ml-2 text-xs text-gray-500">{visitedNodesCount}</span>
        <span className="mx-2">|</span>
        <span className="font-bold text-xs">
          {shortestPathWeight > 0
            ? "Path Cost: "
            : "Path not found"}
        </span>
        <span className="ml-2 text-xs text-gray-500">
          {shortestPathWeight > 0 ? shortestPathWeight : ""}
        </span>
      </div>
    </div>
  );
}
