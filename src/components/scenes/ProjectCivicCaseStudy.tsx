import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';

export default function ProjectCivicCaseStudy() {
  return (
    <div className="w-full flex flex-col relative z-20 mt-32 xl:mt-48">
      {/* Flagship Background Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-0 w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-0 w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>
      
      <HeroSection />
    </div>
  );
}

const CUSTOMER_MOCKUPS = [
  
  {
    id: 'feed',
    title: 'Issue Reporting Feed / Homepage',
    desc: 'Showing civic reports sorted by severity and recency with community engagement.',
    image: '/Mockups/civic-mobile-feed.png'
  },
  {
    id: 'map',
    title: 'Interactive Civic Map Screen',
    desc: 'Showing issue markers with severity-based custom markers on a Mapbox-powered map.',
    image: '/Mockups/civic-mobile-map.png'
  },
  {
    id: 'dashboard',
    title: 'MLA / Representative Score Dashboard',
    desc: 'Showing public representative performance score, resolution metrics, and accountability ranking.',
    image: '/Mockups/civic-mobile-dashboard.png'
  }
];

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const centerPhoneY = useTransform(smoothProgress, [0, 1], ["0%", "10%"]);
  const sidePhonesY = useTransform(smoothProgress, [0, 1], ["0%", "-15%"]);
  
  const enterOpacity = useTransform(smoothProgress, [0, 0.2], [0, 1]);
  const enterY = useTransform(smoothProgress, [0, 0.2], [100, 0]);

  const activeContent = CUSTOMER_MOCKUPS[activeIndex];

  return (
    <motion.div 
      ref={containerRef}
      style={{ opacity: enterOpacity, y: enterY }}
      className="flex flex-col xl:flex-row items-center gap-16 xl:gap-8 min-h-[80vh] pt-16 pb-32"
    >
      {/* LEFT SIDE — STORY + CONTEXT */}
      <div className="w-full xl:w-[45%] flex flex-col justify-center space-y-8 z-20 px-8 xl:px-0 text-left">
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-medium text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full border border-purple-400/20">
              Civic-Tech Ecosystem
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-medium text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
              Under Development
            </span>
          </div>
          
          <h3 className="font-display text-5xl sm:text-7xl text-white tracking-tight">
            Project Civic
          </h3>
          <h4 className="font-display text-2xl sm:text-3xl text-white/80 italic leading-snug">
            “A civic-tech platform empowering citizens to report local civic issues while increasing transparency, accountability, and public engagement in real time.”
          </h4>
          
          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
            Built a full-stack civic reporting ecosystem that enables citizens to report civic problems, track issue resolution, compare public representative performance, and drive accountability using geolocation, public visibility, and real-time mapping.
          </p>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {['Expo React Native', 'ReactJS', 'TypeScript', 'Mapbox', 'X API', 'Geolocation', 'Realtime APIs', 'Authentication', 'Cloud Functions', 'PostgreSQL / Supabase'].map(tech => (
            <span key={tech} className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono tracking-wide text-white/50">
              {tech}
            </span>
          ))}
        </div>

        {/* Highlighted Feature Section */}
        <div className="pt-8 border-t border-white/[0.05]">
          <h5 className="font-display text-xl sm:text-2xl text-white mb-2">Smart Civic Intelligence</h5>
          <p className="text-white/50 text-sm leading-relaxed max-w-xl">
            Citizens can report civic issues with geolocation, automatically identify responsible authorities, visualize problems on an interactive map, and monitor issue progress through severity-based timelines and public accountability metrics.
          </p>
        </div>

        {/* Dynamic Story Area */}
        <div className="pt-4 min-h-[140px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-3 max-w-xl px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl"
            >
              <div className="text-[10px] uppercase tracking-widest text-purple-400 font-mono mb-1">MOCKUP {activeIndex + 1} OF 3</div>
              <h5 className="font-display text-lg sm:text-xl text-white">{activeContent.title}</h5>
              <p className="text-white/50 text-sm leading-relaxed">{activeContent.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SIDE — HERO PRODUCT EXPERIENCE */}
      <div className="w-full xl:w-[55%] relative h-[600px] sm:h-[700px] xl:h-[800px] flex items-start justify-center pt-0 -mt-24 sm:-mt-32 xl:-mt-48 perspective-[2000px]">

      {/* LEFT PHONE */}
      <div 
        onClick={() => setActiveIndex(2)}
        className={`absolute left-[5%] sm:left-[10%] xl:left-0 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.25rem]
          ${activeIndex === 2 ? 'scale-100 z-40 brightness-110 shadow-[0_0_40px_rgba(255,255,255,0.15)] rotate-[-4deg] hover:scale-[1.02] hover:-translate-y-2' : 'scale-[0.85] z-20 rotate-[-8deg] brightness-[0.6] hover:brightness-[0.8] hover:rotate-[-6deg] hover:scale-[0.88]'}
        `}
      >
        <PhoneMockup imageSrc={CUSTOMER_MOCKUPS[2].image} isActive={activeIndex === 2} />
      </div>

      {/* RIGHT PHONE */}
      <div 
        onClick={() => setActiveIndex(1)}
        className={`absolute right-[5%] sm:right-[10%] xl:right-0 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.25rem]
          ${activeIndex === 1 ? 'scale-100 z-40 brightness-110 shadow-[0_0_40px_rgba(255,255,255,0.15)] rotate-[4deg] hover:scale-[1.02] hover:-translate-y-2' : 'scale-[0.85] z-20 rotate-[8deg] brightness-[0.6] hover:brightness-[0.8] hover:rotate-[6deg] hover:scale-[0.88]'}
        `}
      >
        <PhoneMockup imageSrc={CUSTOMER_MOCKUPS[1].image} isActive={activeIndex === 1} />
      </div>

      {/* CENTER PHONE */}
      <div 
        onClick={() => setActiveIndex(0)}
        className={`absolute transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.25rem]
          ${activeIndex === 0 ? 'scale-100 z-40 brightness-110 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rotate-0 hover:scale-[1.02] hover:-translate-y-2' : 'scale-[0.9] z-30 brightness-[0.8] hover:brightness-100 hover:scale-[0.95] rotate-0'}
        `}
      >
        <PhoneMockup imageSrc={CUSTOMER_MOCKUPS[0].image} isActive={activeIndex === 0} />
      </div>

      </div>
    </motion.div>
  );
}

