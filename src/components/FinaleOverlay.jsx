"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useIsMobile from "@/hooks/useMobile";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Film & TV", href: "#" },
  { label: "Advertising", href: "#" },
  { label: "Virtual Production", href: "#" },
];

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
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const finaleEl = document.getElementById("finale");
      if (!finaleEl) return;

      const trigger = ScrollTrigger.create({
        trigger: finaleEl,
        start: "top 60%",
        end: "bottom bottom",
        onEnter: () => setIsVisible(true),
        onLeaveBack: () => {
          setIsVisible(false);
          setMenuOpen(false);
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
          className={`finale-logo finale-fade-in delay-1 ${isVisible ? "visible" : ""}`}
        />

        {/* CTA */}
        <a
          href="#"
          className={`finale-cta finale-fade-in delay-2 ${isVisible ? "visible" : ""}`}
        >
          Start a Project
          <span className="finale-cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>

      {/* ── Desktop Bottom Nav ── */}
      <nav className={`finale-nav ${isVisible ? "visible" : ""}`}>
        {NAV_LINKS.map((link, i) => (
          <span key={link.label} style={{ display: "contents" }}>
            {i > 0 && <span className="finale-nav-sep" />}
            <a href={link.href} className="finale-nav-item">
              {link.label}
            </a>
          </span>
        ))}
      </nav>

      {/* ── Mobile Hamburger ── */}
      <button
        className={`finale-hamburger ${isVisible ? "visible" : ""} ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menu"
      >
        <div className="finale-hamburger-icon">
          <span />
          <span />
          <span />
        </div>
      </button>

      {/* ── Mobile Slide-up Menu ── */}
      <div className={`finale-mobile-menu ${menuOpen ? "open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="finale-mobile-menu-item"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
