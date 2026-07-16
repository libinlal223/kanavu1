"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "./SmoothScroll";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function Layout({ children }) {
  const [isCanvasVisible, setIsCanvasVisible] = useState(true);

  useEffect(() => {
    const targets = ["hero", "nebula", "finale", "about-us"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (targets.length === 0) return;

    // Track visibility of each section
    const visibilityMap = new Map();
    targets.forEach((t) => visibilityMap.set(t.id, false));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target.id, entry.isIntersecting);
        });

        // If any of the tracked sections are intersecting, the canvas should be visible
        const shouldBeVisible = Array.from(visibilityMap.values()).some((visible) => visible);
        setIsCanvasVisible(shouldBeVisible);
      },
      {
        threshold: 0,
        rootMargin: "150px 0px 150px 0px", // Pre-load or turn on before entering view
      }
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <SmoothScroll>
      {/* Fixed 3D Background */}
      <div 
        className="canvas-container"
        style={{ display: isCanvasVisible ? "block" : "none" }}
      >
        <Scene />
      </div>

      {/* Scrollable HTML Content */}
      <div className="scroll-content">
        {children}
      </div>
    </SmoothScroll>
  );
}
