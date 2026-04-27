"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";

    // Trigger the progress bar to fill up
    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 50);

    // After 4 seconds, fade out the preloader
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      document.body.style.overflow = ""; // restore scrolling

      // Remove from DOM after 1s fade out
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }, 4000);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(fadeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center transition-opacity duration-1000 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
      style={{ background: "var(--background)" }}
    >
      <h1
        className="text-white text-[11px] md:text-sm tracking-[0.5em] font-light uppercase mb-8 opacity-80"
        style={{ fontFamily: '"Elms Sans", sans-serif' }}
      >
        Kanavu Kadha
      </h1>
      
      {/* Progress Bar Container */}
      <div className="w-48 md:w-64 h-[1px] bg-white/10 relative overflow-hidden">
        {/* Progress Fill */}
        <div
          className="absolute top-0 left-0 h-full bg-white/80"
          style={{
            width: `${progress}%`,
            transition: "width 3.9s cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        />
      </div>
      
      {/* Subtle Loading Text */}
      <div className="mt-6 text-white/30 text-[10px] tracking-widest uppercase" style={{ fontFamily: '"Elms Sans", sans-serif' }}>
        Loading Experience...
      </div>
    </div>
  );
}
