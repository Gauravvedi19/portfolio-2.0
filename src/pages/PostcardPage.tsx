import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Play, ArrowRight, X, Info, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const POSTCARD_MOCKUPS = [
  {
    id: 'brand',
    title: '“Your world, through fresh eyes.”',
    desc: 'Designed to make exploration feel emotional, personal, and community-driven from the very first interaction. This screen establishes the product identity and visual language.',
    image: '/Mockups/postcard-welcome.png'
  },
  {
    id: 'discover',
    title: '“Discover hidden gems.”',
    desc: 'Explore unique places shared by real people — from cafés and scenic spots to experiences traditional maps miss. Built around exploration and meaningful discovery.',
    image: '/Mockups/postcard-discover.png'
  },
  {
    id: 'share',
    title: '“Share discoveries worth remembering.”',
    desc: 'Users can share experiences, contribute discoveries, and help others explore authentically. Community is the foundation of the product.',
    image: '/Mockups/postcard-share.png'
  }
];

function PhoneMockup({ imageSrc, isActive }: { imageSrc: string, isActive: boolean }) {
  return (
    <div className={`relative w-[240px] h-[520px] rounded-[2.5rem] bg-black border-[6px] border-zinc-900 shadow-2xl overflow-hidden transform-gpu transition-all duration-700 ease-[0.23,1,0.32,1] ${isActive ? '' : 'pointer-events-none'}`}>
      <div className="absolute top-0 inset-x-0 h-6 bg-black z-20 flex justify-center items-start pt-1.5">
        <div className="w-16 h-4 bg-zinc-900 rounded-full" />
      </div>
      <img 
        src={imageSrc} 
        className="w-full h-full object-cover rounded-[2rem]" 
        alt="Mockup view"
        onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
      />
    </div>
  );
}

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
      <div className="w-full xl:w-[45%] flex flex-col justify-center space-y-8 z-20">
        
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
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

        <div className="flex flex-wrap gap-2 pt-2">
          {['React Native', 'Firebase', 'Maps Integration', 'Authentication', 'Community Features', 'Product Design'].map((tech) => (
            <span key={tech} className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono tracking-wide text-white/50">
              {tech}
            </span>
          ))}
        </div>

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
        </div>
      </div>

      <div className="w-full xl:w-[55%] relative flex items-center justify-center min-h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent blur-3xl opacity-30 rounded-full" />
        
        <motion.div 
          style={{ y: sidePhonesY }}
          onClick={() => setActiveIndex(1)}
          className={`absolute left-[5%] sm:left-[10%] xl:left-0 z-20 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.5rem]
            ${activeIndex === 1 ? 'scale-[0.85] z-40 brightness-110 shadow-[0_0_40px_rgba(255,255,255,0.15)] rotate-[-4deg]' : 'scale-[0.75] rotate-[-8deg] brightness-[0.6] hover:brightness-[0.8] hover:rotate-[-6deg]'}
          `}
        >
          <PhoneMockup imageSrc={POSTCARD_MOCKUPS[1].image} isActive={activeIndex === 1} />
        </motion.div>

        <motion.div 
          style={{ y: sidePhonesY }}
          onClick={() => setActiveIndex(2)}
          className={`absolute right-[5%] sm:right-[10%] xl:right-0 z-20 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.5rem]
            ${activeIndex === 2 ? 'scale-[0.85] z-40 brightness-110 shadow-[0_0_40px_rgba(255,255,255,0.15)] rotate-[4deg]' : 'scale-[0.75] rotate-[8deg] brightness-[0.6] hover:brightness-[0.8] hover:rotate-[6deg]'}
          `}
        >
          <PhoneMockup imageSrc={POSTCARD_MOCKUPS[2].image} isActive={activeIndex === 2} />
        </motion.div>

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

