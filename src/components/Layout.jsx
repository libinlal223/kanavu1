"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "./SmoothScroll";

// Dynamically import Scene with SSR disabled (Three.js needs the browser)
const Scene = dynamic(() => import("./Scene"), { ssr: false });

/**
 * Layout — the main composition layer.
 *
 *  ┌──────────────────────────┐
 *  │  Fixed <Canvas> (z:0)    │  ← 3D background
 *  │  ┌──────────────────┐    │
 *  │  │ Scrollable HTML   │   │  ← z:1, on top of canvas
 *  │  │ {children}        │   │
 *  │  └──────────────────┘    │
 *  └──────────────────────────┘
 */
export default function Layout({ children }) {
  return (
    <SmoothScroll>
      {/* Fixed 3D Background */}
      <div className="canvas-container">
        <Scene />
      </div>

      {/* Scrollable HTML Content */}
      <div className="scroll-content">
        {children}
      </div>
    </SmoothScroll>
  );
}
