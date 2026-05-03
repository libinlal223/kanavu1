"use client";

import React from 'react';

const ContactSection = () => {
  return (
    <>
      <section id="contact" className="relative z-10 w-full pt-48 pb-32 px-6 md:px-12 lg:px-24 overflow-hidden bg-black">

        {/* ── Cinematic Background Glows ── */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 w-[800px] h-[800px] bg-[#bc3ad6]/10 rounded-full blur-[200px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

        <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-16 relative z-10">

          {/* ── Left Side: Contact Info ── */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="text-white text-6xl md:text-[5.5rem] font-montserrat font-medium tracking-tight mb-8 leading-none">
                Let's create <br className="hidden lg:block" /> the extraordinary.
              </h2>
              <p className="text-[#A1A1AA] text-lg md:text-xl font-light max-w-md leading-relaxed mt-12" style={{ fontFamily: 'var(--font-sans, sans-serif)' }}>
                Whether you have a clear vision or need a creative partner to discover it, we're ready to build something remarkable together.
              </p>
            </div>

            <div className="mt-24 space-y-12">


            </div>
          </div>

          {/* ── Right Side: Contact Form ── */}
          <div className="lg:col-span-7 flex flex-col justify-center lg:pl-16">
            <div className="w-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl relative group/card">

              {/* Subtle highlight effect on card */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] to-transparent opacity-50 pointer-events-none rounded-[3rem]"></div>

              <form className="relative z-10 w-full flex flex-col gap-12" onSubmit={(e) => e.preventDefault()}>

              <div className="flex flex-col gap-3 group">
                <label className="text-[10px] text-[#A1A1AA] tracking-[0.25em] font-bold uppercase transition-colors group-focus-within:text-[#bc3ad6]">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full bg-transparent border-b border-white/10 pb-4 text-white text-xl placeholder-white/20 focus:outline-none focus:border-[#bc3ad6] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-3 group">
                <label className="text-[10px] text-[#A1A1AA] tracking-[0.25em] font-bold uppercase transition-colors group-focus-within:text-[#bc3ad6]">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent border-b border-white/10 pb-4 text-white text-xl placeholder-white/20 focus:outline-none focus:border-[#bc3ad6] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-3 group">
                <label className="text-[10px] text-[#A1A1AA] tracking-[0.25em] font-bold uppercase transition-colors group-focus-within:text-[#bc3ad6]">How can we help?</label>
                <textarea
                  rows="3"
                  placeholder="Tell us about your project..."
                  className="w-full bg-transparent border-b border-white/10 pb-4 text-white text-xl placeholder-white/20 focus:outline-none focus:border-[#bc3ad6] transition-colors resize-none"
                ></textarea>
              </div>

              <button type="submit" className="self-start bg-white text-black px-12 py-5 rounded-full flex items-center gap-4 group transition-all hover:bg-[#bc3ad6] hover:text-white mt-8 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(188,58,214,0.4)]">
                <span className="text-[11px] font-bold uppercase tracking-widest">Send Message</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

            </form>
          </div>
        </div>

      </div>
    </section>
    {/* Physical Spacer Gap between Contact Section and Footer */}
    <div className="relative z-10 w-full h-[100px] bg-black"></div>
    </>
  );
};

export default ContactSection;
