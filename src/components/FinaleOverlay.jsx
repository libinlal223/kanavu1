"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useIsMobile from "@/hooks/useMobile";

gsap.registerPlugin(ScrollTrigger);

const WebGLShader = dynamic(() => import("./WebGLShader"), { ssr: false });

/**
 * FinaleOverlay — HTML overlay for the ending section.
 *
 * Renders:
 *  1. Full-screen WebGL shader background (animated light-wave)
 *  2. Double-border framed hero card with logo, heading, tagline, CTA
 *  3. All elements fade in once the #finale section enters the viewport
 */
export default function FinaleOverlay() {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [fadeProgress, setFadeProgress] = useState(0);
  const isVisibleRef = useRef(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    // GSAP Animation for #finale section
    const rafId = requestAnimationFrame(() => {
      const finaleEl = document.getElementById("finale");
      if (!finaleEl) return;

      const trigger = ScrollTrigger.create({
        trigger: finaleEl,
        // Start processing as soon as the finale section enters the screen
        start: "top bottom",
        end: "bottom bottom",
        onUpdate: (self) => {
          // Fade progress builds up over the entire finale scroll
          setFadeProgress(self.progress);

          // Trigger the text/logo pop-in at an appropriate point
          const shouldBeVisible = self.progress >= 0.75;
          if (shouldBeVisible !== isVisibleRef.current) {
            isVisibleRef.current = shouldBeVisible;
            setIsVisible(shouldBeVisible);
          }
        },
      });

      triggerRef.current = trigger;
    });

    // Sticky navbar tracker
    const handleScroll = () => {
      const tracker = document.getElementById("nav-tracker");
      const nav = document.getElementById("main-nav");
      if (!tracker || !nav) return;

      const rect = tracker.getBoundingClientRect();
      // When the tracker reaches 24px from top of viewport, snap the navbar
      if (rect.top <= 24) {
        nav.classList.add("nav-fixed-top");
      } else {
        nav.classList.remove("nav-fixed-top");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // GSAP Animation to fade out text when scrolling into About Us
    const textContentEl = document.getElementById("finale-text-content");
    const aboutUsEl = document.getElementById("about-us");
    let fadeOutTrigger;
    if (textContentEl && aboutUsEl) {
      fadeOutTrigger = ScrollTrigger.create({
        trigger: aboutUsEl,
        start: "top bottom", // when the top of about-us hits bottom of viewport
        end: "top center",   // fully faded out when about-us reaches center
        scrub: true,
        animation: gsap.to(textContentEl, { opacity: 0, ease: "none" }),
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      triggerRef.current?.kill?.();
      fadeOutTrigger?.kill?.();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Compute the overall container opacity — only start after tunnel is fully behind (0.65+)
  const containerOpacity = Math.min(1, Math.max(0, (fadeProgress - 0.65) * 4));

  return (
    <>
      {/* ── Full-screen WebGL shader background ── */}
      <div
        className="finale-shader-bg"
        style={{ opacity: containerOpacity }}
      >
        <WebGLShader />
      </div>

      {/* ── Sticky centre content (framed hero card) ── */}
      <div className="finale-overlay w-full">
        <div
          className={`finale-hero-wrapper flex flex-col items-center justify-center text-center w-full ${isVisible ? "visible" : ""}`}
        >
          {/* Wrap text content to fade it out separately from the navbar */}
          <div id="finale-text-content" className="flex flex-col items-center justify-center w-full">
            {/* Logo */}
            <img
              src="/logo1.png"
              alt="Kanavu"
              className={`finale-logo finale-fade-in-down delay-1 ${isVisible ? "visible" : ""}`}
            />

            {/* Heading */}
            <h2
              className={`finale-heading finale-fade-in delay-2 ${isVisible ? "visible" : ""}`}
            >
              Bringing stories to life
            </h2>

            {/* Tagline */}
            <p
              className={`finale-tagline finale-fade-in delay-2 ${isVisible ? "visible" : ""}`}
            >
              Kerala&apos;s First AI-powered advertising agency.
            </p>

            {/* Status indicator */}
            <div
              className={`finale-status finale-fade-in delay-3 ${isVisible ? "visible" : ""}`}
            >
              <span className="finale-status-dot-wrapper">
                <span className="finale-status-dot-ping" />
                <span className="finale-status-dot" />
              </span>
              <p className="finale-status-text">Available for New Projects</p>
            </div>
          </div>

          {/* Navbar with liquid glass effect and scroll tracking */}
          <div
            id="nav-tracker"
            className={`w-full flex justify-center finale-fade-in delay-3 ${isVisible ? "visible" : ""}`}
            style={{ minHeight: "50px" }}
          >
            <nav
              id="main-nav"
              className="finale-navbar-glass"
            >
              <span className="finale-navbar-glass-bg" />
              <div className="finale-navbar-links">
                <a href="#services" className="finale-navbar-link">Services</a>
                <a href="#work" className="finale-navbar-link">Work</a>
                <a href="#about-us" className="finale-navbar-link">About</a>
                <a href="#team" className="finale-navbar-link">Team</a>
                <a href="#contact" className="finale-navbar-link">Contact</a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
