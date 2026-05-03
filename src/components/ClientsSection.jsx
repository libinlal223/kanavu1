"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const collaborations = [
  {
    id: 1,
    brand: "MERZ AESTHETICS",
    subtitle: "XPERIENCE+ 2.0",
    title: "Reinvented Patient Loyalty Program",
    description: "Our team had the opportunity to contribute to Knight Riders by animating a key segment of the film. Following our experience at Perumal, Aadu 3, this project marks our first credited work to reach theatres.",
    image: "/collabrations/1st.jpg",
    color: "#0d112d"
  },
  {
    id: 2,
    brand: "L'ORÉAL PARIS",
    subtitle: "VIRTUAL TRY-ON",
    title: "AI-Powered Beauty Experience",
    description: "Revolutionizing how customers discover products with hyper-realistic AI visualization.",
    image: "/collab/1.png", // Reuse for demo
    color: "#1a0b0b"
  },
  {
    id: 3,
    brand: "PORSCHE",
    subtitle: "DRIVING EMOTION",
    title: "Interactive Brand Narrative",
    description: "Crafting immersive digital stories that capture the essence of performance and luxury.",
    image: "/collab/1.png",
    color: "#0f0f0f"
  },
  {
    id: 4,
    brand: "SAMSUNG",
    subtitle: "GALAXY AI",
    title: "The Future of Connectivity",
    description: "Showcasing the power of integrated AI in the palm of your hand.",
    image: "/collab/1.png",
    color: "#0b1a2e"
  }
];

const ClientsSection = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Zoom progress: 0 to 0.3 (zoom), then reveal heading and cards
  const scale = useTransform(scrollYProgress, [0, 0.05, 0.3], [1, 1, 150]);

  // Opacity for the kanavukadha heading
  const textOpacity = useTransform(scrollYProgress, [0.25, 0.3], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative z-10 w-full"
      style={{ background: "var(--background)", height: "900vh" }}
    >
      {/* ── Sticky Animation Layer ── */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none select-none">

        {/* Massive Zooming Heading Wrapper */}
        <motion.div
          className="inline-flex items-center justify-center"
          style={{
            scale,
            transformOrigin: '77.5% 65%',
            opacity: textOpacity
          }}
        >
          <h2
            className="whitespace-nowrap leading-none font-black tracking-tighter"
            style={{
              fontSize: 'clamp(100px, 15vw, 300px)',
              fontFamily: '"Inter", "Elms Sans", sans-serif',
              textTransform: 'lowercase',
              color: '#bc3ad6',
              transform: 'scaleY(1.3)'
            }}
          >
            kanavukadha
          </h2>
        </motion.div>

      </div>

      {/* ── Collaborations Cards Layer ── */}
      <div
        className="relative z-20 w-full flex flex-col gap-[20vh]"
        style={{ marginTop: '150vh', paddingBottom: '20vh' }}
      >
        {/* Collaborations Heading - Scrolls up naturally into the black void */}
        <div className="w-full flex justify-center items-center pt-32 pb-16">
          <h3 className="text-white text-5xl md:text-7xl font-montserrat font-medium tracking-tight drop-shadow-md" style={{ color: '#ffffff' }}>
            Collaborations
          </h3>
        </div>
        {collaborations.map((collab, index) => (
          <div
            key={collab.id}
            className={`w-full max-w-[95rem] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Description Side (Left or Right) */}
            <div className="w-full md:w-[25%] flex flex-col justify-center">
              <p className="text-white text-2xl md:text-3xl font-light leading-snug tracking-tight opacity-90" style={{ fontFamily: 'var(--font-sans, sans-serif)' }}>
                {collab.description}
              </p>
            </div>

            {/* Card Center */}
            <div
              className="w-full max-w-[550px] aspect-[4/5.5] rounded-[3rem] p-10 md:p-12 flex flex-col justify-end relative shadow-2xl transition-transform duration-700 hover:scale-[1.02] overflow-hidden"
              style={{ background: `linear-gradient(145deg, ${collab.color} 0%, #050505 100%)` }}
            >
              {/* Full-bleed Background Image */}
              <div className="absolute inset-0 w-full h-full z-0">
                <img
                  src={collab.image}
                  alt={collab.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40"></div>
              </div>

              {/* Card Bottom: Info */}
              <div className="relative z-10 shrink-0 pb-2 pl-4 md:pl-6">
                <h4 className="text-white text-3xl md:text-4xl font-medium leading-tight tracking-tight drop-shadow-lg">{collab.title}</h4>
              </div>

              {/* Subtle glass overlay highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30 pointer-events-none z-20" />
            </div>

            {/* Empty space on the other side to keep card perfectly centered in the layout if desired, 
                or just let the flex box handle it. 
                Using w-[25%] for both sides ensures perfect centering on desktop. */}
            <div className="hidden md:block w-[25%]"></div>
          </div>
        ))}
      </div>



    </section>
  );
};

export default ClientsSection;
