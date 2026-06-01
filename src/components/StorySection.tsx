import React from 'react';

export default function StorySection() {
  return (
    <section 
      id="story" 
      className="relative py-32 px-6 bg-slate-950/40 border-t border-white/[0.02] overflow-hidden"
    >
      {/* Subtle background ambient line */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-white/[0.04] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Label */}
        <div id="story-label" className="flex items-center gap-3 mb-16">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-medium">
            01 / The Story
          </span>
        </div>

        {/* Narrative columns */}
        <div id="story-grid" className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-stretch">
          
          {/* Big Editorial Quote */}
          <div className="col-span-1 md:col-span-12 mb-8">
            <h2 
              id="story-headline"
              className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05] text-white font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              "We live in a world saturated with templates. I believe ambitious products demand custom conviction."
            </h2>
          </div>

          {/* Left Column: Core philosophy */}
          <div className="col-span-1 md:col-span-7 flex flex-col justify-start space-y-6">
            <p className="text-lg text-zinc-300 font-normal leading-relaxed">
              Most digital products today look nearly identical. They share the same generic layout libraries, the same cold patterns, and the same uninspired user journeys. They are designed for speed but lack soul.
            </p>
            <p className="text-zinc-400 text-base leading-relaxed">
              My practice is built on a simple premise: <strong className="text-white font-medium">doing the hard thing beautifully</strong>. I operate as a single point of intelligence—unifying rigorous product design with precise TypeScript development. By bridging the traditional gap between design mockups and actual clean react engineering, I build dynamic experiences that carry structural integrity and cinematic grace.
            </p>
            <p className="text-zinc-400 text-base leading-relaxed">
              Whether sketching spatial workflows for multi-dimensional layout systems, profiling layout rendering, or tuning system telemetry streams, I focus on the silent details.
            </p>
          </div>

          {/* Right Column: Key metrics/principles */}
          <div className="col-span-1 md:col-span-5 flex flex-col justify-between bg-zinc-900/20 border border-white/[0.05] p-8 rounded-2xl backdrop-blur-sm">
            <div className="space-y-8">
              <h3 className="text-sm uppercase tracking-widest text-zinc-500 font-medium">Core Convictions</h3>
              
              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm">Chaos to Integrity</h4>
                <p className="text-zinc-400 text-xs leading-normal">
                  No project arrives fully framed. I specialize in digesting vague, complicated business objectives and carving out robust, intuitive interface architectures that engineers enjoy implementing.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm">Zero Latency Feedback</h4>
                <p className="text-zinc-400 text-xs leading-normal">
                  Interaction physics shouldn't be an afterthought. Everything I deploy behaves predictably, scales responsively, and responds in micro-time loops.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm">Quiet Excellence</h4>
                <p className="text-zinc-400 text-xs leading-normal">
                  No empty jargon, no flash-in-the-pan design trends, and no premature optimizations. Just functional, highly resilient code that works seamlessly for real users.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/[0.04] flex items-center justify-between text-xs text-zinc-500">
              <span>Gaurav Vedi</span>
              <span>EST. 2019</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
