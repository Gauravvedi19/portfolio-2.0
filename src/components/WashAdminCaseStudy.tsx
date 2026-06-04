import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Play, ArrowRight, ArrowDown, X, Maximize2, Plus } from 'lucide-react';
import { ProjectModal } from './ProjectModal';

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

export default function WashAdminCaseStudy() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProductExperience, setShowProductExperience] = useState(false);

  return (
    <div className="w-full flex flex-col relative z-20 mt-32 xl:mt-48">
      <HeroSection onShowProductExperience={() => setShowProductExperience(true)} />
      
      {showProductExperience && (
        <motion.div
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: 'auto' }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <WashAdminProductExperience />
        </motion.div>
      )}

      <WorkflowSection />
      <TransitionSection isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <PortalSection />
            <ArchitectureSection />
            <ImpactSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeroSection({ onShowProductExperience }: { onShowProductExperience?: () => void }) {
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
      <div className="w-full xl:w-[45%] flex flex-col justify-center space-y-8 z-20 px-8 xl:px-0">
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-medium text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
              Car Wash Operations Platform
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] hidden sm:block">
              Operations & Mobile App
            </span>
          </div>
          
          <h3 className="font-display text-5xl sm:text-7xl text-white tracking-tight">
            WashAdmin
          </h3>
          <h4 className="font-display text-2xl sm:text-3xl text-white/80 italic leading-snug">
            “A full-stack mobile + operations platform for managing bookings, subscriptions, bays, and business operations in real time.”
          </h4>
          
          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
            Built a complete ecosystem consisting of a customer-facing mobile application and a real-time admin dashboard for managing car wash operations.
          </p>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {['Expo React Native', 'ReactJS', 'TypeScript', 'Appwrite', 'PostgreSQL', 'Realtime APIs', 'Razorpay', 'Cron Jobs'].map(tech => (
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
          <button onClick={() => setIsModalOpen(true)} className="group relative px-6 py-3 bg-white text-black font-medium text-sm rounded-full overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <span className="relative z-10 flex items-center gap-2">
              View Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          
          <button
            onClick={() => {
              if (onShowProductExperience) {
                onShowProductExperience();
                // Optional small delay to allow animation to start before scrolling
                setTimeout(() => {
                  document.getElementById('washadmin-product-experience')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-6 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-white/70" /> Product Experience
          </button>
        </div>

          <ProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="WashAdmin"
            links={{
              github: "https://github.com/Gauravvedi19/carwash-app.git",
              portal: "https://admin-portal-carwash.vercel.app/",
              demoEmail: "demo@carwash.com",
              demoPassword: "12345678",
              appDownload: "https://drive.google.com/file/d/1pkgSAf4OXlBGWrcLVU2Mw5Cq96P1c80f/view?usp=sharing",
            }}
          />
      </div>

      {/* RIGHT SIDE — HERO PRODUCT EXPERIENCE */}
      <div className="w-full xl:w-[55%] relative h-[600px] sm:h-[700px] xl:h-[800px] flex items-center justify-center perspective-[2000px]">

        {/* LEFT PHONE */}
        <motion.div 
          style={{ y: sidePhonesY }}
          onClick={() => setActiveIndex(2)}
          className={`absolute left-[5%] sm:left-[10%] xl:left-0 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.5rem]
            ${activeIndex === 2 ? 'scale-100 z-40 brightness-110 shadow-[0_0_40px_rgba(255,255,255,0.15)] rotate-[-4deg] hover:scale-[1.02] hover:-translate-y-2' : 'scale-[0.85] z-20 rotate-[-8deg] brightness-[0.6] hover:brightness-[0.8] hover:rotate-[-6deg] hover:scale-[0.88]'}
          `}
        >
          <PhoneMockup imageSrc={CUSTOMER_MOCKUPS[2].image} isActive={activeIndex === 2} />
        </motion.div>

        {/* RIGHT PHONE */}
        <motion.div 
          style={{ y: sidePhonesY }}
          onClick={() => setActiveIndex(1)}
          className={`absolute right-[5%] sm:right-[10%] xl:right-0 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.5rem]
            ${activeIndex === 1 ? 'scale-100 z-40 brightness-110 shadow-[0_0_40px_rgba(255,255,255,0.15)] rotate-[4deg] hover:scale-[1.02] hover:-translate-y-2' : 'scale-[0.85] z-20 rotate-[8deg] brightness-[0.6] hover:brightness-[0.8] hover:rotate-[6deg] hover:scale-[0.88]'}
          `}
        >
          <PhoneMockup imageSrc={CUSTOMER_MOCKUPS[1].image} isActive={activeIndex === 1} />
        </motion.div>

        {/* CENTER PHONE */}
        <motion.div 
          style={{ y: centerPhoneY }}
          onClick={() => setActiveIndex(0)}
          className={`absolute transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer group origin-bottom transform-gpu rounded-[2.5rem]
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

const CUSTOMER_MOCKUPS = [
  {
    id: '01',
    title: 'Smart Wash Tracking',
    summary: 'Monitor active washes in real time.',
    desc: 'Customers can monitor active washes in real time, view assigned bays, and track estimated completion time through a seamless tracking interface.',
    image: '/Mockups/washadmin-mobile-home.png'
  },
  {
    id: '02',
    title: 'Subscription Commerce',
    summary: 'Integrated subscription plans.',
    desc: 'Integrated subscription system with Razorpay payments for recurring customer plans, enabling seamless auto-renewals.',
    image: '/Mockups/washadmin-mobile-plans.png'
  },
  {
    id: '03',
    title: 'Wash History & Feedback',
    summary: 'Maintain service history.',
    desc: 'Customers can view completed washes, maintain service history, and provide instant feedback on wash quality.',
    image: '/Mockups/washadmin-mobile-history.png'
  }
];

const WASHADMIN_PRODUCT_EXPERIENCES = [
  {
    id: "01",
    tag: "Onboarding",
    title: "Customer Journey & Smart Booking",
    summary: "What does the platform do?",
    desc: "A frictionless journey from sign-up to confirmed wash booking. Customers can effortlessly authenticate, register their vehicles, purchase subscriptions, and book available time slots in real time.",
    flow: [
      "Login & OTP",
      "Add Vehicle",
      "Buy Subscription",
      "Book a Wash",
      "Real-time Updates"
    ],
    highlights: [
      "Phone number authentication",
      "Seamless vehicle registration",
      "Instant subscription purchases",
      "Real-time booking updates"
    ],
    why: "Ensures the customer experience feels modern and fast, significantly reducing the barrier to booking and driving more consistent wash volume.",
    videoDesktop: "/videos/customer-booking-desktop.mp4",
    videoMobile: "/videos/customer-booking-mobile.mp4",
    layoutPriority: "mobile-only" as const
  },
  {
    id: "02",
    tag: "Core Workflow",
    title: "Smart Check-In Experience",
    summary: "How does check-in work?",
    desc: "A completely seamless check-in experience. Customers can instantly check in using a QR code and process pay-per-wash transactions via Razorpay, while administrators monitor the queue and trigger manual check-ins if needed.",
    flow: [
      "QR Check-in",
      "Razorpay Integration",
      "Manual Portal Check-in",
      "Live Queue Updates"
    ],
    highlights: [
      "Instant QR check-in",
      "Secure Razorpay checkouts",
      "Live admin queue sync"
    ],
    why: "Bridges the physical and digital experience perfectly, eliminating manual bottlenecks at the wash site and ensuring operators always have a clear view of the current queue.",
    videoDesktop: "/videos/checkin-desktop.mp4",
    videoMobile: "/videos/checkin-mobile.mp4",
    layoutPriority: "side-by-side" as const
  },
  {
    id: "03",
    tag: "Automation",
    title: "Auto Bay Intelligence",
    summary: "What makes this system smart?",
    desc: "The core intelligence engine. Server-side automation handles bay assignments intelligently based on real-time availability and wash type. Customers see live bay status updates, while the system automates background operations.",
    flow: [
      "Cronjob Automation",
      "Auto Bay Assignment",
      "Live Status Tracking",
      "Completion Notifications"
    ],
    highlights: [
      "Automated bay routing",
      "Intelligent cron scheduling",
      "Push notifications",
      "Zero manual assignment"
    ],
    why: "This is the WOW feature that eliminates human error in wash operations. By automating bay logistics, the system maximizes throughput and minimizes idle times automatically.",
    videoDesktop: "/videos/bay-management-desktop.mp4",
    videoMobile: "/videos/bay-management-mobile.mp4",
    layoutPriority: "side-by-side" as const
  },
  {
    id: "04",
    tag: "Administration",
    title: "Operations Configuration Engine",
    summary: "How customizable is the system?",
    desc: "A powerful admin portal giving operators complete control. Configure pricing models, manage subscription tiers, define bay logic, set booking rules, and handle payment controls—all updating the customer app in real-time.",
    flow: [
      "Manage Pricing",
      "Configure Subscriptions",
      "Set Booking Rules",
      "Payment Controls"
    ],
    highlights: [
      "Dynamic pricing controls",
      "Flexible subscription builder",
      "Custom bay logic",
      "Real-time syncing"
    ],
    why: "Creates a totally adaptable platform. Wash businesses can iterate on their business model instantly without needing fresh app deployments.",
    videoDesktop: "/videos/config-desktop.mp4",
    layoutPriority: "desktop-only" as const
  },
  {
    id: "05",
    tag: "Growth",
    title: "Customer Management & Growth",
    summary: "How does the business retain customers?",
    desc: "Comprehensive tools for retention and growth. Administrators can track user habits, manage wallet recharges, and analyze subscription behavior, while customers interact via a clean mobile wallet and history interface.",
    flow: [
      "Marketing Tab",
      "Wallet Recharges",
      "Subscription Management",
      "Booking History"
    ],
    highlights: [
      "Customer retention insights",
      "Integrated wallet system",
      "Subscription health monitoring",
      "Full transaction history"
    ],
    why: "Shifts the focus from one-off transactions to predictable recurring revenue through simple, transparent subscription and wallet mechanisms.",
    videoDesktop: "/videos/customer-growth-desktop.mp4",
    layoutPriority: "desktop-only" as const
  },
  {
    id: "06",
    tag: "Analytics",
    title: "Analytics & Business Intelligence",
    summary: "What insights do owners get?",
    desc: "A rich analytics dashboard built directly into the admin portal. Owners gain instant access to revenue metrics, peak hour analysis, retention rates, and wash volume metrics.",
    flow: [
      "Revenue Dashboards",
      "Peak Hour Analytics",
      "Retention Tracking",
      "Wash Volume Metrics"
    ],
    highlights: [
      "Live revenue tracking",
      "Peak hour identification",
      "Actionable retention data",
      "Operational health tracking"
    ],
    why: "Empowers wash owners to make data-driven decisions on staffing, promotions, and operations, replacing guesswork with actionable intelligence.",
    videoDesktop: "/videos/analytics-desktop.mp4",
    layoutPriority: "desktop-only" as const
  }
];

function DualDeviceShowcase({ srcDesktop, srcMobile, priority, isActive }: { srcDesktop: string, srcMobile?: string, priority: 'desktop-only' | 'mobile-only' | 'side-by-side', isActive: boolean }) {
  const desktopRef = useRef<HTMLVideoElement>(null);
  const mobileRef = useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    // Only restart video when it becomes active. Let native autoPlay handle the rest.
    if (isActive) {
      if (desktopRef.current) {
        desktopRef.current.currentTime = 0;
        desktopRef.current.play().catch(() => {});
      }
      if (mobileRef.current) {
        mobileRef.current.currentTime = 0;
        mobileRef.current.play().catch(() => {});
      }
    } else {
      if (desktopRef.current) desktopRef.current.pause();
      if (mobileRef.current) mobileRef.current.pause();
    }
  }, [isActive]);

  return (
    <div className={`w-full shrink-0 flex items-center justify-center relative mt-8 lg:mt-0 group/mockup min-h-[400px] sm:min-h-[500px] ${priority === 'side-by-side' ? 'max-w-7xl mx-auto pb-12 md:pb-20 lg:pb-24 xl:pb-32 lg:min-h-[600px] xl:min-h-[700px]' : (priority === 'desktop-only' ? 'max-w-5xl mx-auto pb-8 md:pb-12' : 'lg:w-[480px] xl:w-[600px]')}`}>

      <div className={`relative z-10 w-full flex justify-center items-center`}>
        
        {/* Device Wrapper */}
        <div className={`relative flex items-center justify-center ${priority === 'side-by-side' ? 'flex-row gap-4 sm:gap-8 lg:gap-12 xl:gap-16' : ''}`}>
          {/* Desktop Mockup */}
          {priority !== 'mobile-only' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className={`rounded-xl bg-zinc-950 border-[4px] border-zinc-800 overflow-hidden shadow-2xl ring-1 ring-white/10 transition-all duration-700 shrink-0 max-w-[calc(100vw-3rem)]
                ${priority === 'desktop-only' 
                  ? 'w-[320px] sm:w-[480px] md:w-[640px] lg:w-[800px] xl:w-[960px]' 
                  : 'w-[200px] sm:w-[320px] md:w-[460px] lg:w-[520px] xl:w-[600px]'}
              `}
            >
              {/* Browser Top Bar */}
              <div className="bg-zinc-900 border-b border-white/5 h-4 sm:h-5 flex items-center px-2 sm:px-3 gap-1.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500/50" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500/50" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500/50" />
              </div>
              
              {/* Desktop Screen Contents */}
              <div className="aspect-video bg-zinc-900 relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                  <span className="font-mono text-[10px] sm:text-xs">desktop_view</span>
                </div>
                {srcDesktop.endsWith('.mp4') ? (
                isActive && (
                  <VideoPlayer
                    ref={desktopRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={srcDesktop}
                    className="absolute inset-0 w-full h-full object-cover z-10 transform-gpu will-change-transform"
                    onError={(e) => { console.warn('Desktop video failed to load:', srcDesktop); }}
                  />
                )
              ) : (
                  <img src={srcDesktop} className="absolute inset-0 w-full h-full object-cover z-10" onError={(e) => { e.currentTarget.style.opacity = '0'; }} />
                )}
              </div>
            </motion.div>
          )}

          {/* Mobile Mockup */}
          {priority !== 'desktop-only' && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: priority === 'side-by-side' ? 0.3 : 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className={`rounded-[1.5rem] sm:rounded-[2.5rem] bg-zinc-950 border-[4px] sm:border-[6px] border-zinc-900 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-all duration-700 shrink-0 z-20 max-w-[calc(100vw-3rem)]
                ${priority === 'side-by-side' 
                  ? 'relative w-[100px] sm:w-[150px] md:w-[200px] lg:w-[240px] xl:w-[280px]' 
                  : 'relative w-[200px] sm:w-[260px] md:w-[320px] lg:w-[360px] xl:w-[400px]'}
              `}
              style={{ aspectRatio: '1/2.16' }}
            >
            {/* Notch - Center Punch-Hole Camera */}
            <div className="absolute top-3 inset-x-0 flex justify-center z-50 pointer-events-none">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-zinc-950 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] ring-[1px] ring-white/5 flex items-center justify-center">
                <div className="w-[6px] h-[6px] sm:w-2 sm:h-2 bg-blue-900/20 rounded-full" />
              </div>
            </div>
            
            {/* Hardware Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/[0.12] z-20 pointer-events-none rounded-[1.5rem] sm:rounded-[2rem] transition-opacity duration-500 opacity-60" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[1.5rem] sm:rounded-[2rem] z-20 pointer-events-none" />
            
            {/* Mobile Screen Contents */}
            <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center overflow-hidden z-10">
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 z-0">
                <span className="font-mono text-[8px] sm:text-[10px]">mobile_view</span>
              </div>
              {srcMobile?.endsWith('.mp4') ? (
                isActive && (
                  <VideoPlayer
                    ref={mobileRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={srcMobile}
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    onError={(e) => { console.warn('Mobile video failed to load:', srcMobile); }}
                  />
                )
              ) : (
                <img src={srcMobile || ''} className="absolute inset-0 w-full h-full object-cover z-10" onError={(e) => { e.currentTarget.style.opacity = '0'; }} alt="Mobile view" />
              )}
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}

function WashAdminProductExperience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div id="washadmin-product-experience" className="w-full mt-24 mb-32 relative z-20">
      {/* SECTION HEADER */}
      <div className="mb-12 text-left">
        <h3 className="font-display text-3xl sm:text-5xl text-white mb-4 tracking-tight">Ecosystem Experience</h3>
        <p className="text-white/60 text-base md:text-lg max-w-2xl">
          Explore how customer actions instantly sync with operational execution.
        </p>
      </div>

      {/* ACCORDION CONTAINER */}
      <div className="flex flex-col gap-4">
        {WASHADMIN_PRODUCT_EXPERIENCES.map((exp, index) => {
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
                  <span className="font-mono text-xs sm:text-sm text-blue-400/80">{exp.id}</span>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-display text-xl sm:text-2xl text-white transition-colors group-hover:text-blue-50">{exp.title}</h4>
                      {exp.tag && (
                         <span className="shrink-0 px-2.5 py-1 rounded-md text-[10px] sm:text-xs uppercase font-mono font-semibold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">{exp.tag}</span>
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
              <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div className={`p-6 sm:p-8 pt-0 border-t border-white/5 flex flex-col items-center gap-12 lg:gap-16`}>
                  
                  {/* CONTENT COLUMN */}
                  <div className={`flex-1 space-y-8 py-4 sm:py-8 w-full order-2 max-w-4xl lg:text-center flex flex-col`}>
                    <p className="text-white/70 leading-relaxed text-base sm:text-lg">
                      {exp.desc}
                    </p>

                    {/* Flow mapping chips */}
                    {exp.flow && exp.flow.length > 0 && (
                      <div className="pt-4 space-y-3">
                        <div className="text-[10px] uppercase font-mono tracking-[0.2em] font-medium text-blue-400/80">
                          Product Flow
                        </div>
                        <div className={`flex flex-wrap gap-2 items-center text-sm text-white/50 lg:justify-center`}>
                          {exp.flow.map((step, idx) => (
                            <React.Fragment key={idx}>
                              <span className="bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-lg">{step}</span>
                              {idx < exp.flow.length - 1 && <ArrowRight className="w-3 h-3 text-white/20" />}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience Highlights */}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <div className="space-y-4">
                        <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-medium text-blue-400/80">
                          Experience Highlights
                        </span>
                        <div className={`flex flex-wrap gap-2 lg:justify-center`}>
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

                    {/* Strategy & Impact */}
                    {exp.why && (
                      <div className="space-y-3 pt-2 max-w-4xl mx-auto w-full">
                        <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-medium text-blue-400/80">Strategy & Impact</span>
                        <p className={`text-white/50 text-sm leading-relaxed border-l-2 border-white/10 pl-4 py-1 lg:border-l-0 lg:border-t-2 lg:pl-0 lg:pt-4 mx-auto`}>
                          {exp.why}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* DUAL DEVICE FULL SHOWCASE */}
                  <div className={`order-1 w-full flex justify-center px-4 max-w-full`}>
                    <DualDeviceShowcase 
                      srcDesktop={exp.videoDesktop}
                      srcMobile={exp.videoMobile}
                      priority={exp.layoutPriority}
                      isActive={isExpanded}
                    />
                  </div>

                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function WorkflowSection() {
  const steps = [
    { name: 'Sign Up', desc: 'User registers.' },
    { name: 'Add Vehicle', desc: 'Registers vehicle details.' },
    { name: 'Purchase Subscription', desc: 'Uses Razorpay for billing.' },
    { name: 'Book Time Slot', desc: 'Selects available window.' },
    { name: 'QR Check-In', desc: 'Customers scan a QR code to instantly begin the wash process.' },
    { name: 'Bay Assignment', desc: 'Server-side cron jobs automatically allocate bays based on live availability and wash duration.' },
    { name: 'Wash Complete', desc: 'Customer gets notified.' }
  ];

  return (
    <div className="py-24 max-w-6xl mx-auto px-4 w-full">
      <div className="text-center mb-16 space-y-4">
        <h2 className="font-display text-3xl md:text-5xl text-white">How the Platform Works</h2>
        <p className="text-white/50 text-base md:text-lg">A streamlined workflow designed for both customers and operators.</p>
      </div>

      <div className="relative border-l border-white/10 ml-4 sm:ml-8 md:ml-0 md:border-l-0 md:flex md:flex-wrap md:justify-center md:items-start gap-8 pt-10">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-8 md:pl-0 pb-12 md:pb-0 md:w-64 group flex-shrink-0">
            {/* Desktop Line Connector */}
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute top-[11px] left-[50%] w-[100%] h-[1px] bg-white/10" />
            )}
            
            <div className="absolute left-[-5px] top-[6px] md:relative md:left-auto md:top-auto md:mx-auto md:mb-6 w-[11px] h-[11px] rounded-full bg-blue-500/20 border border-blue-400 group-hover:bg-blue-400 transition-colors duration-300 z-10" />
            
            <div className="md:text-center">
              <h4 className="font-mono uppercase tracking-widest text-xs text-white/80 font-semibold mb-2">{step.name}</h4>
              <p className="text-white/40 text-sm leading-relaxed max-w-[200px] md:mx-auto">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TransitionSection({ isExpanded, setIsExpanded }: { isExpanded: boolean, setIsExpanded: (val: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"]
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <div ref={ref} className="min-h-[40vh] md:min-h-[60vh] flex flex-col items-center justify-center relative overflow-hidden py-24 my-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 to-transparent pointer-events-none" />
      <motion.h2 
        style={{ opacity, scale }}
        className="font-display text-3xl md:text-5xl text-center text-white/90 max-w-3xl leading-tight px-4 mb-12 transform-gpu will-change-transform"
      >
        Behind the scenes, a <span className="italic text-white">real-time operations engine</span> powers everything.
      </motion.h2>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="group relative px-8 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] text-white font-medium text-sm rounded-full overflow-hidden transition-all duration-300 flex items-center gap-3 z-10"
      >
        <span>{isExpanded ? 'Hide Operations Engine' : 'Reveal Operations Engine'}</span>
        <motion.div
           animate={{ rotate: isExpanded ? 180 : 0 }}
           transition={{ duration: 0.3 }}
        >
          <ArrowDown className="w-4 h-4 text-white/70" />
        </motion.div>
      </button>
    </div>
  )
}

function PortalSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto w-full">
      <div className="mb-16 space-y-4">
        <h2 className="font-display text-4xl md:text-5xl text-white">Real-Time Operations Dashboard</h2>
        <p className="text-white/50 text-lg">A production-grade admin portal for managing bookings, subscriptions, bays, customers, and profitability.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px] sm:auto-rows-[350px]">
        {/* CARD 1 — Live Bay Management */}
        <BentoCard 
          className="md:col-span-8"
          title="Real-Time Bay Management"
          desc="Automatically manages wash bays using live booking data and time-based automation."
          chips={['Auto-Clear Bays', 'Queue Management', 'Vehicle Tracking', 'Live Status']}
          image="/washadmin-admin-bay.png"
          onClick={() => setSelectedImage('/washadmin-admin-bay.png')}
        />
        
        {/* CARD 4 — Analytics */}
        <BentoCard 
          className="md:col-span-4"
          title="Business Intelligence"
          desc="Revenue forecasting, profitability tracking, customer metrics, and burn-rate analytics."
          chips={['Revenue', 'Profitability', 'Burn Rate']}
          image="/washadmin-admin-analytics.png"
          align="top"
          onClick={() => setSelectedImage('/washadmin-admin-analytics.png')}
        />

        {/* CARD 2 — Slot Visualizer */}
        <BentoCard 
          className="md:col-span-6"
          title="Slot-Based Booking Engine"
          desc="Visualize occupancy and booking availability in real time."
          chips={['Live Capacity', 'Booking Status']}
          image="/washadmin-admin-slot.png"
          onClick={() => setSelectedImage('/washadmin-admin-slot.png')}
        />

        {/* CARD 5 — Booking Management */}
        <BentoCard 
          className="md:col-span-6"
          title="Booking Operations"
          desc="Monitor customer bookings, check-ins, and operational flow."
          chips={['Live Bookings', 'Scheduling']}
          image="/washadmin-admin-bookings.png"
          onClick={() => setSelectedImage('/washadmin-admin-bookings.png')}
        />

        {/* CARD 3 — Store Configuration */}
        <BentoCard 
          className="md:col-span-12 h-[350px]"
          title="Fully Configurable Operations"
          desc="Business owners can customize hours, subscriptions, payment systems, slot rules, and wash operations without code."
          chips={['Razorpay Config', 'Slot Duration', 'Dynamic Plans', 'Operating Hours', 'Bay Automation']}
          image="/washadmin-admin-config.png"
          onClick={() => setSelectedImage('/washadmin-admin-config.png')}
        />
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-xl p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[110]"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Enlarged Dashboard View"
              className="w-full max-w-6xl max-h-[90vh] object-contain rounded-xl shadow-2xl relative z-[105] ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function BentoCard({ className, title, desc, chips, image, align = 'bottom', onClick }: { className?: string, title: string, desc: string, chips: string[], image: string, align?: 'bottom' | 'top', onClick?: () => void }) {
  return (
    <div 
      className={`relative rounded-3xl bg-[#0a0a0c] border border-white/[0.05] overflow-hidden group hover:border-white/[0.1] transition-all duration-500 shadow-2xl flex flex-col ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      
      {/* Background Image Container */}
      <div className={`absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-[1.03] ${align === 'top' ? 'items-start pt-16' : 'items-end flex justify-end'} opacity-50 group-hover:opacity-75`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10">
           <span className="font-mono text-xs text-white/50">img_missing</span>
        </div>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover object-left-top"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
        />
        {/* Inner Gradient Fade */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent ${align === 'top' ? 'bg-gradient-to-b' : ''}`} />
      </div>

      <div className={`relative z-10 flex flex-col p-8 h-full ${align === 'top' ? 'justify-start' : 'justify-end'}`}>
        <div className="flex items-start justify-between mb-2">
            <h3 className="font-display text-2xl text-white">{title}</h3>
            {onClick && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800/80 p-2 rounded-full">
                    <Maximize2 className="w-4 h-4 text-white" />
                </div>
            )}
        </div>
        <p className="text-white/60 text-sm mb-6 max-w-sm leading-relaxed">{desc}</p>
        <div className="flex flex-wrap gap-2">
           {chips.map(chip => (
             <span key={chip} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-white/50">
               {chip}
             </span>
           ))}
        </div>
      </div>
    </div>
  )
}

function ArchitectureSection() {
  return (
    <div className="py-24 max-w-5xl mx-auto px-4 w-full">
      <div className="text-center mb-16">
        <h2 className="font-display text-4xl text-white">System Architecture</h2>
      </div>

      <div className="flex flex-col items-center space-y-4 mb-20 text-center font-mono text-sm">
        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80">Mobile App (Expo React Native)</div>
        <ArrowDown className="text-white/20 w-4 h-4" />
        <div className="px-6 py-4 bg-white/5 border border-blue-500/20 rounded-xl text-blue-200">
          <div className="font-semibold text-white">Appwrite Backend</div>
          <div className="text-xs mt-1 text-white/50">(Auth + Database + APIs)</div>
        </div>
        <ArrowDown className="text-white/20 w-4 h-4" />
        <div className="text-xs uppercase tracking-widest text-[#a1a1aa] py-2 border-b border-white/10 w-48">Realtime Sync</div>
        <ArrowDown className="text-white/20 w-4 h-4" />
        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80">Admin Portal (ReactJS)</div>
        <ArrowDown className="text-white/20 w-4 h-4" />
        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 text-xs">Cron-Based Bay Allocation</div>
      </div>

      <h3 className="font-display text-2xl text-white mb-8 text-center sm:text-left">Engineering Challenges Solved</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "Realtime Synchronization", desc: "Customer bookings instantly reflect inside admin operations." },
          { title: "Automated Bay Assignment", desc: "Cron-based scheduling manages wash flow and timing." },
          { title: "Subscription Commerce", desc: "Razorpay integration powers recurring plans and pay-per-wash." },
          { title: "Configurable Business Rules", desc: "Admins can modify business logic without redeploying the app." }
        ].map(item => (
          <div key={item.title} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <h4 className="text-white font-medium mb-2">{item.title}</h4>
            <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ImpactSection() {
  return (
    <div className="py-32 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
      <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-white leading-tight mb-12">
        Designed and engineered as a <span className="text-white/50 italic">production-ready</span> car wash operating system.
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button className="px-8 py-4 bg-white text-black font-semibold text-sm rounded-full transition-transform hover:scale-[1.02]">
          View Demo
        </button>
        <button className="px-8 py-4 bg-white/[0.05] border border-white/[0.1] text-white font-semibold text-sm rounded-full hover:bg-white/[0.1] transition-colors">
          Explore Case Study
        </button>
      </div>
    </div>
  )
}
