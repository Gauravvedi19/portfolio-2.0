import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Play, ArrowRight, ArrowDown, X, Maximize2, Plus } from 'lucide-react';

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
        className={`${className} transition-opacity duration-700 ${isLoaded ? 'opacity-95' : 'opacity-0'}`}
      />
    </>
  );
});
VideoPlayer.displayName = 'VideoPlayer';

export default function ClinkoCaseStudy() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const experienceRef = useRef<HTMLDivElement>(null);

  const handleToggleExperience = () => {
    setIsExperienceOpen(prev => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          experienceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
      return next;
    });
  };

  return (
    <div className="w-full flex flex-col relative z-20 mt-32 xl:mt-48">
      <HeroSection isExperienceOpen={isExperienceOpen} onToggleExperience={handleToggleExperience} />

      <div ref={experienceRef} className="scroll-mt-24">
        <AnimatePresence>
          {isExperienceOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden bg-[#030303] border-y border-white/5 relative z-30 shadow-2xl transform-gpu will-change-[height,opacity]"
            >
              <ProductExperienceSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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

const CUSTOMER_MOCKUPS = [
  {
    id: 'home',
    title: 'Smart Booking & Emergency',
    desc: 'Dynamic slot management with capacity awareness and an emergency booking system that inserts urgent patients directly into the priority queue.',
    image: '/Mockups/clinko-mobile-booking.png'
  },
  {
    id: 'queue',
    title: 'Live Queue Tracking',
    desc: 'Patients receive their live queue position, token number, and dynamically estimated waiting time directly on their device.',
    image: '/Mockups/clinko-mobile-queue.png'
  },
  {
    id: 'reminders',
    title: 'My Care & AI Auto-Reminders',
    desc: 'Human-validated AI prescriptions automatically translate into structured daily medication reminders for patients without any manual setup.',
    image: '/Mockups/clinko-mobile-reminders.png'
  }
];

function HeroSection({ isExperienceOpen, onToggleExperience }: { isExperienceOpen: boolean, onToggleExperience: () => void }) {
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
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
              AI-Powered Healthcare SaaS
            </span>
          </div>
          
          <h3 className="font-display text-5xl sm:text-7xl text-white tracking-tight">
            Clinko
          </h3>
          <h4 className="font-display text-2xl sm:text-3xl text-white/80 italic leading-snug">
            “A full-scale clinical ecosystem for patient care, AI prescription digitization, and operational workflows.”
          </h4>
          
          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
            Built a complete ecosystem consisting of a patient app, a dedicated staff mobile app, and a powerful enterprise admin dashboard to streamline clinical operations with zero latency.
          </p>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {['React', 'Appwrite', 'Gemini API', 'Razorpay', 'Real-Time Queue', 'TypeScript', 'Node.js'].map(tech => (
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
          <button className="group relative px-6 py-3 bg-white text-black font-medium text-sm rounded-full overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <span className="relative z-10 flex items-center gap-2">
              View Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          
          <button 
            onClick={onToggleExperience}
            className={`px-6 py-3 border text-sm font-medium rounded-full transition-all flex items-center gap-2 duration-300 ${isExperienceOpen ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.1] text-white'}`}
          >
            <Play className={`w-4 h-4 ${isExperienceOpen ? 'text-emerald-400' : 'text-white/70'}`} /> Product Experience
          </button>
        </div>
      </div>

      {/* RIGHT SIDE — HERO PRODUCT EXPERIENCE */}
      <div className="w-full xl:w-[55%] relative h-[600px] sm:h-[700px] xl:h-[800px] flex items-center justify-center perspective-[2000px]">

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
    <div className={`relative w-[220px] sm:w-[260px] xl:w-[280px] aspect-[1/2.16] rounded-[2.5rem] bg-zinc-950 border-[6px] border-zinc-900 overflow-hidden shadow-2xl transition-all duration-500
      ${isActive ? 'ring-1 ring-white/20' : 'ring-1 ring-white/5 group-hover:ring-white/20'}
    `}>
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
        <div className="w-[40%] h-5 bg-zinc-900 rounded-b-2xl shadow-sm" />
      </div>
      
      {/* Hardware Reflection */}
      <div className={`absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/[0.12] z-20 pointer-events-none rounded-[2rem] transition-opacity duration-500
        ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}
      `} />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] z-20 pointer-events-none" />

      {/* Screen Content */}
      <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
          <span className="font-mono text-xs">img_missing</span>
        </div>
        <img 
          src={imageSrc} 
          alt="Mockup"
          className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 group-hover:scale-[1.02]"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
        />
      </div>
    </div>
  );
}

function WorkflowSection() {
  const steps = [
    { name: 'Prioritized Booking', desc: 'Patients book normal or emergency slots.' },
    { name: 'Smart Check-In', desc: 'Remote self check-in triggers dynamic queue.' },
    { name: 'Auto Cabin Allotment', desc: 'Cabins are instantly calculated based on live flow optimization.' },
    { name: 'Consultation', desc: 'Doctor captures prescription on a remote staff device.' },
    { name: 'AI Digitization', desc: 'Gemini API converts handwritten note to structured JSON.' },
    { name: 'Human Validated', desc: 'Receptionist verifies and approves prescription.' },
    { name: 'Auto-Reminders', desc: 'Structured data triggers automated medication alerts to patient app.' }
  ];

  return (
    <div className="py-24 max-w-6xl mx-auto px-4 w-full">
      <div className="text-center mb-16 space-y-4">
        <h2 className="font-display text-3xl md:text-5xl text-white">How the Clinko Ecosystem Works</h2>
        <p className="text-white/50 text-base md:text-lg">An uninterrupted digital bridge between clinical staff and patient care.</p>
      </div>

      <div className="relative border-l border-white/10 ml-4 sm:ml-8 md:ml-0 md:border-l-0 md:flex md:flex-wrap md:justify-center md:items-start gap-5 pt-10">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-8 md:pl-0 pb-12 md:pb-0 md:w-56 group flex-shrink-0">
            {/* Desktop Line Connector */}
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute top-[11px] left-[50%] w-[100%] h-[1px] bg-white/10" />
            )}
            
            <div className="absolute left-[-5px] top-[6px] md:relative md:left-auto md:top-auto md:mx-auto md:mb-6 w-[11px] h-[11px] rounded-full bg-emerald-500/20 border border-emerald-400 group-hover:bg-emerald-400 transition-colors duration-300 z-10" />
            
            <div className="md:text-center">
              <h4 className="font-mono uppercase tracking-widest text-[11px] text-white/80 font-semibold mb-2">{step.name}</h4>
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 to-transparent pointer-events-none" />
      <motion.h2 
        style={{ opacity, scale }}
        className="font-display text-3xl md:text-5xl text-center text-white/90 max-w-3xl leading-tight px-4 mb-12 transform-gpu will-change-transform"
      >
        Behind the scenes, a <span className="italic text-white">clinical operations layer</span> powers everything.
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
      <div className="mb-16 space-y-4 text-center sm:text-left">
        <h2 className="font-display text-4xl md:text-5xl text-white">Enterprise Administration Portal</h2>
        <p className="text-white/50 text-lg max-w-3xl">A production-grade dashboard replacing legacy hospital software with AI-assisted workflows, real-time queues, and deep analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px] sm:auto-rows-[350px]">
        {/* CARD 1 — AI Prescription Digitization */}
        <BentoCard 
          className="md:col-span-8"
          title="AI Prescription Digitization"
          desc="Google Gemini API seamlessly translates handwritten doctor notes captured from authorized staff phones into structured JSON, entering a human-audited staging workflow before auto-syncing to patients."
          chips={['Gemini Integration', 'JSON Parsing', 'Human-in-the-Loop', 'Medication Sync']}
          image="/clinko-admin-ai.png"
          onClick={() => setSelectedImage('/clinko-admin-ai.png')}
        />
        
        {/* CARD 2 — Live Queue Management */}
        <BentoCard 
          className="md:col-span-4"
          title="Queue & Cabin Intelligence"
          desc="Algorithmically manages live check-ins, calculates estimated wait times, shuffles emergency priorities, and commands automatic physical cabin dispersal."
          chips={['Live Queue', 'Cabin Flow', 'Auto-Allotment']}
          image="/clinko-admin-queue.png"
          align="top"
          onClick={() => setSelectedImage('/clinko-admin-queue.png')}
        />

        {/* CARD 3 — Analytics */}
        <BentoCard 
          className="md:col-span-4"
          title="Enterprise Analytics"
          desc="Burn rate calculations, inventory forecasting, medication success rates, and capacity utilization visualized in real-time."
          chips={['Medication Insights', 'Inventory Tracking']}
          image="/clinko-admin-analytics.png"
          onClick={() => setSelectedImage('/clinko-admin-analytics.png')}
        />

        {/* CARD 4 — Marketing & Engagement */}
        <BentoCard 
          className="md:col-span-8"
          title="Patient Re-Engagement Tracking"
          desc="Granular tracking of clinical touchpoints, allowing the clinic to orchestrate follow-up campaigns, view retention profiles, and boost satisfaction scoring."
          chips={['Loyalty Metrics', 'Patient Insights', 'Retention', 'Feedback']}
          image="/clinko-admin-patients.png"
          onClick={() => setSelectedImage('/clinko-admin-patients.png')}
        />

        {/* CARD 5 — Store Configuration */}
        <BentoCard 
          className="md:col-span-12 h-[350px]"
          title="Dynamic RBAC & Configuration Engine"
          desc="End-to-end administration layer enabling clinics to architect their personal system logic—including multi-level Role-Based Access Control, slot intervals, Razorpay integrations, and operational hours."
          chips={['Custom RBAC', 'Slot Architecture', 'Payment Setup', 'Dynamic Constraints']}
          image="/clinko-admin-config.png"
          onClick={() => setSelectedImage('/clinko-admin-config.png')}
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
        <p className="text-white/60 text-sm mb-6 max-w-lg leading-relaxed">{desc}</p>
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
        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80">Clinical Ecosystem (Staff + Patient Interfaces)</div>
        <ArrowDown className="text-white/20 w-4 h-4" />
        <div className="px-6 py-4 bg-white/5 border border-emerald-500/20 rounded-xl text-emerald-200">
          <div className="font-semibold text-white">Appwrite Backend</div>
          <div className="text-xs mt-1 text-white/50">(Auth + Realtime DB + Functions)</div>
        </div>
        <ArrowDown className="text-white/20 w-4 h-4" />
        <div className="text-xs uppercase tracking-widest text-[#a1a1aa] py-2 border-b border-white/10 w-64">Gemini API Parsing Pipeline</div>
        <ArrowDown className="text-white/20 w-4 h-4" />
        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80">Admin Verification Portal Node</div>
        <ArrowDown className="text-white/20 w-4 h-4" />
        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 text-xs">Cron/Push Notification Schedulers</div>
      </div>

      <h3 className="font-display text-2xl text-white mb-8 text-center sm:text-left">Engineering Challenges Solved</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "AI Prescription Pipeline", desc: "Coordinated remote web-socket triggers for staff phone-camera usage connected directly to Gemini multimodal extraction, parsing unreadable handwriting into strict JSON." },
          { title: "Real-time Queue Reshuffling", desc: "Designed algorithmic booking capacity windows that dynamically shift waiting estimates when emergency patients are inserted." },
          { title: "Dynamic RBAC Constraints", desc: "Implemented nested client-defined role mapping so each individual clinic can toggle platform features based on their hierarchical organization." },
          { title: "Automatic Cabin Allotment", desc: "Built server-side flow functions that map active physical cabin states to real-time doctor availability and patient consultation durations." }
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
    <div className="pb-32 pt-16 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
      <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-white leading-tight mb-12">
        A masterclass in transforming <span className="text-white/50 italic">human unpredictability</span> into systemic operational precision.
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

const EXPERIENCES = [
  {
    id: "01",
    title: "Smart Patient Journey & Onboarding",
    summary: "Complete patient profile creation and onboarding.",
    description: "What does this platform actually do? We start with the patient's perspective, where they create a new account and securely enter their medical profile details natively from their mobile device.",
    flow: [
      "Install App",
      "Create Account",
      "Enter Profile Details",
      "Secure Onboarding",
      "Patient Dashboard"
    ],
    highlights: ["Mobile First", "Secure Profile", "Seamless Onboarding"],
    strategy: "Demonstrating the core lifecycle from the patient's perspective, this flow proves how the system removes friction from the moment a patient joins the platform.",
    videoMobile: "/videos/clinko-booking-mobile.mp4",
    layoutPriority: "mobile-dominant" as const
  },
  {
    id: "02",
    title: "Smart Queue & Cabin Intelligence",
    summary: "Real-time clinic orchestration & live booking sync.",
    description: "How does the clinic run in real time? I'll create a booking from the new account on mobile, and watch it instantly reflect on the clinic portal. Then, we proceed to manage the smart queue, assign cabins, and complete the consultation.",
    flow: [
      "New Booking",
      "Instant Portal Sync",
      "Patient Check-in",
      "Live Wait Estimation",
      "Cabin Allocation",
      "Complete Consultation"
    ],
    highlights: ["Real-Time Sync", "Algorithmic Wait", "Auto Cabin Allotment"],
    strategy: "Demonstrates real-time operational intelligence and instant synchronization across platforms, replacing chaotic waiting rooms with predictable flow.",
    videoDesktop: "/videos/clinko-queue-desktop.mp4",
    videoMobile: "/videos/clinko-queue-mobile.mp4",
    layoutPriority: "side-by-side" as const
  },
  {
    id: "03",
    title: "AI Prescription Intelligence",
    summary: "Transform handwritten notes to structured JSON.",
    description: "What makes this SaaS different? Our Gemini AI integration allows staff to snap a photo of any handwritten prescription. We extract the medicine schedule automatically, keeping a human in the loop for safety, and sync it to the patient's app as actionable reminders.",
    flow: [
      "Upload Prescription",
      "Gemini Processing",
      "Medicine Extraction",
      "Structured Schedule",
      "Patient Reminder"
    ],
    highlights: ["Gemini AI API", "Image to JSON", "Human Validated"],
    strategy: "Demonstrates real-world AI solving a major healthcare problem: unreadable handwriting resulting in missed medications.",
    videoDesktop: "/videos/clinko-ai-desktop.mp4",
    videoMobile: "/videos/clinko-ai-mobile.mp4",
    layoutPriority: "side-by-side" as const
  },
  {
    id: "04",
    title: "Clinic Configuration Engine",
    summary: "Dynamic customization & settings.",
    description: "How customizable is the platform? Deep dive into operating hours, slot intervals, capacity logic, and automated payment controls.",
    flow: [
      "Operating Hours",
      "Slot Logic",
      "Cabin Capacity",
      "Consultation Timing",
      "Payments",
      "Automation Rules"
    ],
    highlights: ["Razorpay Integration", "Interval Logic"],
    strategy: "Shows enterprise SaaS maturity. Every clinic operates differently, and the configuration engine allows total flexibility.",
    videoDesktop: "/videos/clinko-config-desktop.mp4",
    layoutPriority: "desktop-dominant" as const
  },
  {
    id: "05",
    title: "Staff Access & Role Management",
    summary: "Scalable collaboration and access control.",
    description: "How does collaboration work? The administrator can add new staff, generate unique IDs, and assign specific portal permissions to doctors, receptionists, or admins.",
    flow: [
      "Add Staff",
      "Assign Role",
      "Permission Control",
      "Portal Access",
      "Operational Sync"
    ],
    highlights: ["RBAC", "Multi-user"],
    strategy: "Demonstrates hierarchical Role-Based Access Control and a scalable enterprise multi-user architecture.",
    videoDesktop: "/videos/clinko-roles-desktop.mp4",
    videoMobile: "/videos/clinko-roles-mobile.mp4",
    layoutPriority: "side-by-side" as const
  },
  {
    id: "06",
    title: "Analytics & Clinic Intelligence",
    summary: "Data-driven business decisions.",
    description: "What insights does the clinic get? Track revenue growth, patient retention, medicine inventory success, and loyalty metrics.",
    flow: [
      "Clinic Overview",
      "Growth Trends",
      "Financial Analytics",
      "Inventory Insights",
      "Patient Satisfaction"
    ],
    highlights: ["Business Intelligence", "Retention Tracking"],
    strategy: "Show enterprise-grade BI that moves this from a simple management tool to a growth-oriented SaaS.",
    videoDesktop: "/videos/clinko-analytics-desktop.mp4",
    layoutPriority: "desktop-dominant" as const
  }
];

function DualDeviceShowcase({ srcDesktop, srcMobile, priority }: { srcDesktop?: string, srcMobile?: string, priority: 'balanced' | 'desktop-dominant' | 'side-by-side' | 'mobile-dominant' }) {
  const desktopRef = useRef<HTMLVideoElement>(null);
  const mobileRef = useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (priority === 'side-by-side' && desktopRef.current && mobileRef.current) {
      desktopRef.current.currentTime = 0;
      mobileRef.current.currentTime = 0;
      desktopRef.current.play().catch(() => {});
      mobileRef.current.play().catch(() => {});
    }
  }, [srcDesktop, srcMobile, priority]);

  if (priority === 'mobile-dominant' && srcMobile) {
    return (
      <div className="relative w-full h-full min-h-[400px] md:min-h-[550px] flex items-center justify-center py-8 z-10 perspective-[1200px]">
        <div className="w-[60%] md:w-[35%] max-w-[340px] aspect-[1/2.16] rounded-[2rem] md:rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.9)] border-[6px] border-zinc-800 bg-black overflow-hidden z-20 transform-gpu hover:scale-[1.02] hover:-translate-y-2 transition-all duration-700 ease-[0.23,1,0.32,1] mx-auto">
           <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
             <div className="w-[40%] h-5 bg-zinc-800 rounded-b-2xl shadow-sm" />
           </div>
           
           <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/[0.12] z-20 pointer-events-none rounded-[1.5rem] md:rounded-[2rem] opacity-100 transition-opacity duration-500" />
           <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[1.5rem] md:rounded-[2rem] z-20 pointer-events-none" />

           <VideoPlayer src={srcMobile} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-95 transform-gpu will-change-transform" />
        </div>
      </div>
    );
  }

  if (priority === 'side-by-side') {
    return (
      <div className="relative w-full flex flex-col xl:flex-row items-center justify-center gap-8 xl:gap-12 py-8 z-10">
        {/* Desktop */}
        <div className="w-full xl:w-[75%] max-w-5xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 bg-black overflow-hidden relative">
           <div className="bg-zinc-900/90 px-4 py-2 border-b border-white/5 flex items-center gap-2">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 hover:bg-red-500 transition-colors" />
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 hover:bg-yellow-500 transition-colors" />
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 hover:bg-green-500 transition-colors" />
             </div>
           </div>
           <VideoPlayer ref={desktopRef} src={srcDesktop} autoPlay muted loop playsInline className="w-full aspect-video object-contain bg-zinc-950 opacity-90 transform-gpu will-change-transform" />
           <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-xl" />
        </div>
        {/* Mobile */}
        {srcMobile && (
          <div className="w-[40%] sm:w-[35%] xl:w-[22%] max-w-[260px] aspect-[1/2.16] rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-[6px] border-zinc-800 bg-black overflow-hidden relative shrink-0">
             <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-50">
               <div className="w-[40%] h-4 bg-zinc-800 rounded-b-xl" />
             </div>
             <VideoPlayer ref={mobileRef} src={srcMobile} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-95 transform-gpu will-change-transform" />
          </div>
        )}
      </div>
    );
  }

  if (priority === 'balanced') {
    return (
      <div className="relative w-full h-full min-h-[450px] md:min-h-[600px] flex items-center justify-center py-8 z-10 perspective-[1200px]">
        {/* Desktop */}
        <div className="absolute left-[2%] md:left-[5%] w-[85%] md:w-[75%] max-w-5xl aspect-video rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 bg-black overflow-hidden z-10 -translate-y-[5%] -rotate-[2deg] hover:rotate-0 hover:z-30 transition-all duration-700 ease-[0.23,1,0.32,1]">
           <div className="bg-zinc-900/90 px-4 py-2 border-b border-white/5 flex items-center gap-2">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 hover:bg-red-500 transition-colors" />
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 hover:bg-yellow-500 transition-colors" />
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 hover:bg-green-500 transition-colors" />
             </div>
           </div>
           <VideoPlayer src={srcDesktop} autoPlay muted loop playsInline className="w-full h-full object-contain bg-zinc-950 opacity-90 transform-gpu will-change-transform" />
           <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-xl" />
        </div>
        {/* Mobile */}
        <div className="absolute right-[2%] md:right-[10%] w-[35%] min-w-[150px] md:min-w-[240px] max-w-[280px] aspect-[1/2.16] rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.9)] border-[6px] border-zinc-800 bg-black overflow-hidden z-20 translate-y-[10%] rotate-[4deg] hover:rotate-0 hover:scale-105 transition-all duration-700 ease-[0.23,1,0.32,1]">
           <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-50">
             <div className="w-[40%] h-4 bg-zinc-800 rounded-b-xl" />
           </div>
           <VideoPlayer src={srcMobile} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-95 transform-gpu will-change-transform" />
        </div>
      </div>
    );
  }

  // Desktop dominant
  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[550px] flex items-center justify-center py-8 z-10 perspective-[1200px]">
        <div className="w-full max-w-5xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 bg-black overflow-hidden z-10 mx-auto transform-gpu hover:scale-[1.02] hover:-translate-y-2 transition-all duration-700 ease-[0.23,1,0.32,1]">
           <div className="bg-zinc-900/90 px-4 py-2 border-b border-white/5 flex items-center gap-2">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 hover:bg-red-500 transition-colors" />
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 hover:bg-yellow-500 transition-colors" />
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 hover:bg-green-500 transition-colors" />
             </div>
           </div>
           <VideoPlayer src={srcDesktop} autoPlay muted loop playsInline className="w-full aspect-video object-contain bg-zinc-950 opacity-90 transform-gpu will-change-transform" />
           <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-xl" />
        </div>
    </div>
  );
}

function ProductExperienceSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16 space-y-4">
        <h2 className="font-display text-4xl md:text-5xl text-white">Interactive Product Walkthrough</h2>
        <p className="text-white/50 text-lg">Exploring the clinical platform end-to-end.</p>
      </div>

      <div className="flex flex-col space-y-4">
        {EXPERIENCES.map((exp, idx) => {
          const isActive = activeIndex === idx;
          return (
            <div key={exp.id} className={`border ${isActive ? 'border-white/10 bg-white/[0.02] shadow-2xl' : 'border-white/5 bg-transparent'} rounded-3xl overflow-hidden transition-all duration-700 ease-[0.23,1,0.32,1]`}>
              <button 
                onClick={() => setActiveIndex(isActive ? -1 : idx)}
                className="w-full px-6 py-6 md:p-8 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-6">
                  <span className={`font-mono text-xl ${isActive ? 'text-emerald-400' : 'text-white/20 group-hover:text-white/40'} transition-colors duration-300`}>{exp.id}</span>
                  <div>
                    <h3 className={`font-display text-xl md:text-2xl transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{exp.title}</h3>
                    {!isActive && <p className="text-white/40 text-sm mt-1">{exp.summary}</p>}
                  </div>
                </div>
                <motion.div animate={{ rotate: isActive ? 45 : 0 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}>
                   <Plus className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white/30 group-hover:text-white/60'} transition-colors duration-300`} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden transform-gpu will-change-[height,opacity]"
                  >
                    <div className="px-6 pb-8 md:px-8 md:pb-12 flex flex-col gap-12 lg:gap-16 items-center border-t border-white/5 pt-12 mt-2">
                       
                       {/* TOP VISUALS */}
                       <div className="w-full xl:w-[90%] h-full min-h-[400px] flex items-center justify-center">
                         <DualDeviceShowcase srcDesktop={exp.videoDesktop} srcMobile={exp.videoMobile} priority={exp.layoutPriority as any} />
                       </div>

                       {/* BOTTOM CONTENT */}
                       <div className="w-full pt-8 border-t border-white/[0.03]">
                         <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
                           
                           {/* Content Info */}
                           <div className="md:col-span-5 space-y-6">
                             <div className="flex flex-wrap gap-2">
                               {exp.highlights.map(h => (
                                 <span key={h} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] font-mono text-emerald-300">
                                   {h}
                                 </span>
                               ))}
                             </div>
                             <p className="text-white/70 text-base leading-relaxed">
                               {exp.description}
                             </p>
                           </div>

                           {/* Flow */}
                           <div className="md:col-span-4">
                             <h4 className="text-white/30 font-mono text-xs uppercase tracking-widest mb-4">Flow Mapping</h4>
                             <div className="flex flex-wrap gap-2">
                               {exp.flow.map((step, i) => (
                                 <React.Fragment key={i}>
                                    <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[11px] font-medium text-white/80 shrink-0">
                                      {step}
                                    </span>
                                    {i < exp.flow.length - 1 && <ArrowRight className="w-3 h-3 text-white/20 my-auto shrink-0" />}
                                 </React.Fragment>
                               ))}
                             </div>
                           </div>

                           {/* Strategy */}
                           <div className="md:col-span-3 bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl h-fit">
                             <h4 className="text-white/80 font-medium text-sm mb-2">Strategy & Impact</h4>
                             <p className="text-white/50 text-sm leading-relaxed">{exp.strategy}</p>
                           </div>
                           
                         </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

