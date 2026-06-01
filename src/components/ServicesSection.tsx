import React from 'react';
import { services } from '../data';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ServicesProps {
  onContactClick: () => void;
}

export default function ServicesSection({ onContactClick }: ServicesProps) {
  return (
    <section 
      id="services" 
      className="relative py-32 px-6 bg-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div id="services-header" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-medium">
                04 / Services
              </span>
            </div>
            
            <h2 
              id="services-title"
              className="text-4xl sm:text-5xl md:text-6xl tracking-tight text-white font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              How we can partner.
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            Direct, specialized, and high-impact arrangements. Standardized weekly sprints or modular project fees ensuring predictable timelines and zero friction.
          </p>
        </div>

        {/* Services Grid */}
        <div id="services-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              id={`service-card-${index}`}
              className="group flex flex-col justify-between bg-zinc-900/10 border border-white/[0.04] p-8 sm:p-10 rounded-2xl relative overflow-hidden backdrop-blur-sm transition-all hover:border-white/[0.08]"
            >
              {/* Card visual elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/[0.02] to-transparent pointer-events-none" />
              
              <div className="space-y-6">
                {/* Service Category Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase">
                    ARRANGEMENT // {service.type.toUpperCase()}
                  </span>
                  <span 
                    className="text-2xl text-zinc-700 select-none group-hover:text-zinc-500 transition-colors"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    I{index === 1 ? 'I' : index === 2 ? 'II' : ''}
                  </span>
                </div>

                <h3 className="text-xl text-white font-normal tracking-tight leading-snug">
                  {service.title}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Capabilities list */}
                <div className="space-y-2.5 pt-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block">
                    Core Focus
                  </span>
                  <ul className="space-y-2">
                    {service.capabilities.map((cap, capIdx) => (
                      <li key={capIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <span className="w-1 h-1 rounded-full bg-zinc-500 mt-2 shrink-0 animate-pulse" />
                        <span className="leading-tight">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center justify-between">
                <button
                  onClick={onContactClick}
                  className="text-xs font-mono text-white tracking-widest uppercase flex items-center gap-2 cursor-pointer group/btn"
                >
                  Configure Partnership
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Ambient bottom box */}
        <div 
          id="services-consultation-banner"
          className="mt-16 bg-gradient-to-r from-zinc-900/10 via-slate-900/10 to-zinc-900/10 border border-white/[0.03] p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl text-zinc-400 hidden sm:block">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white text-base font-medium">Need a highly custom project design & build spec?</h3>
              <p className="text-xs text-zinc-500 mt-1">Book an introductory 25-minute late-night product audit. Let's filter out the fluff.</p>
            </div>
          </div>
          <button
            onClick={onContactClick}
            className="w-full md:w-auto px-6 py-3 text-xs font-mono uppercase bg-white text-zinc-950 font-semibold rounded-full hover:bg-zinc-100 transition-all hover:scale-[1.03] cursor-pointer"
          >
            Request Diagnostic Call
          </button>
        </div>

      </div>
    </section>
  );
}
