"use client";

import React, { useEffect, useRef } from "react";
import "./Typewriter.css";

export default function Typewriter({ text }: { text: string }) {
  const typewriterRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typewriterRef.current) {
      const characters = text.length;
      typewriterRef.current.style.setProperty(
        "--typewriterCharacters",
        `${characters}`
      );
    }
  }, [text]);

  return (
    <div className="typewriter-container">
      <h1
        className="text-gray-300 text-2xl font-light hidden md:flex"
        ref={typewriterRef}
      >
        {text}
      </h1>
    </div>
  );
}
