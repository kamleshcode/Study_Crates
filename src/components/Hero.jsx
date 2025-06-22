import React from 'react';
import logo from '../assets/Logo.png';
import homepage1 from '../assets/homepage1.jpg';
import bg2 from '../assets/bg2.jpg';

const Hero = () => {
  return (
    <section
      className="relative min-h-[90vh] w-full flex items-center justify-center px-2 py-8 overflow-hidden"
      // style={{
      //   background: 'black',
      // }}
      style={{
        backgroundImage: `url(${homepage1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fallback color
      }}
    >
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between pt-24 md:pt-0">
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start justify-center px-4 md:px-8">
          <span className="uppercase text-white/80 tracking-widest text-sm mb-2">STUDY SOLUTION</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Discover the world of <br />
            <span className="text-yellow-100">Learning</span>
          </h1>
          <p className="text-white/90 text-lg mb-8 max-w-md">
            StudyCrate is your all-in-one platform for organized notes, collaborative projects, and progress tracking. Empower your learning journey with curated resources and a vibrant student community.
          </p>
          <button className="bg-white text-[#ff6a5b] font-bold px-8 py-3 rounded-full shadow hover:bg-yellow-50 transition">
            Get Started
          </button>
        </div>
        {/* Right Image */}
        <div className="flex-1 flex items-center justify-center relative mt-12 md:mt-0">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 bg-white/20 backdrop-blur-lg">
            <img
              src={homepage1}
              alt="StudyCrate Hero"
              className="w-[350px] h-[260px] object-cover"
            />
            
            {/* Play button overlay (optional) */}
            {/* <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 text-[#ff6a5b] rounded-full p-4 shadow-lg border-2 border-white/80 hover:bg-white">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 20 20">
                <polygon points="7,5 16,10 7,15" />
              </svg>
            </button> */}
          </div>
        </div>
        
      </div>
      

      {/* Curved SVG at the bottom */}
      {/* <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg viewBox="0 0 2000 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-32 md:h-40">
          <path
            fill="#fff"
            d="M0,120 C500,270 1080,0 1440,200 L1440,300 L0,300 Z"
          />
        </svg>
      </div> */}
      
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 ">
      <svg
        viewBox="0 0 1440 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-32 md:h-40"
        preserveAspectRatio="none"
      >
      <path
        fill="#f5f5f5"
        d="M0,80 C360,180 1080,0 1440,100 L1440,180 L0,180 Z"

      />
      </svg>
</div>
    </section>
  );
};

export default Hero;