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
              src="/logo1.PNG"
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

            {/* Course Highlight Badge */}
            <div 
              className={`relative group inline-flex finale-fade-in delay-3 ${isVisible ? "visible" : ""}`}
              style={{ marginTop: '2rem', marginBottom: '0' }}
            >
              {/* Subtle glow behind */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-xl group-hover:opacity-75 transition duration-1000 opacity-50" style={{ borderRadius: '2.5rem' }}></div>
              
              {/* Main Container - Elegant Glass */}
              <div 
                className="relative flex flex-col md:flex-row items-center bg-white/[0.02] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-colors duration-500"
                style={{ 
                  padding: '1.25rem 2rem', 
                  gap: '1.5rem', 
                  borderRadius: '2.5rem' 
                }}
              >
                
                {/* Left Side */}
                <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left">
                  <span 
                    className="uppercase text-[#a78bfa] font-semibold mb-2 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]" 
                    style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', letterSpacing: '0.3em' }}
                  >
                    Register Now
                  </span>
                  
                  <div className="flex items-center" style={{ gap: '0.75rem' }}>
                    <span className="text-xl text-white/60 font-medium" style={{ fontFamily: 'var(--font-mono, monospace)' }}>INR:</span>
                    <span className="font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '3rem', lineHeight: '1' }}>
                      20,000
                    </span>
                  </div>
                  
                  <span className="mt-3 flex items-center justify-center md:justify-start text-white/50 uppercase font-mono" style={{ gap: '0.5rem', fontSize: '10px', letterSpacing: '0.15em' }}>
                    <span className="bg-white/20 hidden md:block" style={{ width: '1rem', height: '1px' }}></span>
                    AI Filmmaking Masterclass
                  </span>
                </div>

                {/* Separator (Hide on mobile) */}
                <div className="hidden md:block bg-gradient-to-b from-transparent via-white/15 to-transparent" style={{ width: '1px', height: '5rem' }}></div>

                {/* Right Side */}
                <div className="flex flex-col justify-center items-center">
                  <button className="flex items-center border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]" style={{ gap: '0.75rem', padding: '0.875rem 2.5rem', borderRadius: '9999px' }}>
                    <span className="rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse" style={{ width: '6px', height: '6px' }}></span>
                    <span className="text-white font-medium tracking-wide" style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '15px' }}>
                      Register
                    </span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Navbar with liquid glass effect and scroll tracking */}
        <div
          id="nav-tracker"
          className={`w-full flex justify-center finale-fade-in delay-3 ${isVisible ? "visible" : ""}`}
          style={{ minHeight: "50px", marginTop: "2rem" }}
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
    </>
  );
}
