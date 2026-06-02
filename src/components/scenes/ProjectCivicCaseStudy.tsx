import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import { ProjectModal } from '../ProjectModal';

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
    id: 'map',
    title: 'Interactive Civic Map Screen',
    desc: 'Showing issue markers with severity-based custom markers on a Mapbox-powered map.',
    image: '/civic-mobile-map.png'
  },
  {
    id: 'feed',
    title: 'Issue Reporting Feed / Homepage',
    desc: 'Showing civic reports sorted by severity and recency with community engagement.',
    image: '/civic-mobile-feed.png'
  },
  {
    id: 'dashboard',
    title: 'MLA / Representative Score Dashboard',
    desc: 'Showing public representative performance score, resolution metrics, and accountability ranking.',
    image: '/civic-mobile-dashboard.png'
  }
];

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const centerPhoneY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const sidePhonesY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  
  const enterOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const enterY = useTransform(scrollYProgress, [0, 0.2], [100, 0]);

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

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <button onClick={() => setIsModalOpen(true)} className="group relative px-6 py-3 bg-white text-black font-medium text-sm rounded-full overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <span className="relative z-10 flex items-center gap-2">
              View Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          
          <button className="px-6 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2">
            <Play className="w-4 h-4 text-white/70" /> Watch Demo
          </button>
        </div>

        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Project Civic"
          links={{
            github: "#",
            portal: "#",
            demoEmail: "demo@civictech.com",
            demoPassword: "12345678",
            appDownload: "#",
          }}
        />
      </div>

      {/* RIGHT SIDE — HERO PRODUCT EXPERIENCE */}
      <div className="w-full xl:w-[55%] relative h-[600px] sm:h-[700px] xl:h-[800px] flex items-start justify-center pt-0 -mt-24 sm:-mt-32 xl:-mt-48 perspective-[2000px]">

        {/* LEFT PHONE */}
        <motion.div 
          style={{ y: sidePhonesY }}
          onClick={() => setActiveIndex(2)}
          className={`absolute left-[5%] sm:left-[10%] xl:left-0 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu
            ${activeIndex === 2 ? 'scale-100 z-40 brightness-110 shadow-[0_0_40px_rgba(255,255,255,0.15)] rotate-[-4deg] hover:scale-[1.02] hover:-translate-y-2' : 'scale-[0.85] z-20 rotate-[-8deg] brightness-[0.6] hover:brightness-[0.8] hover:rotate-[-6deg] hover:scale-[0.88]'}
          `}
        >
          <PhoneMockup imageSrc={CUSTOMER_MOCKUPS[2].image} isActive={activeIndex === 2} />
        </motion.div>

        {/* RIGHT PHONE */}
        <motion.div 
          style={{ y: sidePhonesY }}
          onClick={() => setActiveIndex(1)}
          className={`absolute right-[5%] sm:right-[10%] xl:right-0 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu
            ${activeIndex === 1 ? 'scale-100 z-40 brightness-110 shadow-[0_0_40px_rgba(255,255,255,0.15)] rotate-[4deg] hover:scale-[1.02] hover:-translate-y-2' : 'scale-[0.85] z-20 rotate-[8deg] brightness-[0.6] hover:brightness-[0.8] hover:rotate-[6deg] hover:scale-[0.88]'}
          `}
        >
          <PhoneMockup imageSrc={CUSTOMER_MOCKUPS[1].image} isActive={activeIndex === 1} />
        </motion.div>

        {/* CENTER PHONE */}
        <motion.div 
          style={{ y: centerPhoneY }}
          onClick={() => setActiveIndex(0)}
          className={`absolute transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu
            ${activeIndex === 0 ? 'scale-100 z-40 brightness-110 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rotate-0 hover:scale-[1.02] hover:-translate-y-2' : 'scale-[0.9] z-30 brightness-[0.8] hover:brightness-100 hover:scale-[0.95] rotate-0'}
          `}
        >
          <PhoneMockup imageSrc={CUSTOMER_MOCKUPS[0].image} isActive={activeIndex === 0} />
        </motion.div>

      </div>
    </motion.div>
  );
}

function PhoneMockup({ imageSrc, isActive }: { imageSrc: string, isActive: boolean }) {
  return (
    <div className={`relative w-[220px] sm:w-[260px] xl:w-[280px] aspect-[1/2.16] rounded-[2.5rem] p-3 shadow-2xl transition-all duration-700 bg-white/[0.02] border border-white/[0.05] box-border backdrop-blur-xl`}>
      {/* Phone Frame */}
      <div className="absolute inset-0 rounded-[2.5rem] border-[4px] border-[#1a1a1a] pointer-events-none z-20" />
      
      {/* Hardware Details */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-[#1a1a1a] rounded-b-2xl z-30 flex justify-center items-end pb-1.5">
        <div className="w-1/3 h-1 bg-white/10 rounded-full" />
      </div>
      <div className="absolute -left-[4px] top-32 w-1 h-12 bg-[#1a1a1a] rounded-l-md z-20" />
      <div className="absolute -left-[4px] top-48 w-1 h-12 bg-[#1a1a1a] rounded-l-md z-20" />
      <div className="absolute -right-[4px] top-40 w-1 h-16 bg-[#1a1a1a] rounded-r-md z-20" />

      {/* Screen Content */}
      <div className="w-full h-full rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/10 relative z-10">
        <img 
          src={imageSrc} 
          alt="App screen" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Reflection Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Outer Glow */}
      <div className={`absolute inset-[-10%] bg-gradient-to-b from-purple-500/20 to-transparent blur-2xl -z-10 rounded-full transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
}
