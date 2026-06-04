import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Play, ArrowRight, X, Info, Plus } from 'lucide-react';
import WashAdminCaseStudy from '../WashAdminCaseStudy';
import ClinkoCaseStudy from './ClinkoCaseStudy';

import ProjectCivicCaseStudy from './ProjectCivicCaseStudy';

const VideoPlayer = React.forwardRef<HTMLVideoElement, React.VideoHTMLAttributes<HTMLVideoElement>>(({ src, className, onLoadedData, ...props }, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <>
      <div className="absolute inset-0 bg-zinc-900 animate-pulse z-0" />
      <video
        ref={ref}
        src={src}
        onLoadedData={(e) => {
          setIsLoaded(true);
          onLoadedData?.(e);
        }}
        {...props}
        className={`${className} transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
});
VideoPlayer.displayName = 'VideoPlayer';

export default function Scene5Products() {
  const [showProductExperience, setShowProductExperience] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [-45, 45]);

  return (
    <section ref={containerRef} className="relative w-full pb-32 overflow-hidden z-10">
      {/* Background Parallax Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        {/* Simplified Background */}
        <div className="absolute inset-0 bg-white/[0.02]" />

        {/* Slow-moving SVG Particles */}
        <svg className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <motion.circle cx="15%" cy="25%" r="1.5" fill="rgba(255,255,255,0.8)"
              animate={{ y: [0, -30, 0], x: [0, 20, 0], opacity: [0.1, 0.6, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle cx="85%" cy="35%" r="2" fill="rgba(255,255,255,0.6)"
              animate={{ y: [0, 40, 0], x: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.circle cx="50%" cy="75%" r="2.5" fill="rgba(255,255,255,0.7)"
              animate={{ y: [0, -50, 0], x: [0, 40, 0], opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
            <motion.circle cx="70%" cy="85%" r="1" fill="rgba(255,255,255,0.9)"
              animate={{ y: [0, -20, 0], x: [0, -30, 0], opacity: [0.1, 0.7, 0.1] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.circle cx="20%" cy="70%" r="1.5" fill="rgba(255,255,255,0.5)"
              animate={{ y: [0, 30, 0], x: [0, 30, 0], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />
        </svg>

        <motion.div style={{ y: y1 }} className="absolute left-[5%] md:left-[10%] top-[-20%] bottom-[-20%] w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <motion.div style={{ y: y2 }} className="absolute right-[5%] md:right-[10%] top-[-20%] bottom-[-20%] w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        
        <motion.div 
          style={{ rotate: rotate1 }} 
          className="absolute w-[100vw] h-[100vw] max-w-[1000px] max-h-[1000px] border border-white/[0.02] rounded-full" 
        />
        <motion.div 
          style={{ rotate: rotate2, scale: 0.8 }} 
          className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] border border-white/[0.03] rounded-full border-dashed" 
        />
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/3 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        <motion.div 
          className="mb-32 text-center"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
            y: useTransform(scrollYProgress, [0, 0.1], [50, 0])
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 font-medium">
            The Payoff
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white">
            Products come alive.
          </h2>
        </motion.div>

        <div className="flex flex-col">
          <div id="postcard">
            <PostcardFlagship onShowProductExperience={() => setShowProductExperience(true)} />
            {showProductExperience && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <PostcardProductExperience />
              </motion.div>
            )}
          </div>
          <div id="washadmin">
            <WashAdminCaseStudy />
          </div>
          <div id="cliniko">
            <ClinkoCaseStudy />
          </div>
          <div id="projectcivic">
            <ProjectCivicCaseStudy />
          </div>
        </div>
      </div>
    </section>
  );
}

const POSTCARD_MOCKUPS = [
  {
    id: 'brand',
    title: '“Your world, through fresh eyes.”',
    desc: 'Designed to make exploration feel emotional, personal, and community-driven from the very first interaction. This screen establishes the product identity and visual language.',
    image: '/Mockups/postcard-welcome.png' // REPLACE WITH ACTUAL IMAGE
  },
  {
    id: 'discover',
    title: '“Discover hidden gems.”',
    desc: 'Explore unique places shared by real people — from cafés and scenic spots to experiences traditional maps miss. Built around exploration and meaningful discovery.',
    image: '/Mockups/postcard-discover.png' // REPLACE WITH ACTUAL IMAGE
  },
  {
    id: 'share',
    title: '“Share discoveries worth remembering.”',
    desc: 'Users can share experiences, contribute discoveries, and help others explore authentically. Community is the foundation of the product.',
    image: '/Mockups/postcard-share.png' // REPLACE WITH ACTUAL IMAGE
  }
];

function PostcardFlagship({ onShowProductExperience }: { onShowProductExperience?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const centerPhoneY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const sidePhonesY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  
  const enterOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const enterY = useTransform(scrollYProgress, [0, 0.2], [100, 0]);

  const activeContent = POSTCARD_MOCKUPS[activeIndex];

  return (
    <motion.div 
      ref={containerRef}
      style={{ opacity: enterOpacity, y: enterY }}
      className="flex flex-col xl:flex-row items-center gap-16 xl:gap-8 min-h-[80vh]"
    >
      {/* LEFT SIDE — STORY + CONTEXT */}
      <div className="w-full xl:w-[45%] flex flex-col justify-center space-y-8 z-20">
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
              Flagship Product
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-medium text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
              Live on Play Store
            </span>
          </div>
          
          <h3 className="font-display text-5xl sm:text-7xl text-white tracking-tight">
            Postcard®
          </h3>
          <h4 className="font-display text-2xl sm:text-3xl text-white/80 italic leading-snug">
            “Helping people discover hidden gems through community.”
          </h4>
          
          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
            A social discovery platform where people explore hidden places, share experiences, and discover cities through real people instead of generic ratings. Built to make discovery feel more personal, social, and meaningful.
          </p>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {['React Native', 'Firebase', 'Maps Integration', 'Authentication', 'Community Features', 'Product Design'].map((tech) => (
            <span key={tech} className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono tracking-wide text-white/50">
              {tech}
            </span>
          ))}
        </div>

        {/* Dynamic Story Area */}
        <div className="pt-8 border-t border-white/[0.05] min-h-[160px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-3 max-w-xl"
            >
              <h5 className="font-display text-xl sm:text-2xl text-white">{activeContent.title}</h5>
              <p className="text-white/50 text-sm leading-relaxed">{activeContent.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <a
            href="https://play.google.com/store/apps/details?id=com.gauravvedi18.postcard&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-6 py-3 bg-white text-black font-medium text-sm rounded-full overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get on Play Store <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>

          <button
            disabled
            className="px-6 py-3 bg-white/[0.03] border border-white/[0.1] text-white/40 font-medium text-sm rounded-full cursor-not-allowed flex items-center gap-2"
          >
            App Store (Soon)
          </button>
          
          <button
            onClick={() => {
              if (onShowProductExperience) {
                onShowProductExperience();
                // Optional small delay to allow animation to start before scrolling
                setTimeout(() => {
                  document.getElementById('product-experience-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-6 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-white/70" /> Product Experience
          </button>
        </div>
      </div>

      {/* RIGHT SIDE — HERO PRODUCT EXPERIENCE */}
      <div className="w-full xl:w-[55%] relative h-[600px] sm:h-[700px] xl:h-[800px] flex items-center justify-center perspective-[2000px]">

        {/* LEFT PHONE (Discover) */}
        <motion.div 
          style={{ y: sidePhonesY }}
          onClick={() => setActiveIndex(1)}
          className={`absolute left-[5%] sm:left-[10%] xl:left-0 z-20 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.5rem]
            ${activeIndex === 1 ? 'scale-[0.85] z-40 brightness-110 shadow-[0_0_40px_rgba(255,255,255,0.15)] rotate-[-4deg]' : 'scale-[0.75] rotate-[-8deg] brightness-[0.6] hover:brightness-[0.8] hover:rotate-[-6deg]'}
          `}
        >
          <PhoneMockup imageSrc={POSTCARD_MOCKUPS[1].image} isActive={activeIndex === 1} />
        </motion.div>

        {/* RIGHT PHONE (Share) */}
        <motion.div 
          style={{ y: sidePhonesY }}
          onClick={() => setActiveIndex(2)}
          className={`absolute right-[5%] sm:right-[10%] xl:right-0 z-20 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.5rem]
            ${activeIndex === 2 ? 'scale-[0.85] z-40 brightness-110 shadow-[0_0_40px_rgba(255,255,255,0.15)] rotate-[4deg]' : 'scale-[0.75] rotate-[8deg] brightness-[0.6] hover:brightness-[0.8] hover:rotate-[6deg]'}
          `}
        >
          <PhoneMockup imageSrc={POSTCARD_MOCKUPS[2].image} isActive={activeIndex === 2} />
        </motion.div>

        {/* CENTER PHONE (Welcome/Brand) */}
        <motion.div 
          style={{ y: centerPhoneY }}
          onClick={() => setActiveIndex(0)}
          className={`absolute z-30 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.5rem]
            ${activeIndex === 0 ? 'scale-100 brightness-110 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rotate-0 translate-y-0' : 'scale-90 brightness-[0.7] hover:brightness-[0.9] hover:-translate-y-2'}
          `}
        >
          <PhoneMockup imageSrc={POSTCARD_MOCKUPS[0].image} isActive={activeIndex === 0} />
        </motion.div>

      </div>
    </motion.div>
  );
}

function PhoneMockup({ imageSrc, isActive = false }: { imageSrc: string, isActive?: boolean }) {
  return (
    <div className="relative w-[220px] sm:w-[280px] xl:w-[320px] aspect-[1/2.16] rounded-[2.5rem] p-[6px] shadow-2xl transition-all duration-500 transform-gpu bg-gradient-to-br from-zinc-700 via-zinc-900 to-black group-hover:ring-white/30 will-change-transform">
      {/* Screen Content Wrapper */}
      <div className="relative w-full h-full rounded-[2.1rem] overflow-hidden bg-black z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] transform-gpu" style={{ transform: "translateZ(0)" }}>
        <img 
          src={imageSrc} 
          alt="App Mockup" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] transform-gpu will-change-transform"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
        />
      </div>

      {/* Titanium reflection overlay */}
      <div className={`absolute inset-0 rounded-[2.5rem] border border-white/20 pointer-events-none z-30 transition-all duration-500 bg-gradient-to-tr from-white/10 to-transparent ${isActive ? 'opacity-100 ring-1 ring-white/20' : 'opacity-40'} transform-gpu`} />
      <div className="absolute inset-[6px] ring-1 ring-inset ring-white/15 rounded-[2.1rem] z-40 pointer-events-none transform-gpu" />

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

const PRODUCT_EXPERIENCES = [
 {
id: "01",
tag: "Onboarding",
title: "Login Flow",
summary: "Seamless onboarding, your way.",
desc: "Sign in effortlessly using Google or email and personalize your experience from the very first interaction. Designed to make discovery feel instant, familiar, and intuitive while minimizing friction during onboarding.",

flow: [
"Login",
"Profile setup",
"Onboarding",
"Home"
],

highlights: [
"Google & Email Authentication",
"Personalized onboarding journey",
"Preference-based discovery setup",
"Instant account access",
"Seamless transition into discovery"
],

why: "The onboarding experience is intentionally designed to reduce friction and help users feel connected immediately. Instead of overwhelming setup screens, Postcard gradually personalizes discovery through lightweight onboarding, profile customization, and preference-based experiences. This ensures users move from authentication to meaningful exploration in seconds.",

video: "/videos/personalized-experience.mp4"
}

,
  {
id: "02",
tag: "Social",
title: "Community & Browsing",
summary: "Experience discovery powered by people.",

desc: "Explore hidden gems shared by real people through a social-first discovery experience. Browse authentic recommendations, open immersive posts, engage with likes and discussions, and save memorable places into personal collections for future exploration.",

flow: [
"Browse homepage",
"Open posts",
"Community reviews",
"Likes & comments",
"Saved collections"
],

highlights: [
"Community-powered recommendations",
"Immersive hidden place discovery",
"Social interactions & engagement",
"Save locations to collections",
"Real experiences over ratings"
],

why: "Unlike traditional review platforms that rely heavily on ratings, Postcard focuses on authentic discovery through people and storytelling. The browsing experience is designed to feel emotional and organic, helping users discover meaningful places through trusted community experiences rather than generic algorithms.",

video: "/videos/community-browsing.mp4"
}
,
  {
  id: "03",
  tag: "Core Feature",
  title: "Discover Hidden Places",
  summary: "Community-driven exploration around you.",

  desc: "Discover extraordinary places through an interactive geo-location experience designed for real-world exploration. Filter nearby hidden gems, uncover trending spots, read authentic recommendations from locals, browse community guestbooks, and save memorable discoveries for later adventures.",

  flow: [
    "Open app",
    "Map exploration",
    "Geo-location filtering",
    "Discover hidden places",
    "Community guestbook",
    "Save & navigate"
  ],

  highlights: [
    "Interactive map exploration",
    "Geo-location powered discovery",
    "Trending nearby & global spots",
    "Community guestbooks",
    "Navigation support"
  ],

  why: "This is the core experience of Postcard. Instead of generic recommendations or influencer-driven content, users discover meaningful locations through real community experiences. The geo-intelligent map system makes exploration feel personal, local, and authentic.",

  video: "/videos/discover-places.mp4"
},
  {
  id: "04",
  tag: "Creation",
  title: "Create & Share Experience",
  summary: "Turn experiences into discoveries.",

  desc: "Transform memorable places into meaningful discoveries through a creator-first publishing experience. Upload photos, tag precise locations, share authentic recommendations, and publish hidden gems that help others explore places through real experiences instead of generic reviews.",

  flow: [
    "Create post",
    "Upload media",
    "Geo-location tagging",
    "Write recommendation",
    "Customize discovery",
    "Publish post"
  ],

  highlights: [
    "Rich media uploads",
    "Precise geo-location tagging",
    "Authentic storytelling",
    "Community-powered recommendations",
    "Creator-first publishing"
  ],

  why: "Postcard grows through authentic experiences shared by real people. Instead of short-form social content or ratings, users create meaningful discovery stories that help communities uncover memorable places through trust, context, and local knowledge.",

  video: "/videos/create-share.mp4"
},
  {
  id: "05",
  tag: "Discovery",
  title: "Explore & Geo Discovery",
  summary: "Location-aware discovery, personalized to you.",

  desc: "Discover what’s happening around you through Postcard’s intelligent geo-discovery engine. Explore trending hidden gems nearby, filter places using geo-location, uncover local and global hotspots, and follow top community hunters shaping discovery across regions.",

  flow: [
    "Open Explore",
    "Set geo-location",
    "Nearby trending places",
    "Global discoveries",
    "Top hunters nearby",
    "Global rankings"
  ],

  highlights: [
    "Geo-location powered filtering",
    "Nearby & global trends",
    "Top community hunters",
    "Regional discovery insights",
    "Location-aware exploration"
  ],

  why: "The Explore experience transforms Postcard from a traditional discovery app into a location-intelligent platform. By combining geo-awareness, community behavior, and trend-based exploration, users discover places that feel relevant, authentic, and contextual to where they are.",

  video: "/videos/explore-geo-discovery.mp4"
},
  {
  id: "06",
  tag: "Identity",
  title: "Profile & Personalization",
  summary: "Your discovery journey, all in one place.",

  desc: "Manage your entire discovery identity through a personalized profile experience. Explore created posts, revisit saved bucket lists, track quests and achievements, customize themes, and shape the platform around your own exploration style.",

  flow: [
    "Open profile",
    "View created posts",
    "Explore bucket list",
    "Track quests",
    "Open settings",
    "Customize theme"
  ],

  highlights: [
    "Personal discovery profile",
    "Created posts & activity",
    "Saved bucket lists",
    "Quest & progression system",
    "Theme personalization"
  ],

  why: "The profile experience transforms Postcard into a long-term companion rather than a one-time discovery app. By combining identity, saved experiences, achievements, and personalization, users build a deeper emotional connection with their exploration journey.",

  video: "/videos/profile-personalization.mp4"
}
  
];

function PostcardProductExperience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div id="product-experience-section" className="w-full mt-24 mb-32 relative z-20">
      {/* SECTION HEADER */}
      <div className="mb-12 text-left">
        <h3 className="font-display text-3xl sm:text-5xl text-white mb-4 tracking-tight">Product Experience</h3>
        <p className="text-white/60 text-base md:text-lg max-w-2xl">
          Explore how Postcard works through guided product journeys.
        </p>
      </div>

      {/* ACCORDION CONTAINER */}
      <div className="flex flex-col gap-4">
        {PRODUCT_EXPERIENCES.map((exp, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <motion.div 
              key={exp.id}
              className="border border-white/[0.08] rounded-3xl overflow-hidden bg-zinc-950/40 transition-all duration-500 hover:border-white/[0.15]"
              initial={false}
              animate={{ 
                backgroundColor: isExpanded ? 'rgba(24, 24, 27, 0.8)' : 'rgba(24, 24, 27, 0.4)',
                boxShadow: isExpanded ? '0 20px 40px -20px rgba(0,0,0,0.5)' : 'none'
              }}
            >
              {/* HEADER (ALWAYS VISIBLE) */}
              <button 
                className="w-full flex items-center justify-between p-6 sm:p-8 cursor-pointer text-left group"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <div className="flex items-center gap-6 sm:gap-8 origin-left transition-transform duration-500 group-hover:translate-x-1">
                  <span className="font-mono text-xs sm:text-sm text-emerald-400/80">{exp.id}</span>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-display text-xl sm:text-2xl text-white transition-colors group-hover:text-emerald-50">{exp.title}</h4>
                      {exp.tag && (
                         <span className="shrink-0 px-2.5 py-1 rounded-md text-[10px] sm:text-xs uppercase font-mono font-semibold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{exp.tag}</span>
                      )}
                    </div>
                    <p className="text-white/50 text-sm hidden sm:block max-w-xl pr-4 leading-relaxed">{exp.summary}</p>
                  </div>
                </div>
                <div className={`shrink-0 p-3 rounded-full border border-white/10 transition-all duration-500 flex items-center justify-center ${isExpanded ? 'rotate-45 bg-white/10 border-white/20' : 'bg-transparent group-hover:border-white/30'}`}>
                  <Plus className="w-5 h-5 text-white/70" />
                </div>
              </button>

              {/* EXPANDABLE BODY */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 sm:p-8 pt-0 border-t border-white/5 flex flex-col md:flex-row gap-12 lg:gap-16">
                      
                      {/* CONTENT COLUMN */}
                      <div className="flex-1 space-y-8 py-4 sm:py-8">
                        <p className="text-white/70 leading-relaxed text-base sm:text-lg">
                          {exp.desc}
                        </p>

                        {exp.flow && exp.flow.length > 0 && (
                          <div className="space-y-4">
                            <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-medium text-white/40">Flow Mapping</span>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
                              {exp.flow.map((step, i) => (
                                <React.Fragment key={i}>
                                  <span className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] shadow-sm">{step}</span>
                                  {i < exp.flow.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-white/20" />}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}
                        {exp.highlights && exp.highlights.length > 0 && (

  <div className="space-y-4">
    <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-medium text-blue-400/80">
      Experience Highlights
    </span>

<div className="flex flex-wrap gap-2">
  {exp.highlights.map((item, i) => (
    <span
      key={i}
      className="
        px-3 py-2 rounded-xl
        bg-white/[0.03]
        border border-white/[0.08]
        text-sm text-white/70
        hover:border-white/[0.15]
        hover:bg-white/[0.05]
        transition-all duration-300
      "
    >
      {item}
    </span>
  ))}
</div>


  </div>
)}


                        {exp.why && (
                          <div className="space-y-3 pt-2">
                            <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-medium text-emerald-400/80">Strategy & Impact</span>
                            <p className="text-sm sm:text-base text-white/60 border-l-[2px] border-emerald-400/30 pl-4 py-1 leading-relaxed">
                              {exp.why}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* DEVICE MOCKUP COLUMN */}
                      <div className="w-full md:w-[280px] lg:w-[320px] shrink-0 flex items-center justify-center relative pb-4 md:pb-0">
                        
                        {/* Premium Phone Frame */}
                        <motion.div 
                          initial={{ y: 20, opacity: 0, scale: 0.95 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                          className="relative w-[240px] lg:w-[280px] xl:w-[320px] aspect-[1/2.16] rounded-[2.5rem] bg-zinc-950 border-[6px] border-zinc-900 overflow-hidden shadow-2xl ring-1 ring-white/10 z-10 
                          group/mockup transition-transform duration-700 hover:scale-[1.02]"
                        >
                          {/* Center Punch-Hole Camera */}
                          <div className="absolute top-3 inset-x-0 flex justify-center z-50 pointer-events-none">
                            <div className="w-5 h-5 bg-zinc-950 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] ring-[1px] ring-white/5 flex items-center justify-center">
                              <div className="w-2 h-2 bg-indigo-900/20 rounded-full" />
                            </div>
                          </div>
                          
                          {/* Hardware Reflection */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/[0.12] z-20 pointer-events-none rounded-[2rem] transition-opacity duration-500 group-hover/mockup:opacity-100 opacity-60" />
                          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] z-20 pointer-events-none" />

                          {/* Embedded Video placeholder */}
                          <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                            {isExpanded && (
                              <VideoPlayer
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 group-hover/mockup:scale-105 transform-gpu will-change-transform"
                                src={exp.video}
                              />
                            )}
                            {/* Fallback if video fails to load or isn't present initially */}
                            <div className="absolute inset-0 bg-zinc-900/80 z-0 flex items-center justify-center opacity-0 transition-opacity">
                              <Play className="w-8 h-8 text-white/20" />
                            </div>
                          </div>
                        </motion.div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

