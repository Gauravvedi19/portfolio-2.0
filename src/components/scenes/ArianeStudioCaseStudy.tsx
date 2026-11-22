import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react';
import { ArrowRight, Play, Plus, ScanLine, Gauge, Layers, Palette, Sparkles, Zap, Check } from 'lucide-react';
import { VideoPlayer } from '../VideoPlayer';

/**
 * Ariane Studio — a 3D + AR table-setting studio for Ariane Fine Porcelain, built solo in Expo React Native.
 *
 * VIDEOS: each flow below plays /videos/<flow.video>. Drop the screen recordings into public/videos/
 * under those names; until a file exists its phone shows a "Video coming soon" card instead of a blank.
 * HERO: the centre phone plays /videos/ariane-ar.mp4 (falling back to its screenshot); the side phones
 * show /Mockups/ariane-*.png, with the same fallback.
 */
export default function ArianeStudioCaseStudy() {
  return (
    <div className="w-full flex flex-col relative z-20 mt-32 xl:mt-48">
      {/* Flagship Background Glow — Ariane's champagne gold */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] left-0 w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] right-0 w-[40vw] h-[40vw] bg-orange-900/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <HeroSection />
      <ProofBar />
      <ArianeProductExperience />
      <FeaturedStory />
      <EngineeringHighlights />
    </div>
  );
}


/** What a phone shows until its recording or screenshot is added: the Ariane night with a gold roundel. */
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_50%_30%,#3a2a1c_0%,#14100c_60%,#0a0807_100%)]">
      <div className="w-14 h-14 rounded-full border border-amber-200/40 flex items-center justify-center">
        <span className="font-display text-2xl text-amber-200/80 italic">A</span>
      </div>
      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-100/40">{label}</span>
    </div>
  );
}

/** The journey in order — shown under the headline. */
const JOURNEY = ['Concept', 'Table', '3D room', 'Catalogue', 'Customise', 'Set the table', 'Food', 'View in AR', 'Enquire'];

