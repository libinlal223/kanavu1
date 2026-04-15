import Layout from "@/components/Layout";
import FinaleOverlay from "@/components/FinaleOverlay";
import Sec2Background from "@/components/Sec2Background";

export default function Home() {
  return (
    <Layout>
      <Sec2Background />
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

      </section>

      {/* ── Section 4: Finale ──
          150vh gives the camera enough scroll runway to decelerate.
          Camera slows down, tilts upward into open nebula sky.
          Logo reappears at elegant scale, CTA + nav bar fade in. */}
      <section
        id="finale"
        style={{ minHeight: "150vh", position: "relative" }}
      >
        <FinaleOverlay />
      </section>
    </Layout>
  );
}