function PhoneMockup({ imageSrc, isActive }: { imageSrc: string, isActive: boolean }) {
  return (
    <div className="relative w-[220px] sm:w-[260px] xl:w-[280px] aspect-[1/2.16] rounded-[2.5rem] p-[6px] shadow-2xl transition-all duration-500 transform-gpu bg-gradient-to-br from-zinc-700 via-zinc-900 to-black will-change-transform">
      {/* Screen Content Wrapper */}
      <div className="relative w-full h-full rounded-[2.1rem] overflow-hidden bg-black z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] transform-gpu" style={{ transform: "translateZ(0)" }}>
        <img 
          src={imageSrc} 
          alt="Mockup"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] transform-gpu will-change-transform"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
        />
      </div>

      {/* Titanium reflection overlay */}
      <div className={`absolute inset-0 rounded-[2.5rem] border border-white/20 pointer-events-none z-30 transition-all duration-500 bg-gradient-to-tr from-white/10 to-transparent ${isActive ? 'opacity-100 ring-1 ring-white/20' : 'opacity-40'} transform-gpu`} />
      <div className="absolute inset-[6px] ring-1 ring-inset ring-white/15 rounded-[2.1rem] z-40 pointer-events-none transform-gpu" />

      {/* Hardware Buttons */}
      <div className="absolute -left-[2px] top-32 w-1 h-12 bg-[#222] rounded-l-md z-20 shadow-[inset_1px_0_1px_rgba(255,255,255,0.1)] transform-gpu" />
      <div className="absolute -left-[2px] top-48 w-1 h-12 bg-[#222] rounded-l-md z-20 shadow-[inset_1px_0_1px_rgba(255,255,255,0.1)] transform-gpu" />
      <div className="absolute -right-[2px] top-40 w-1 h-16 bg-[#222] rounded-r-md z-20 shadow-[inset_-1px_0_1px_rgba(255,255,255,0.1)] transform-gpu" />

      {/* Notch */}
      <div className="absolute top-[6px] inset-x-0 h-[22px] flex justify-center z-40 pointer-events-none transform-gpu">
        <div className="w-[35%] h-full bg-black rounded-b-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.5)] flex justify-center items-center gap-2">
          {/* Camera lens reflection */}
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20 shadow-[inset_0_0_2px_rgba(255,255,255,0.5)]" />
        </div>
      </div>
      
      {/* Outer Glow */}
      <div className={`absolute inset-[-20%] bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.15),transparent_60%)] -z-10 rounded-[3rem] transition-all duration-700 transform-gpu ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} />
    </div>
  );
}