/** Centre phone first: AR is the moment people remember, so it leads. */
const ARIANE_MOCKUPS = [
  {
    id: 'ar',
    title: '“See it on your real table.”',
    desc: 'The complete table setting, placed on your own table in AR at true size.',
    image: '/Mockups/ariane-ar.png',
    video: '/videos/ariane-ar.mp4'
  },
  {
    id: 'room',
    title: '“Walk into your own restaurant.”',
    desc: 'A 3D dining room built around your table. Walk around, sit at any seat, switch from day to night.',
    image: '/Mockups/ariane-room.png'
  },
  {
    id: 'welcome',
    title: '“Set the table before it exists.”',
    desc: 'A welcome screen that feels like stepping into a fine-dining room — it moves as you tilt your phone.',
    image: '/Mockups/ariane-welcome.png'
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

  const enterOpacity = useTransform(smoothProgress, [0, 0.2], [0, 1]);
  const enterY = useTransform(smoothProgress, [0, 0.2], [100, 0]);

  const activeContent = ARIANE_MOCKUPS[activeIndex];

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity: enterOpacity, y: enterY }}
      className="flex flex-col xl:flex-row items-center gap-16 xl:gap-8 min-h-[80vh] relative z-10"
    >
      {/* LEFT SIDE — STORY + CONTEXT */}
      <div className="w-full xl:w-[45%] flex flex-col justify-center space-y-8 z-20">

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-medium text-amber-300 bg-amber-300/10 px-3 py-1 rounded-full border border-amber-300/20">
              Client · Ariane Fine Porcelain
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Launching Soon
            </span>
          </div>

          <h3 className="font-display text-5xl sm:text-7xl text-white tracking-tight">
            Ariane Studio
          </h3>
          <h4 className="font-display text-2xl sm:text-3xl text-white/80 italic leading-snug">
            “Design your restaurant’s table setting — and see it on your real table in AR.”
          </h4>

          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
            A mobile app for restaurants and hotels buying premium tableware. Choose your concept and table, set it in a 3D dining room, customise the plates, then see the complete table setting on your own table in AR — and send an enquiry in one tap.
          </p>

          {/* The hook */}
          <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-xl border-l-[2px] border-amber-300/50 pl-4">
            Real-time 3D and AR usually need a game engine. I built both in React Native — <span className="text-amber-200">solo, in under 2 months.</span>
          </p>
        </div>

        {/* The journey, in order */}
        <div className="flex flex-wrap items-center gap-2">
          {JOURNEY.map((step, i) => (
            <React.Fragment key={step}>
              <span className={`px-3 py-1.5 rounded-lg text-xs border ${step === 'View in AR' ? 'bg-amber-400/10 border-amber-400/30 text-amber-200' : 'bg-white/[0.03] border-white/[0.08] text-white/60'}`}>
                {step}
              </span>
              {i < JOURNEY.length - 1 && <ArrowRight className="w-3 h-3 text-white/20" />}
            </React.Fragment>
          ))}
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-2">
          {['React Native', 'Expo', '3D (three.js)', 'Augmented Reality', 'AI', 'Product Design'].map((tech) => (
            <span key={tech} className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono tracking-wide text-white/50">
              {tech}
            </span>
          ))}
        </div>

        {/* Dynamic Story Area */}
        <div className="pt-8 border-t border-white/[0.05] min-h-[120px] relative">
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
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => document.getElementById('ariane-experience-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-6 py-3 bg-white text-black font-medium text-sm rounded-full overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Play className="w-4 h-4" /> Product Experience
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          <button
            onClick={() => document.getElementById('ariane-story-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2"
          >
            The engineering <ArrowRight className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* RIGHT SIDE — HERO PRODUCT EXPERIENCE */}
      <div className="w-full xl:w-[55%] relative h-[600px] sm:h-[700px] xl:h-[800px] flex items-center justify-center perspective-[2000px]">

      {/* LEFT PHONE (Room) — the centre phone (AR) is index 0 */}
      <div
        onClick={() => setActiveIndex(1)}
        className={`absolute left-[5%] sm:left-[10%] xl:left-0 z-20 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.5rem]
          ${activeIndex === 1 ? 'scale-[0.85] z-40 brightness-110 shadow-[0_0_40px_rgba(255,255,255,0.15)] rotate-[-4deg]' : 'scale-[0.75] rotate-[-8deg] brightness-[0.6] hover:brightness-[0.8] hover:rotate-[-6deg]'}
        `}
      >
        <PhoneMockup imageSrc={ARIANE_MOCKUPS[1].image} isActive={activeIndex === 1} />
      </div>

      {/* RIGHT PHONE (Welcome) */}
      <div
        onClick={() => setActiveIndex(2)}
        className={`absolute right-[5%] sm:right-[10%] xl:right-0 z-20 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.5rem]
          ${activeIndex === 2 ? 'scale-[0.85] z-40 brightness-110 shadow-[0_0_40px_rgba(255,255,255,0.15)] rotate-[4deg]' : 'scale-[0.75] rotate-[8deg] brightness-[0.6] hover:brightness-[0.8] hover:rotate-[6deg]'}
        `}
      >
        <PhoneMockup imageSrc={ARIANE_MOCKUPS[2].image} isActive={activeIndex === 2} />
      </div>

      {/* CENTER PHONE (AR, playing) */}
      <div
        onClick={() => setActiveIndex(0)}
        className={`absolute z-30 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.5rem]
          ${activeIndex === 0 ? 'scale-100 brightness-110 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rotate-0 translate-y-0' : 'scale-90 brightness-[0.7] hover:brightness-[0.9] hover:-translate-y-2'}
        `}
      >
        <PhoneMockup imageSrc={ARIANE_MOCKUPS[0].image} videoSrc={ARIANE_MOCKUPS[0].video} isActive={activeIndex === 0} />
      </div>

      </div>
    </motion.div>
  );
}

/** A phone's screenshot, or the coming-soon card until it's added. */
function Screenshot({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <ComingSoon label="Screen coming soon" />;
  return (
    <img
      src={src}
      alt="Ariane Studio screen"
      className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] transform-gpu will-change-transform"
      onError={() => setFailed(true)}
    />
  );
}

