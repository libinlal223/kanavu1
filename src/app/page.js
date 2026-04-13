import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      {/* ── Section 1: Hero / Fly-through trigger ──
          This section's 100vh height drives the ScrollTrigger animation.
          The 3D logo + starfield are the focus; HTML is kept minimal. */}
      <section
        id="hero"
        className="relative flex flex-col items-center justify-end min-h-screen px-6 pb-16"
      >
        <div className="text-center pointer-events-none select-none">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-400/50 font-mono mb-4">
            Scroll to enter
          </p>
          <div className="animate-bounce text-violet-400/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Section 2: Infinite Nebula ──
          200vh drives the ScrollTrigger that moves the camera through
          the nebula cloud field. Minimal overlay so 3D is the focus. */}
      <section
        id="nebula"
        className="nebula-section"
        style={{ minHeight: "200vh", position: "relative" }}
      >
        {/* Entry text — visible at the start of the nebula scroll */}
        <div
          className="flex flex-col items-center justify-center pointer-events-none select-none"
          style={{ height: "100vh", position: "sticky", top: 0 }}
        >
          <p className="nebula-subtitle mb-4">Entering</p>
          <h2 className="nebula-title">Infinite Nebula</h2>
          <p className="mt-6 text-violet-300/40 text-sm tracking-widest font-mono">
            Keep scrolling to fly through
          </p>
        </div>
      </section>

      {/* ── Section 3 ── */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Three.js + R3F
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            A full Three.js scene rendering behind your DOM, driven by
            @react-three/fiber and @react-three/drei for declarative 3D.
          </p>
        </div>
      </section>

      {/* ── Section 4 ── */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            GSAP Animations
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            GSAP ScrollTrigger is synced with Lenis, giving you a single
            animation timeline that responds to smooth scrolling.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 text-center text-neutral-600 text-sm border-t border-neutral-800">
        Built with Next.js · Three.js · GSAP · Lenis
      </footer>
    </Layout>
  );
}
