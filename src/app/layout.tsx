import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AlgorithmVisualizerProvider } from "./context/Visualizer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Algorithm Visualizer",
  description: "Visualize a selection of different sorting algorithms"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AlgorithmVisualizerProvider>
          {children}
        </AlgorithmVisualizerProvider>
      </body>
    </html>
  );
}
