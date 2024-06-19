"use client";

import Link from "next/link";
import Tooltip from "./components/ui/tooltip/Tooltip";

export default function Home() {
  return (
    <main className="w-full flex justify-center">
      <div
        id="data-structure-container"
        className="max-w-[1020px] w-full flex items-center justify-center"
      >
        <div className="relative flex items-center justify-center w-full ">
          <div className="hidden sm:flex absolute top-[50%] left-0 transform -translate-y-1/2 w-full items-center justify-center">
            <div className="flex h-[250px] w-[950px] items-center justify-center text-gray-400 p-4 rounded border border-system-purple20 bg-system-purple80 bg-opacity-10 gap-2">
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-gray-300 text-2xl font-normal mb-2">
                  Welcome to...
                </h3>
                <h1 className="text-gray-300 text-4xl font-semibold mb-4">
                  Algorithm Visualizer by{" "}
                  <Link
                    href="https://www.linkedin.com/in/lino-murgu%C3%ADa/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lino
                  </Link>
                  .
                </h1>
                <p className="text-gray-300 text-xl font-light mb-4">
                  A website to visualize algorithms on different Data
                  Structures. Please pick one DS to start visualizing.
                </p>
                <div className="flex flex-row items-center justify-center w-full gap-20">
                  <Tooltip infoText="Sorting Visualizer">
                    <Link href="/arrays">
                      <p className="text-gray-300 text-xl font-semibold">
                        Arrays
                      </p>
                    </Link>
                  </Tooltip>
                  <Tooltip infoText="Pathfinder Visualizer">
                    <Link href="/graphs">
                      <p className="text-gray-300 text-xl font-semibold">
                        Graphs
                      </p>
                    </Link>
                  </Tooltip>
                  {/* <Tooltip infoText="Tree Traversal Visualizer">
                    <Link href="/trees">
                      <p className="text-gray-300 text-xl font-semibold">
                        Trees
                      </p>
                    </Link>
                  </Tooltip> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <footer className="mt-8 flex space-x-4">
        <a href="https://www.linkedin.com/in/lino-murgu%C3%ADa/" target="_blank" rel="noopener noreferrer">
          <img src="/public/linkedin-svg.svg" alt="LinkedIn" />
        </a>
        <a href="https://github.com/tu_usuario_github" target="_blank" rel="noopener noreferrer">
          <img src="/logos/github.png" alt="GitHub" />
        </a>
        <a href="https://wa.me/tu_numero_whatsapp" target="_blank" rel="noopener noreferrer">
          <img src="/logos/whatsapp.png" alt="WhatsApp" />
        </a>
      </footer> */}
    </main>
  );
}
