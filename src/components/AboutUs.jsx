"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const sectionRef = useRef(null);
  const textRefs = useRef([]);


  const headingOffsetX = -22; // Nudge the "About Us" heading
  const textOffsetX = 12;     // Nudge the paragraph block

  // Change this to perfectly control where the text wraps (e.g. '650px', '700px', '45rem')
  const textMaxWidth = "680px";

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Animate the 'About Us' title
    const titleEl = el.querySelector("h2");
    if (titleEl) {
      gsap.fromTo(
        titleEl,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleEl,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Fade up each paragraph sequentially as you scroll
    textRefs.current.filter(Boolean).forEach((textEl, index) => {
      gsap.fromTo(
        textEl,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleEl || textEl, // Use title as trigger so they animate together
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // --- Pixel adjustments for easy positioning ---
    // Positive values move the element to the RIGHT. Negative values move to the LEFT.
    const headingOffsetX = -20; // Nudge the "About Us" heading
    const textOffsetX = 15;     // Nudge the paragraph block

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="about-us"
      ref={sectionRef}
      className="relative z-10 min-h-screen bg-transparent text-white px-6 md:px-12 lg:px-20 py-40 flex items-center"
    >
      <div className="max-w-[95rem] w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 lg:gap-12 items-start">
        {/* Left Column: Huge Title */}
        <div
          className="md:col-span-4 lg:col-span-4 lg:col-start-2 pt-2 font-montserrat transition-transform duration-300"
          style={{ transform: `translateX(${headingOffsetX}px)` }}
        >
          <h2 className="text-6xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight text-white drop-shadow-md leading-none lg:-mt-2">
            About Us
          </h2>
        </div>

        {/* Right Column: Paragraphs */}
        <div
          className="md:col-span-8 lg:col-span-6 lg:col-start-7 space-y-6 text-left font-league-spartan text-base md:text-lg text-gray-300 leading-relaxed pr-6 lg:pr-0 pt-2 transition-transform duration-300"
          style={{ transform: `translateX(${textOffsetX}px)`, maxWidth: textMaxWidth }}
        ><br></br>
          <p ref={(el) => (textRefs.current[0] = el)} className="drop-shadow-md">
            We are Kanavu Kadha — Kerala’s first AI-powered advertising agency, specializing in AI video production, AI content creation, and cinematic brand storytelling in India.
            Our team of AI artists and creators brings ideas to life using advanced AI tools and creative innovation.
          </p>
          <p ref={(el) => (textRefs.current[1] = el)} className="drop-shadow-md">
            As a leading AI marketing agency in Kerala, we create high-impact AI-generated ads, brand films, and social media content. By blending cinematic storytelling with AI technology, we craft narratives that are visually powerful, emotionally engaging, and results-driven.
          </p>
          <p ref={(el) => (textRefs.current[2] = el)} className="drop-shadow-md">
            Every brand has a story. We use AI-powered storytelling to transform brands into unforgettable visual experiences that resonate with modern audiences.
          </p>

        </div>
      </div>

      {/* Gradient fade-out: makes the ribbon appear to scroll away naturally */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none z-20"
        style={{
          height: "40vh",
          background: "linear-gradient(to bottom, transparent 0%, var(--background) 100%)",
        }}
      />
    </section>
  );
}
