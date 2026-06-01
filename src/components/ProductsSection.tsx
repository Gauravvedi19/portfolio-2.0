import React, { useState } from 'react';
import { projects } from '../data';
import { Project } from '../types';
import { ArrowUpRight, Scale, Clock, Terminal, ChevronRight, X, Sparkles } from 'lucide-react';

export default function ProductsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section 
      id="products" 
      className="relative py-32 px-6 bg-background overflow-hidden"
    >
      {/* Subtle overlay vignette */}
      <div className="absolute inset-0 bg-radial-gradient(circle_at_bottom,rgba(15,23,42,0.1)_0%,rgba(10,15,30,0.4)_100%) pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div id="products-header" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-medium">
                02 / The Work
              </span>
            </div>
            
            <h2 
              id="products-title"
              className="text-4xl sm:text-5xl md:text-6xl tracking-tight text-white font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Ambitious releases.
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            A small, highly specific selection of core platforms engineered with uncompromising attention to telemetry, interaction responsiveness, and layout systems.
          </p>
        </div>

        {/* Cinematic Projects Grid */}
        <div id="projects-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              onClick={() => setSelectedProject(project)}
              className="group relative flex flex-col justify-between bg-zinc-900/10 border border-white/[0.04] hover:border-white/[0.08] p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:bg-white/[0.01]"
            >
              {/* Product Frame Placeholder - Styled like an elegant dark visual canvas */}
              <div 
                className={`w-full aspect-[16/10] rounded-xl bg-gradient-to-br ${project.imagePlaceholderColor} border border-white/[0.04] p-6 mb-8 relative overflow-hidden flex flex-col justify-between group-hover:border-white/[0.08] transition-all duration-500`}
              >
                {/* Visual noise/grid subtle lines to represent blueprints */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

                {/* Grid header */}
                <div className="flex justify-between items-center relative z-2">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">
                    System Node // {index + 1}
                  </span>
                  {project.metric && (
                    <span className="text-[10px] uppercase tracking-widest text-[#a1a1aa] font-mono border border-white/[0.08] bg-zinc-950/40 px-2 py-0.5 rounded">
                      {project.metric}
                    </span>
                  )}
                </div>

                {/* Ambient Center Graphic representation - Editorial lines */}
                <div className="my-auto flex flex-col items-center justify-center space-y-4 py-6 relative z-1">
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all duration-500" />
                  <p 
                    className="text-white text-3xl tracking-tight opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {project.title}
                  </p>
                  <p className="text-zinc-500 text-[10px] tracking-widest uppercase font-mono max-w-[200px] text-center">
                    {project.subtitle}
                  </p>
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-white/10 transition-all duration-500" />
                </div>

                {/* Small indicator */}
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono relative z-2">
                  <span>ROLE: {project.role.toUpperCase()}</span>
                  <span className="flex items-center gap-1">
                    VIEW SPEC
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-normal text-white">{project.title}</h3>
                  <span className="text-xs text-zinc-500 font-mono">{project.year}</span>
                </div>
                
                <p className="text-zinc-400 text-sm leading-relaxed min-h-[4rem]">
                  {project.description}
                </p>

                {/* Project Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/[0.02] border border-white/[0.03] text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Highly Interactive Blueprint Modal Spec Sheet overlay */}
        {selectedProject && (
          <div 
            id="blueprint-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <div 
              className="w-full max-w-3xl bg-zinc-950 border border-white/10 p-8 sm:p-10 rounded-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cinematic lines */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              
              {/* Close Button */}
              <button 
                id="close-modal-btn"
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close modal spec sheet"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="space-y-8">
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-500 font-mono block mb-2">
                    System Architecture Spec
                  </span>
                  <div className="flex items-baseline gap-4">
                    <h2 
                      className="text-4xl text-white font-normal"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {selectedProject.title}
                    </h2>
                    <span className="text-xs text-zinc-500 font-mono">
                      Released / {selectedProject.year}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Diagnostic Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/[0.06]">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">
                      My Capacity
                    </span>
                    <span className="text-white text-sm font-medium">
                      {selectedProject.role}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">
                      System Metric
                    </span>
                    <span className="text-white text-sm font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                      {selectedProject.metric || 'Validated Perfect Output'}
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">
                      Platform Tech
                    </span>
                    <span className="text-white text-sm font-medium">
                      {selectedProject.tags.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Substantive text outlining the process */}
                <div className="space-y-4 pt-6 border-t border-white/[0.06] bg-zinc-900/10 p-5 rounded-lg border border-white/[0.03]">
                  <h4 className="text-zinc-300 text-xs uppercase font-mono tracking-wider flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                    How It Was Crafted
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Designed entirely with custom Figma grid components under extreme variable parameters. Prototyped to validate spatial layout hierarchies, then transferred to a customized modular TypeScript server layer to secure performance objectives. Features direct-to-memory caching strategies, customized web socket feeds for lightweight frame telemetry, and localized key-value index preservation.
                  </p>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-5 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer font-mono"
                  >
                    CLOSE // ESC
                  </button>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-6 py-2.5 text-xs font-semibold rounded-full bg-white text-zinc-950 hover:bg-zinc-100 transition-all cursor-pointer shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
                  >
                    Acknowledge Spec
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
