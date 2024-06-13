import { AlgorithmData } from "@/app/lib/types";
import ComplexityDetail from "./ComplexityDetail";

export default function AlgorithmInformation({algorithmData}: {
  algorithmData: AlgorithmData
}){
  return (
      <div className="flex w-full text-gray-400 p-4 rounded border border-system-purple20 bg-system-purple80 bg-opacity-10 gap-6">
        <div className="flex flex-col items-start justify-start w-3/4 ">
          <h3 className="text-lg">
            {algorithmData.title}
          </h3>
          <p className="text-sm text-gray-500 pt-2">
            {algorithmData.description}
          </p>
        </div>
        <div className="flex flex-col items-start justify-start w-1/4 gap-2">
          <h3 className="text-lg">Time Complexity</h3>
          <div className="flex flex-col gap-2">
            <ComplexityDetail title="Worst Case" value={algorithmData.worstCase} />
            <ComplexityDetail title="Average Case" value={algorithmData.averageCase} />
            <ComplexityDetail title="Best Case" value={algorithmData.bestCase} />
          </div>
        </div>
      </div>
  );
}
