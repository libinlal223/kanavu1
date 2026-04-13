"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

gsap.registerPlugin(ScrollTrigger);

/**
 * NebulaMobileFallback — pure-CSS animated nebula haze.
 * Replaces 3D clouds on mobile to save GPU.
 * Uses layered radial gradients with animated drift.
 * Fades in only at the end of Section 1 (hero zoom).
 */
export default function NebulaMobileFallback() {
  const bgRef = useRef(null);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const heroEl = document.getElementById("hero");
      if (!heroEl || !bgRef.current) return;

      const trigger = ScrollTrigger.create({
        trigger: heroEl,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          // Fade in during the last 30% of the logo zoom
          const p = self.progress;
          const targetOpacity = p < 0.7 ? 0 : (p - 0.7) / 0.3;
          bgRef.current.style.opacity = targetOpacity;
        },
      });

      bgRef.current.__st = trigger;
    });
    
    return () => {
      cancelAnimationFrame(rafId);
      bgRef.current?.__st?.kill?.();
    };
  }, []);

  return (
    <div
      ref={bgRef}
      className="nebula-mobile-bg"
      aria-hidden="true"
      style={{ opacity: 0 }}
    />
  );
}
