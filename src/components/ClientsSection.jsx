"use client";

import React, { useRef, useState, useEffect } from 'react';

const projects = [
  {
    image: '/gallery/1.png',
    title: 'Cinematic Brand Film',
    description: 'Crafting immersive brand narratives through AI-powered cinematic storytelling...',
  },
  {
    image: '/gallery/2.png',
    title: 'AI Product Campaign',
    description: 'Revolutionizing product launches with generative AI visuals and motion design...',
  },
  {
    image: '/gallery/3.png',
    title: 'Digital Art Direction',
    description: 'Blending traditional art direction with cutting-edge AI tools for visual excellence...',
  },
  {
    image: '/gallery/4.png',
    title: 'Motion Design Series',
    description: 'Creating fluid, dynamic motion graphics that captivate and convert audiences...',
  },
  {
    image: '/gallery/5.png',
    title: 'Visual Identity System',
    description: 'Building cohesive brand identities through AI-assisted design exploration...',
  },
  {
    image: '/gallery/6.png',
    title: 'Interactive Experience',
    description: 'Designing immersive web experiences that push the boundaries of storytelling...',
  },
];

const ClientsSection = () => {
  // Duplicate projects array for seamless infinite scrolling
  const duplicatedProjects = [...projects, ...projects];

  return (
    <section
      id="projects"
      className="relative z-10 w-full overflow-hidden"
      style={{ background: "var(--background)", paddingTop: '120px', paddingBottom: '250px' }}
    >
      <div className="w-full max-w-[78rem] mx-auto px-6 md:px-12 lg:px-16">

        {/* ── Header Row ── */}
        <div className="flex flex-col mb-16" style={{ transform: 'translateX(20px)' }}>
          <h2 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-none mb-4">
            Trusted by Leading Brands
          </h2>
          <br></br> <p className="text-[#A1A1AA] text-[13px] md:text-[14px] leading-relaxed max-w-md font-light tracking-wide" style={{ fontFamily: '"Elms Sans", sans-serif' }}>
            Discover how leading brands use AI-powered storytelling and video production to create impactful digital experiences and high-performing campaigns.
          </p>
          <br></br>
        </div>

      </div>

      {/* ── Auto-Scrolling Cards ── */}
      <div className="relative w-full flex">
        {/* Fading Edges for depth */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#05000a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#05000a] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-infinite-scroll hover:[animation-play-state:paused]">
          {duplicatedProjects.map((project, idx) => (
            <div
              key={idx}
              className="project-card flex-shrink-0 w-[200px] sm:w-[220px] md:w-[260px] rounded-2xl overflow-hidden relative group cursor-pointer"
            >
              {/* Card Image */}
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Subtle dark gradient at the bottom so white text is readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />
                
                {/* "Click to watch" Text in bottom-left */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2 pointer-events-none transition-transform duration-500 group-hover:translate-x-2">
                  <span className="text-white text-[11px] md:text-[12px] font-medium tracking-widest uppercase drop-shadow-md" style={{ fontFamily: '"Elms Sans", sans-serif' }}>
                    Click to watch
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-md">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default ClientsSection;
