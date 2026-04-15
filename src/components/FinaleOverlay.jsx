"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useIsMobile from "@/hooks/useMobile";

gsap.registerPlugin(ScrollTrigger);



/**
 * FinaleOverlay — HTML overlay for the ending section.
 *
 * Renders:
 *  1. A small logo with glow
 *  2. "Start a Project" CTA button
 *  3. Bottom nav bar (desktop) / hamburger menu (mobile)
 *
 * All elements fade in once the #finale section enters the viewport.
 */
export default function FinaleOverlay() {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const finaleEl = document.getElementById("finale");
      if (!finaleEl) return;

      const trigger = ScrollTrigger.create({
        trigger: finaleEl,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const shouldBeVisible = self.progress >= 0.7;
          if (shouldBeVisible !== isVisibleRef.current) {
            isVisibleRef.current = shouldBeVisible;
            setIsVisible(shouldBeVisible);
          }
        },
      });

      triggerRef.current = trigger;
    });

    return () => {
      cancelAnimationFrame(rafId);
      triggerRef.current?.kill?.();
    };
  }, []);

  return (
    <>
      {/* ── Sticky centre content (logo + CTA) ── */}
      <div className="finale-overlay">
        {/* Logo */}
        <img
          src="/logo.svg"
          alt="Kanavu"
          className={`finale-logo finale-fade-in-down delay-1 ${isVisible ? "visible" : ""}`}
        />

        {/* Text Area */}
        <div className={`finale-text finale-fade-in delay-2 ${isVisible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: "600", color: "#ffffff", paddingBottom: "1.0rem" }}>
            Bringing stories to life
          </h2>
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "rgba(255,255,255,0.75)", fontWeight: "300", letterSpacing: "0.04em" }}>
            Kerala's First ai-powered advertising agency.
          </p>
        </div>

        {/* CTA */}
        <a
          href="#"
          className={`finale-cta finale-fade-in delay-3 ${isVisible ? "visible" : ""}`}
        >
          Start a Project
          <span className="finale-cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </>
  );
}
