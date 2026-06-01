import React, { useState } from 'react';
import { processSteps } from '../data';
import { Check, Compass, Workflow, Code, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState<string>('01');

  const getStepIcon = (num: string) => {
    switch (num) {
      case '01': return <Compass className="w-5 h-5 text-zinc-400" />;
      case '02': return <Workflow className="w-5 h-5 text-zinc-400" />;
      case '03': return <Code className="w-5 h-5 text-zinc-400" />;
      case '04': return <CheckCircle className="w-5 h-5 text-zinc-400" />;
      default: return <Check className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <section 
      id="process" 
      className="relative py-32 px-6 bg-slate-950/40 border-t border-b border-white/[0.02]"
    >
      {/* Background grid line */}
      <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div id="process-header" className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-medium">
              03 / The Process
            </span>
          </div>
          
          <h2 
            id="process-title"
            className="text-4xl sm:text-5xl md:text-6xl tracking-tight text-white font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            From chaos to clarity.
          </h2>
        </div>

        {/* Process Steps Accordion Column */}
        <div id="process-steps" className="space-y-4">
          {processSteps.map((step) => {
            const isOpen = activeStep === step.number;
            return (
              <div 
                key={step.number}
                id={`process-step-${step.number}`}
                onClick={() => setActiveStep(isOpen ? '' : step.number)}
                className={`group border rounded-2xl cursor-pointer transition-all duration-300 ${
                  isOpen 
                    ? 'border-white/10 bg-zinc-900/10 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.3)]' 
                    : 'border-white/[0.03] bg-transparent hover:border-white/[0.08]'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between p-6 sm:p-8">
                  <div className="flex items-center gap-6 sm:gap-10">
                    {/* Big beautiful number */}
                    <span 
                      className={`text-3xl sm:text-5xl font-italic select-none transition-colors duration-300 ${
                        isOpen ? 'text-white font-normal' : 'text-zinc-600 group-hover:text-zinc-400'
                      }`}
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {step.number}
                    </span>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <h3 className="text-base sm:text-lg text-zinc-200 font-medium">
                        {step.title}
                      </h3>
                      <span className="text-[10px] tracking-wider font-mono text-zinc-500 uppercase bg-white/[0.02] border border-white/[0.04] px-2.5 py-0.5 rounded-full max-w-max">
                        {step.duration}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="hidden sm:inline-block">
                      {getStepIcon(step.number)}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    )}
                  </div>
                </div>

                {/* Expanded Details Body */}
                <div 
                  className={`grid transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 border-t border-white/[0.04]' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 sm:p-8 pt-0 space-y-6">
                      {/* Description */}
                      <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mt-6">
                        {step.description}
                      </p>

                      {/* Deliverables checklist */}
                      <div className="space-y-3 pt-4">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block">
                          Core Deliverables
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {step.deliverables.map((item, idx) => (
                            <div 
                              key={idx}
                              className="flex items-center gap-3 bg-zinc-950/40 p-3 rounded-lg border border-white/[0.03]"
                            >
                              <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <span className="text-zinc-300 text-xs font-mono tracking-tight leading-none">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