function PhoneMockup({ imageSrc, videoSrc, isActive = false }: { imageSrc: string, videoSrc?: string, isActive?: boolean }) {
  // A video, if given, plays first; without one (or until it exists) the screenshot shows, then the card.
  return (
    <div className="relative w-[220px] sm:w-[280px] xl:w-[320px] aspect-[1/2.16] rounded-[2.5rem] p-[6px] shadow-2xl transition-all duration-500 transform-gpu bg-gradient-to-br from-zinc-700 via-zinc-900 to-black group-hover:ring-white/30 will-change-transform">
      {/* Screen Content Wrapper */}
      <div className="relative w-full h-full rounded-[2.1rem] overflow-hidden bg-black z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] transform-gpu" style={{ transform: "translateZ(0)" }}>
        {videoSrc ? (
          <VideoPlayer
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            fallback={<Screenshot src={imageSrc} />}
            className="relative w-full h-full object-cover transform-gpu"
          />
        ) : (
          <Screenshot src={imageSrc} />
        )}
      </div>

      {/* Titanium reflection overlay */}
      <div className={`absolute inset-0 rounded-[2.5rem] border border-white/20 pointer-events-none z-30 transition-all duration-500 bg-gradient-to-tr from-white/10 to-transparent ${isActive ? 'opacity-100 ring-1 ring-white/20' : 'opacity-40'} transform-gpu`} />
      <div className="absolute inset-[6px] ring-1 ring-inset ring-white/15 rounded-[2.1rem] z-40 pointer-events-none transform-gpu" />

      {/* Notch */}
      <div className="absolute top-[6px] inset-x-0 h-[22px] flex justify-center z-40 pointer-events-none transform-gpu">
        <div className="w-[35%] h-full bg-black rounded-b-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.5)] flex justify-center items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/20 shadow-[inset_0_0_2px_rgba(255,255,255,0.5)]" />
        </div>
      </div>

      {/* Outer Glow */}
      <div className={`absolute inset-[-20%] bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.12),transparent_60%)] -z-10 rounded-[3rem] transition-all duration-700 transform-gpu ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} />
    </div>
  );
}

const ARIANE_EXPERIENCES = [
  {
    id: "01",
    tag: "Onboarding",
    title: "Welcome & Sign Up",
    summary: "A first impression that feels like the product.",
    desc: "A living photo of a fine-dining room that moves as you tilt the phone, then a quick sign-up that asks who you are and what you’re opening.",
    flow: ["Welcome", "Sign up", "About you", "Establishment"],
    highlights: ["Tilt-reactive 3D welcome", "Smooth, animated forms", "Role-based onboarding"],
    video: "/videos/ariane-onboarding.mp4"
  },
  {
    id: "02",
    tag: "Concept",
    title: "Select Your Concept",
    summary: "Fine dining, café, rooftop — pick your kind of place.",
    desc: "Browse restaurant concepts as full-screen photos with real depth. Your choice shapes the 3D room you’ll design in.",
    flow: ["Browse concepts", "Preview", "Choose"],
    highlights: ["Depth photos made with AI", "10 restaurant concepts", "Shapes the 3D room"],
    video: "/videos/ariane-concept.mp4"
  },
  {
    id: "03",
    tag: "Setup",
    title: "Choose Your Table",
    summary: "Shape and seats, picked inside a 3D restaurant.",
    desc: "Pick a round, rectangle or square table and the number of seats — the camera glides across a 3D restaurant to show you that exact table.",
    flow: ["Pick shape", "Pick seats", "Generate room"],
    highlights: ["Live 3D preview", "Cinematic camera moves", "2 to 12+ seats"],
    video: "/videos/ariane-table-setup.mp4"
  },
  {
    id: "04",
    tag: "Home",
    title: "My Collections",
    summary: "Every table you’ve designed, in one place.",
    desc: "Each saved table setting is a card with its picture and contents. Start a new one or reopen any design exactly as you left it.",
    flow: ["Collections", "Create new", "Open in 3D"],
    highlights: ["Picture of every table", "Pick up where you left off", "Unlimited settings"],
    video: "/videos/ariane-collections.mp4"
  },
  {
    id: "05",
    tag: "Core Experience",
    title: "The 3D Dining Room",
    summary: "Walk around, sit down, change the light.",
    desc: "A real-time 3D restaurant around your table. Walk the room, orbit the table, sit at any seat to see it as a guest would, and switch between day and night.",
    flow: ["Enter room", "Walk", "Sit at a seat", "Day / night"],
    highlights: ["Real-time 3D on a phone", "Guest’s-eye view", "Day & night lighting"],
    video: "/videos/ariane-dining-room.mp4"
  },
  {
    id: "06",
    tag: "Catalogue",
    title: "Catalogue & Wishlist",
    summary: "Shop the range without leaving your table.",
    desc: "Plates, bowls, cups, cutlery and barware slide up over the room. Spin any product in 3D and save favourites to a wishlist.",
    flow: ["Open catalogue", "View in 3D", "Add to wishlist"],
    highlights: ["3D product viewer", "Persistent wishlist", "Opens instantly"],
    video: "/videos/ariane-catalogue.mp4"
  },
  {
    id: "07",
    tag: "Design",
    title: "Set the Table",
    summary: "Lay a whole table in a few taps.",
    desc: "Add a piece and it appears at every seat in the right place. Move, rotate, stack, replace, or set each seat differently to compare.",
    flow: ["Add a piece", "Set for all seats", "Rearrange", "Stack"],
    highlights: ["Smart auto-placement", "Per-seat or all seats", "Top-down blueprint"],
    video: "/videos/ariane-table-setting.mp4"
  },
  {
    id: "08",
    tag: "Customisation",
    title: "Customise the Plate",
    summary: "Your patterns, logo and artwork on the real product.",
    desc: "Add rim patterns, your logo or your own artwork to a real 3D-scanned plate, then save the design — it appears on the table, in AR and in the enquiry.",
    flow: ["Customise", "Pattern / logo / image", "Position", "Save"],
    highlights: ["Brand logo on plates", "Rim line patterns", "Same design everywhere"],
    video: "/videos/ariane-studio.mp4"
  },
  {
    id: "09",
    tag: "AI",
    title: "Food Visualisation",
    summary: "See the menu on the plates.",
    desc: "Serve dishes onto the plates — choose from ready-made dishes or describe one and let AI create it — to see how the food looks on the tableware.",
    flow: ["Pick plates", "Choose or describe a dish", "Serve"],
    highlights: ["AI-generated dishes", "Sized to each plate", "Realistic shadows"],
    video: "/videos/ariane-food.mp4"
  },
  {
    id: "10",
    tag: "Augmented Reality",
    title: "See Your Table Setting in AR",
    summary: "The complete setting, at real size, on your own table.",
    desc: "Point your phone at a real table — the app finds it by itself — and the whole table setting you designed appears on it at true size. Walk around it, move pieces and rotate them.",
    flow: ["View in AR", "Point at your table", "Table setting appears", "Walk around & adjust"],
    highlights: ["Complete table setting in AR", "True-to-size", "No setup — just point"],
    video: "/videos/ariane-ar.mp4"
  },
  {
    id: "11",
    tag: "Conversion",
    title: "Preview & Enquiry",
    summary: "From a designed table to a quote request.",
    desc: "Review every product with pictures of your table, choose quantities, then export a PDF or send the enquiry — and track its status from your account.",
    flow: ["Preview", "Choose products", "Export PDF", "Send enquiry", "Track"],
    highlights: ["Auto-generated PDF", "Pictures of your table", "Enquiry tracking"],
    video: "/videos/ariane-enquiry.mp4"
  }
];

function ArianeProductExperience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div id="ariane-experience-section" className="w-full mt-24 mb-32 relative z-20">
      {/* SECTION HEADER */}
      <div className="mb-12 text-left">
        <h3 className="font-display text-3xl sm:text-5xl text-white mb-4 tracking-tight">Product Experience</h3>
        <p className="text-white/60 text-base md:text-lg max-w-2xl">
          From the first screen to a quote request, in eleven flows.
        </p>
      </div>

      {/* ACCORDION CONTAINER */}
      <div className="flex flex-col gap-4">
        {ARIANE_EXPERIENCES.map((exp, index) => {
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
                  <span className="font-mono text-xs sm:text-sm text-amber-300/80">{exp.id}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h4 className="font-display text-xl sm:text-2xl text-white transition-colors group-hover:text-amber-50">{exp.title}</h4>
                      <span className="shrink-0 px-2.5 py-1 rounded-md text-[10px] sm:text-xs uppercase font-mono font-semibold tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20">{exp.tag}</span>
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

                        <div className="space-y-4">
                          <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-medium text-white/40">Flow</span>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
                            {exp.flow.map((step, i) => (
                              <React.Fragment key={i}>
                                <span className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] shadow-sm">{step}</span>
                                {i < exp.flow.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-white/20" />}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-medium text-amber-300/80">
                            Highlights
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {exp.highlights.map((item, i) => (
                              <span
                                key={i}
                                className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white/70 hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* DEVICE MOCKUP COLUMN */}
                      <div className="w-full md:w-[280px] lg:w-[320px] shrink-0 flex items-center justify-center relative pb-4 md:pb-0">
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
                              <div className="w-2 h-2 bg-amber-900/20 rounded-full" />
                            </div>
                          </div>

                          {/* Hardware Reflection */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/[0.12] z-20 pointer-events-none rounded-[2rem] transition-opacity duration-500 group-hover/mockup:opacity-100 opacity-60" />
                          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] z-20 pointer-events-none" />

                          <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                            {isExpanded && (
                              <VideoPlayer
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 group-hover/mockup:scale-105 transform-gpu will-change-transform"
                                src={exp.video}
                                fallback={<ComingSoon label="Video coming soon" />}
                              />
                            )}
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

/** The four numbers a recruiter reads first, and what I did, under them. */
const PROOF = [
  { value: 'Solo', label: 'mobile developer, end to end' },
  { value: '< 2 mo', label: 'from client requirements to app' },
  { value: '11', label: 'end-to-end user flows' },
  { value: '3 cm', label: 'precision before AR locks onto a table' }
];

const ROLE_SCOPE = ['Requirements with the client', 'UI from design handoff', 'Real-time 3D', 'Augmented reality', 'AI food visuals', 'PDF & enquiries', 'Performance'];

function ProofBar() {
  return (
    <div className="w-full mt-8 relative z-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PROOF.map((p) => (
          <div key={p.label} className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-950/40">
            <div className="font-display text-3xl sm:text-4xl text-amber-200 mb-2">{p.value}</div>
            <div className="text-xs sm:text-sm text-white/50 leading-relaxed">{p.label}</div>
          </div>
        ))}
      </div>

      {/* MY ROLE */}
      <div className="mt-4 p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-zinc-950/40 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
        <div className="lg:w-[45%]">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-medium text-amber-300/80">My Role</span>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed mt-3">
            The company’s only mobile developer. I took requirements directly from Ariane and built the entire app under their supervision.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:flex-1">
          {ROLE_SCOPE.map((item) => (
            <span key={item} className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white/70 flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400/80" /> {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The hardest problem, told as a story: problem → what I did → result. */
const STORY_STEPS = [
  {
    title: 'Animations off the JS thread',
    text: 'Every animation, gesture and glass effect runs on the native UI thread, so React’s work can never freeze them.'
  },
  {
    title: 'A frame pump synced to the screen',
    text: 'I replaced the 3D render loop with one driven by the display itself. It draws only when something changes and never sends frames faster than the GPU can show them.'
  },
  {
    title: 'Heavy work waits for the motion',
    text: 'Big updates land after a transition finishes, pages are built before they’re needed, and 3D models load through native file reads instead of JavaScript.'
  }
];

function FeaturedStory() {
  return (
    <div id="ariane-story-section" className="w-full mb-24 relative z-20">
      <div className="p-8 sm:p-12 rounded-[2rem] border border-amber-300/15 bg-gradient-to-br from-amber-900/15 via-zinc-950/60 to-zinc-950/60">
        <span className="text-[10px] uppercase font-mono tracking-[0.3em] font-medium text-amber-300/80">The Hardest Problem</span>
        <h3 className="font-display text-3xl sm:text-5xl text-white mt-4 mb-6 tracking-tight max-w-3xl">
          Keeping a 3D app fluid on a single JavaScript thread
        </h3>
        <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-3xl">
          In Expo React Native, the interface, the app logic and the entire 3D renderer share one JavaScript thread. Anything heavy on it freezes the room and makes touches feel late. On a real phone, JavaScript was sending <span className="text-white">73 frames a second</span> while the screen could only show <span className="text-white">35–51</span> — the backlog turned into lag and jitter.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {STORY_STEPS.map((s, i) => (
            <div key={s.title} className="p-6 rounded-2xl bg-black/20 border border-white/[0.06]">
              <span className="font-mono text-xs text-amber-300/80">0{i + 1}</span>
              <h4 className="font-display text-xl text-white mt-2 mb-2">{s.title}</h4>
              <p className="text-sm text-white/55 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 pt-6 border-t border-white/[0.06] text-white/80 text-base sm:text-lg leading-relaxed max-w-3xl">
          <span className="text-emerald-400 font-medium">Result:</span> a full 3D restaurant that runs smoothly on a mid-range phone — inside Expo Go, with no custom native code.
        </p>
      </div>
    </div>
  );
}

/** Each one plain for everyone, with "How I solved it" for the engineers in the room. */
const HIGHLIGHTS = [
  {
    icon: ScanLine,
    badge: 'My own research',
    title: 'AR surface detection I built myself',
    plain: 'Point the phone at a table and it locks on in seconds — the most accurate surface detection I’ve worked with.',
    how: 'Stock plane detection drifted and misjudged height, so I replaced it. The app samples the surface continuously, waits out the sensor’s settling period, and locks only when 6 readings agree within 3cm. After that, placement is pure geometry against the locked plane, with drag input smoothed by an adaptive filter — so pieces never float, sink or slide.'
  },
  {
    icon: Gauge,
    title: 'Adapts to every phone',
    plain: 'The app senses what the phone can handle and lowers quality automatically before it lags or overheats.',
    how: 'A native module in Kotlin and Swift sorts the device into 3 performance tiers, then watches frame rate and temperature live. A sustained drop below 55fps, or thermal throttling, steps quality down — and it never steps back up mid-session.'
  },
  {
    icon: Layers,
    title: 'Studio-quality models that load fast',
    plain: 'Detailed product models load quickly and look right on a phone.',
    how: 'An automated pipeline resizes textures to a safe size, rebuilds broken shading, and merges hundreds of scene parts into a few (378 → 15) without losing any geometry.'
  },
  {
    icon: Palette,
    title: 'One design, everywhere',
    plain: 'A customised plate looks identical in the 3D room, in AR and in the enquiry PDF.',
    how: 'The design is exported as a real 3D file on the phone itself. That meant writing my own image encoder, because React Native has no browser canvas to encode textures with.'
  },
  {
    icon: Sparkles,
    title: 'A premium feel over live 3D',
    plain: 'Every transition stays smooth while the 3D room runs underneath it.',
    how: 'Graphics surfaces are built before they’re shown and only redraw when they change. Each multi-part animation runs on one shared clock, so nothing pops, flickers or jumps.'
  },
  {
    icon: Zap,
    title: 'Fast feedback from the client',
    plain: 'The client tested every new build on their own phone in seconds.',
    how: 'Everything except AR runs inside Expo Go with no custom native code. AR loads only in the full build.'
  }
];

function EngineeringHighlights() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="w-full mb-32 relative z-20">
      <div className="mb-12 text-left max-w-3xl">
        <span className="text-[10px] uppercase font-mono tracking-[0.3em] font-medium text-amber-300/80">Engineering Highlights</span>
        <h3 className="font-display text-3xl sm:text-5xl text-white mt-4 mb-4 tracking-tight">What made it work</h3>
        <p className="text-white/60 text-base md:text-lg leading-relaxed">
          Open any card to see how I solved it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
        {HIGHLIGHTS.map((h, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.23, 1, 0.32, 1] }}
              className={`p-6 sm:p-8 rounded-3xl border bg-zinc-950/40 transition-colors duration-500 flex flex-col ${i === 0 ? 'border-amber-300/25' : 'border-white/[0.08] hover:border-white/[0.15]'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 w-fit">
                  <h.icon className="w-5 h-5 text-amber-300" />
                </div>
                {h.badge && (
                  <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-mono font-semibold tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20">{h.badge}</span>
                )}
              </div>
              <h4 className="font-display text-xl sm:text-2xl text-white mb-3">{h.title}</h4>
              <p className="text-sm text-white/65 leading-relaxed">{h.plain}</p>

              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="mt-6 text-xs font-mono uppercase tracking-[0.15em] text-amber-300/80 hover:text-amber-200 transition-colors flex items-center gap-2 w-fit"
              >
                <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                How I solved it
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <span className="block pt-4 text-sm text-white/50 leading-relaxed border-l-[2px] border-amber-300/30 pl-3 mt-4">{h.how}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
