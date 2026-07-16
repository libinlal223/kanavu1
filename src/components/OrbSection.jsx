"use client";

import React, { useEffect, useState } from 'react';
import Orb from './Orb';

const OrbSection = () => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = document.getElementById("services");
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0,
        rootMargin: "150px 0px 150px 0px", // Pre-load slightly before scrolling into view
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="services"
      className="relative z-10 w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div className="absolute inset-0 z-0 opacity-40">
        {isInView && (
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={280} // Violet/Purple hue to match the theme
            forceHoverState={false}
          />
        )}
      </div>

      <div className="relative z-10 text-center px-6">
        <h2 className="text-5xl md:text-7xl font-medium text-white mb-8 tracking-tight font-montserrat">
          The Future of Storytelling
        </h2>
      </div>
    </section>
  );
};

export default OrbSection;
