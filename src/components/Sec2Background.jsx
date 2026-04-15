"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

gsap.registerPlugin(ScrollTrigger);

export default function Sec2Background() {
  const bgRef = useRef(null);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const heroEl = document.getElementById("hero");
      const finaleEl = document.getElementById("finale");
      if (!heroEl || !finaleEl || !bgRef.current) return;

      const triggers = [];
      let heroP = 0;
      let finaleP = 0;

      const updateOpacity = () => {
        if (!bgRef.current) return;
        const baseOpacity = heroP < 0.7 ? 0 : ((heroP - 0.7) / 0.3) * 0.5;
        // Fade out perfectly during the first two-thirds of the finale section
        const targetOpacity = baseOpacity * Math.max(0, 1 - finaleP * 1.5);
        bgRef.current.style.opacity = targetOpacity;
      };

      triggers.push(ScrollTrigger.create({
        trigger: heroEl,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          heroP = self.progress;
          updateOpacity();
        },
      }));

      triggers.push(ScrollTrigger.create({
        trigger: finaleEl,
        start: "top bottom", // Starts as soon as finale enters the screen
        end: "bottom bottom",
        onUpdate: (self) => {
          finaleP = self.progress;
          updateOpacity();
        },
      }));

      bgRef.current.__st = triggers;
    });
    
    return () => {
      cancelAnimationFrame(rafId);
      bgRef.current?.__st?.forEach(t => t.kill?.());
    };
  }, []);

  return (
    <div
      ref={bgRef}
      className="pointer-events-none select-none"
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "url('/sec2_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        mixBlendMode: "screen", // Prevents the overlay from aggressively washing out the 3D bright objects
        opacity: 0, // start hidden
        zIndex: 0
      }}
    />
  );
}
