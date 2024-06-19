import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full flex justify-center">
      <div
        id="data-structure-container"
        className="flex max-w-[1020px] w-full flex-col lg:px-0 px-4">
        {/* First Row (Header & Controls) */}
        <div className="h-[66px] relative flex items-center justify-between w-full">
          <h1 className="text-gray-300 text-2xl font-light hidden md:flex">
            Algorithm Visualizer by Lino
          </h1>
          <div className="flex items-center justify-center gap-4"></div>
          <div className="hidden sm:flex absolute top-[120%] left-0 w-full">
            <div className="flex w-full text-gray-400 p-4 rounded border border-system-purple20 bg-system-purple80 bg-opacity-10 gap-6">
              <div className="flex flex-col items-start justify-start w-3/4 ">
                <ul>
                  <li>
                    <Link href="/arrays">Arrays</Link>
                  </li>
                  <li>
                    <Link href="/graphs">Graphs</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}