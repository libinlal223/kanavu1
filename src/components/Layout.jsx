"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "./SmoothScroll";

const Scene = dynamic(() => import("./Scene"), { ssr: false });



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