const POSTCARD_PRODUCT_JOURNEYS = [
  {
    id: "01",
    tag: "Onboarding",
    title: "The First Impression",
    summary: "A warm, personal welcome into the Postcard world.",
    desc: "The onboarding flow is designed to feel less like setting up software and more like preparing for a journey. The visual language uses soft animations, warm typography, and clear calls to action to establish trust and excitement.",
    flow: [
      "Welcome screen & value proposition",
      "Soft authentication request",
      "Permissions context (Why we need location)"
    ],
    why: "First impressions are critical for a consumer app. By prioritizing aesthetics and explaining the \"why\" behind permissions, we reduce drop-offs and build excitement before the user even enters the main app.",
    video: "/videos/onboarding-experience.mp4"
  },
  {
    id: "02",
    tag: "Onboarding",
    title: "Personalizing the Experience",
    summary: "Tailoring discovery to individual preferences.",
    desc: "Postcard needs to understand what the user cares about. Instead of generic suggestions, we guide users through a clean, interactive preference setup that allows them to select categories, vibes, and interests.",
    flow: [
      "Location permission prompt",
      "Interest selection grid",
      "Profile creation flow"
    ],
    why: "The onboarding experience is intentionally designed to reduce friction and help users feel connected immediately. This ensures users move from authentication to meaningful exploration in seconds.",
    video: "/videos/personalized-experience.mp4"
  },
  {
    id: "03",
    tag: "Discovery",
    title: "Community Browsing",
    summary: "Discovering places through real people.",
    desc: "The main feed is the heart of Postcard. Users browse through rich, full-screen cards showcasing discoveries made by the community. It feels editorial, visual, and highly contextual.",
    flow: [
      "Full-screen feed interaction",
      "Viewing details & locations",
      "Saving to collections"
    ],
    why: "Unlike traditional review platforms that rely heavily on ratings, Postcard focuses on authentic discovery through people and storytelling. The browsing experience is designed to feel emotional and organic.",
    video: "/videos/community-browsing.mp4"
  },
  {
    id: "04",
    tag: "Discovery",
    title: "Explore Details",
    summary: "Deep dive into a specific location.",
    desc: "When a user taps into a discovery, they see exactly why a place is special. Rich imagery, community notes, exact location, and the ability to navigate there instantly are all presented in a clean, hierarchy-driven layout.",
    flow: [
      "View detailed place card",
      "Read community notes",
      "Open in external maps"
    ],
    why: "This is the core experience of Postcard. Instead of generic recommendations or influencer-driven content, users discover meaningful locations through real community experiences.",
    video: "/videos/discover-places.mp4"
  },
  {
    id: "05",
    tag: "Creating",
    title: "Creating a Postcard",
    summary: "Sharing a discovery with the world.",
    desc: "The creation flow empowers users to document their favorite spots. With an intuitive, step-by-step publisher, users can add photos, write a personalized note, and tag the exact geo-location effortlessly.",
    flow: [
      "Select photo & add details",
      "Write personalized note",
      "Tag exact location & publish"
    ],
    why: "Postcard grows through authentic experiences shared by real people. Users create meaningful discovery stories that help communities uncover memorable places.",
    video: "/videos/create-share.mp4"
  },
  {
    id: "06",
    tag: "Profile",
    title: "The Personal Collection",
    summary: "A record of past discoveries and saved places.",
    desc: "The profile is a personal diary of exploration. Users can switch between the postcards they've created and the spots they've saved to their bucket list, all organized in an elegant grid.",
    flow: [
      "View created postcards",
      "Access saved collections",
      "Manage account settings"
    ],
    why: "The profile experience transforms Postcard into a long-term companion rather than a one-time discovery app. Users build a deeper emotional connection with their exploration journey.",
    video: "/videos/profile-personalization.mp4"
  }
];

function PostcardProductExperience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div id="product-experience-section" className="w-full mt-24 mb-32 relative z-20">
      <div className="mb-12 text-left">
        <h3 className="font-display text-3xl sm:text-5xl text-white mb-4 tracking-tight">Product Experience</h3>
        <p className="text-white/60 text-base md:text-lg max-w-2xl">
          Explore how Postcard works through guided product journeys.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {POSTCARD_PRODUCT_JOURNEYS.map((journey, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <motion.div
              key={journey.id}
              layout
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className={`rounded-[2rem] border overflow-hidden cursor-pointer transition-all duration-500 ease-[0.23,1,0.32,1]`}
              style={{
                borderColor: isExpanded ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                backgroundColor: isExpanded ? 'rgba(24, 24, 27, 0.8)' : 'rgba(24, 24, 27, 0.4)',
              }}
            >
              <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className={`font-mono text-xs tracking-widest uppercase transition-colors duration-300 ${isExpanded ? 'text-white' : 'text-white/30'}`}>
                    {journey.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                        {journey.tag}
                      </span>
                    </div>
                    <h4 className={`font-display text-2xl sm:text-3xl transition-colors duration-300 ${isExpanded ? 'text-white' : 'text-white/70'}`}>
                      {journey.title}
                    </h4>
                    <p className="text-white/50 text-sm mt-1">{journey.summary}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-white text-black rotate-180' : 'bg-transparent text-white'}`}>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-8 sm:px-8 sm:pb-8 pt-0 border-t border-white/5 mt-4 pt-8">
                      <div className="flex flex-col xl:flex-row gap-12">
                        <div className="xl:w-1/2 space-y-8">
                          <div>
                            <h5 className="text-sm font-mono tracking-widest uppercase text-white/30 mb-3">01 / The Context</h5>
                            <p className="text-white/80 leading-relaxed text-base">{journey.desc}</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {journey.flow.map((step, idx) => (
                              <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                <div className="text-white/20 font-mono text-xs uppercase tracking-widest">{`0${idx + 1}`}</div>
                                <div className="text-white/70 text-sm font-medium">{step}</div>
                              </div>
                            ))}
                          </div>
                          <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                            <h5 className="text-xs font-mono tracking-widest uppercase text-blue-400 mb-2 flex items-center gap-2">
                              <Info className="w-3.5 h-3.5" />
                              Design Rationale
                            </h5>
                            <p className="text-white/70 text-sm leading-relaxed">{journey.why}</p>
                          </div>
                        </div>

                        <div className="xl:w-1/2 flex items-center justify-center">
                          <div className="relative w-full max-w-[320px] aspect-[9/19] rounded-[2.5rem] bg-black border-[8px] border-zinc-900 overflow-hidden shadow-2xl">
                             <div className="absolute top-0 inset-x-0 h-6 bg-black z-20 flex justify-center items-start pt-1.5">
                                <div className="w-16 h-4 bg-zinc-900 rounded-full" />
                             </div>
                             <div className="absolute inset-0 flex items-center justify-center">
                               <p className="text-white/30 text-xs font-mono">Video Coming Soon</p>
                             </div>
                          </div>
                        </div>
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

export default function PostcardPage() {
  return (
    <div className="relative overflow-hidden pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <PostcardFlagship />
        <PostcardProductExperience />
      </div>
    </div>
  );
}
