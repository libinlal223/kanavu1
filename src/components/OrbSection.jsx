import Orb from './Orb';

const OrbSection = () => {
  return (
    <section
      id="orb-section"
      className="relative z-10 w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div className="absolute inset-0 z-0 opacity-40">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={280} // Violet/Purple hue to match the theme
          forceHoverState={false}
        />
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
