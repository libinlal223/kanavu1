import React from 'react';

const Footer = () => {
  return (
    <footer
      className="relative z-10 w-full pt-48 pb-6 overflow-hidden flex flex-col bg-black"
    >
      <div className="w-full max-w-[90rem] mx-auto px-6 md:px-12 lg:px-24 xl:px-32 flex-1 flex flex-col justify-between">

        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20 text-[11px] md:text-[12px] uppercase font-medium tracking-widest text-white/70" style={{ fontFamily: '"Elms Sans", sans-serif' }}>

          {/* Column 1: Address */}
          <div className="lg:col-span-3 flex flex-col gap-6" style={{ transform: 'translateX(40px)' }}>
            <h4 className="text-white font-bold tracking-[0.2em]">KANAVU KADHA</h4>
            <div className="flex flex-col gap-1 leading-relaxed">
              <p>ERNAKULAM, KERALA</p>
              <p className="flex items-center gap-2">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                682011, KOCHI
              </p>
              <p>INDIA</p>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <h4 className="text-white font-bold tracking-[0.2em]">NAVIGATION</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
              <div className="flex flex-col gap-1">
                <a href="#" className="hover:text-white transition-colors">HOME</a>
                <a href="#" className="hover:text-white transition-colors">ABOUT US</a>
                <a href="#" className="hover:text-white transition-colors">PROJECTS</a>
              </div>
              <div className="flex flex-col gap-1">
                <a href="#" className="hover:text-white transition-colors">INNOVATIONS</a>
                <a href="#" className="hover:text-white transition-colors">SERVICES</a>
                <a href="#" className="hover:text-white transition-colors">SHOWROOM</a>
              </div>
              <div className="flex flex-col gap-1">
                <a href="#" className="hover:text-white transition-colors">COMPANY</a>
                <a href="#" className="hover:text-white transition-colors">DOWNLOAD</a>
                <a href="#" className="hover:text-white transition-colors">CONTACT</a>
              </div>
              <div className="flex flex-col gap-1">
                <a href="#" className="hover:text-white transition-colors">NEWS</a>
                <a href="#" className="hover:text-white transition-colors">FAQ</a>
                <a href="#" className="hover:text-white transition-colors">AGENCY GROUP</a>
              </div>
            </div>
          </div>

          {/* Column 3: Follow */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h4 className="text-white font-bold tracking-[0.2em]">FOLLOW</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex flex-col gap-1">
                <a href="#" className="hover:text-white transition-colors">FACEBOOK</a>
                <a href="#" className="hover:text-white transition-colors">INSTAGRAM</a>
                <a href="#" className="hover:text-white transition-colors">YOUTUBE</a>
              </div>
              <div className="flex flex-col gap-1">
                <a href="#" className="hover:text-white transition-colors">PINTEREST</a>
                <a href="#" className="hover:text-white transition-colors">LINKEDIN</a>
              </div>
            </div>
          </div>

        </div>

        {/* Massive Logotype */}
        <div className="w-full flex items-center justify-center mb-8 overflow-hidden pointer-events-none select-none">
          <h1 className="text-[12vw] md:text-[15vw] leading-none font-bold tracking-tighter text-[#1a1a1a]" style={{ fontFamily: '"Inter", "Elms Sans", sans-serif', textTransform: 'lowercase', color: '#1f1f1f' }}>
            kanavukadha
          </h1>
        </div>

        {/* Bottom Pill/Bar */}
        <div className="w-full border border-white/20 rounded-full px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] md:text-[11px] uppercase tracking-widest text-white/60" style={{ fontFamily: '"Elms Sans", sans-serif' }}>
          <div className="flex items-center gap-4">
            <span className="text-white font-bold">©2025 KANAVU KADHA</span>
            <span className="hidden md:inline-block">AGENCY REG 01411010356 — CAP SOC € 27.253.397,00 I.V.</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="#" className="hover:text-white transition-colors">LEGAL</a>
            <span>—</span>
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
            <span>—</span>
            <a href="#" className="hover:text-white transition-colors">COOKIES</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
