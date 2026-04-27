import React from 'react';

const OurTeam = () => {
  return (
    <section id="our-team" className="relative z-10 w-full py-24 md:py-32" style={{ background: "var(--background)", paddingTop: 'calc(6rem + 30px)' }}>
      {/* Reduced max-width to keep elements beautifully centered instead of pushed to the edges */}
      <div className="w-full max-w-[78rem] mx-auto px-6 md:px-12 lg:px-16">

        {/* Gap: 200px between heading and content. Change the value below to adjust! */}
        <div className="font-montserrat" style={{ marginBottom: '100px', transform: 'translateX(20px)' }}>
          <h2 className="text-6xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight text-white drop-shadow-md leading-none lg:-mt-2">
            Our Team
          </h2>
        </div>

        {/* 3-column layout matching the original image's exact proportions */}
        {/* NOTE: Moved the entire block 20 pixels to the right. Change '20px' below to adjust! */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start" style={{ transform: 'translateX(60px)' }}>
          {/* Column 1: Image (25%) */}
          <div className="md:col-span-4 lg:col-span-3">
            {/* Reduced from w-full to w-[85%] to shrink the image size. Change 85% to adjust! */}
            <div className="w-[85%] aspect-[4/5] bg-[#1a1a1a]">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop"
                alt="Akhil"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>

          {/* Column 2: Name & Title (25%) — pulled 40px closer to image */}
          <div className="md:col-span-4 lg:col-span-3 lg:pt-1" style={{ transform: 'translateX(-40px)' }}>
            <h3 className="text-4xl lg:text-[42px] font-medium text-white mb-2 tracking-tight leading-none">
              Akhil
            </h3>
            <p className="text-[14px] text-[#A1A1AA] mb-6 flex items-center gap-2 font-light tracking-wide">
              Founder & Creative Director
              <svg className="w-3.5 h-3.5 text-[#A1A1AA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-[#A1A1AA]">
              <a href="#" className="hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.208-2.44-2.208-1.492 0-2.339.747-2.525 2.208zm-16.04 6h7.115c2.731 0 4.353-1.002 4.353-3.606 0-1.69-1.041-2.73-2.126-3.045 1.145-.304 2.126-1.535 2.126-3.125 0-2.56-1.928-3.224-4.225-3.224h-7.243v13zm4-7h2.54c1.378 0 2.355.656 2.355 1.849 0 1.205-1.053 1.85-2.269 1.85h-2.626v-3.699zm0-4.6h2.246c1.173 0 2.03.655 2.03 1.621 0 1.01-.84 1.579-1.921 1.579h-2.355v-3.2z" /></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
              </a>
            </div>
          </div>

          {/* Column 3: Bio Text (50%) */}
          <div className="md:col-span-4 lg:col-span-6 lg:pt-1">
            <div className="space-y-6 text-[14.5px] leading-relaxed text-[#D4D4D8] font-normal tracking-wide" style={{ fontFamily: '"Elms Sans", sans-serif' }}>
              <p>
                Akhil is the founder of Kanavu Kadha, Kerala’s first AI-powered advertising agency specializing in AI video production, AI-generated ads, and cinematic brand storytelling in India.
              </p>
              <p>
                By blending the storytelling tradition of Indian cinema with advanced AI technology, he has led the creation of one of India’s first story-driven AI advertisements.
              </p>
              <p>
                As a creative leader in AI marketing and content creation, Akhil focuses on transforming brands into powerful visual narratives. His vision is simple — every brand has a soul, and through AI-powered storytelling and cinematic creativity, Kanavu Kadha brings that soul to the screen.
              </p>
            </div>
          </div>

        </div>

        {/* ── Team Members Grid (4 in one row) ── */}
        <div className="flex justify-center w-full" style={{ marginTop: '150px', transform: 'translateX(60px)' }}>
          <div className="flex flex-wrap justify-center gap-x-12 lg:gap-x-20 gap-y-16 w-full px-4">

            {/* Employee 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-[160px] aspect-[4/5] mb-6">
                <img
                  src="/employee/emp1.png"
                  alt="Employee 1"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-medium text-white mb-1 tracking-tight leading-none">
                  Employee Name
                </h3>
                <p className="text-[13px] text-[#A1A1AA] mb-4 font-light tracking-wide">
                  Creative Lead
                </p>
                <div className="flex items-center justify-center gap-4 text-[#A1A1AA]">
                  <a href="#" className="hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Employee 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-[160px] aspect-[4/5] mb-6">
                <img
                  src="/employee/emp1.png"
                  alt="Employee 2"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-medium text-white mb-1 tracking-tight leading-none">
                  Employee Name
                </h3>
                <p className="text-[13px] text-[#A1A1AA] mb-4 font-light tracking-wide">
                  Art Director
                </p>
                <div className="flex items-center justify-center gap-4 text-[#A1A1AA]">
                  <a href="#" className="hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Employee 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-[160px] aspect-[4/5] mb-6">
                <img
                  src="/employee/emp1.png"
                  alt="Employee 3"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-medium text-white mb-1 tracking-tight leading-none">
                  Employee Name
                </h3>
                <p className="text-[13px] text-[#A1A1AA] mb-4 font-light tracking-wide">
                  Motion Designer
                </p>
                <div className="flex items-center justify-center gap-4 text-[#A1A1AA]">
                  <a href="#" className="hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Employee 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-[160px] aspect-[4/5] mb-6">
                <img
                  src="/employee/emp1.png"
                  alt="Employee 4"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-medium text-white mb-1 tracking-tight leading-none">
                  Employee Name
                </h3>
                <p className="text-[13px] text-[#A1A1AA] mb-4 font-light tracking-wide">
                  AI Specialist
                </p>
                <div className="flex items-center justify-center gap-4 text-[#A1A1AA]">
                  <a href="#" className="hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default OurTeam;

