import Tooltip from "@/app/components/ui/tooltip/Tooltip";
import Link from "next/link";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function Return() {
  return (
    <Tooltip infoText="Return Home">
      <div className="flex items-center justify-start">
        <Link href="/">
          <IoIosArrowRoundBack className="text-gray-400 h-6 w-6" />
        </Link>
      </div>
    </Tooltip>
  );
}
