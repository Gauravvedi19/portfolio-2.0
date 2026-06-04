import React, { useState } from 'react';
import { Send, CheckCircle, Terminal, RefreshCw, MessageSquare } from 'lucide-react';
import { MessageFormData } from '../types';

export default function ContactSection() {
  const [formData, setFormData] = useState<MessageFormData>({
    name: '',
    email: '',
    company: '',
    message: '',
    projectType: 'SaaS Interface',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loggedMessages, setLoggedMessages] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('gaurav_vedi_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const projectTypes = [
    'SaaS Interface',
    'Hardware OS Client',
    'Figma-to-React Code',
    'Technical Advising',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all required fields.'); // Fallback, but let's make a beautiful inline error instead
      return;
    }

    setIsSubmitting(true);

    // Simulate luxury API response / late night processor delay
    setTimeout(() => {
      const newMessage = {
        ...formData,
        id: Math.random().toString(36).substring(4),
        timestamp: new Date().toLocaleTimeString(),
      };

      const updated = [newMessage, ...loggedMessages];
      setLoggedMessages(updated);
      try {
        localStorage.setItem('gaurav_vedi_messages', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to write message to local storage');
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
        projectType: 'SaaS Interface',
      });
    }, 1500);
  };

  const clearMessages = () => {
    localStorage.removeItem('gaurav_vedi_messages');
    setLoggedMessages([]);
  };

  return (
    <section 
      id="contact" 
      className="relative py-32 px-6 bg-slate-950/40 border-t border-white/[0.02]"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div id="contact-header" className="max-w-xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-medium">
              05 / Transmission
            </span>
          </div>
          
          <h2 
            id="contact-title"
            className="text-4xl sm:text-5xl md:text-6xl tracking-tight text-white font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Start the conversation.
          </h2>
          <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
            I review all transmissions directly. Describe the parameters of your venture, the current bottlenecks, and how you define success.
          </p>
        </div>

        <div id="contact-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Premium Contact Form */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div 
                id="contact-success"
                className="bg-zinc-900/10 border border-white/[0.08] p-8 sm:p-12 rounded-2xl backdrop-blur-sm text-center space-y-6 animate-fade-in"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center text-zinc-400">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 
                    className="text-white text-3xl font-normal"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    Transmission Secured.
                  </h3>
                  <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you. I typically process proposals between 10:00 PM and 2:00 AM EST. You will receive a diagnostic response shortly.
                  </p>
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 text-xs font-mono uppercase bg-white text-zinc-950 font-semibold rounded-full hover:bg-zinc-100 cursor-pointer transition-all hover:scale-[1.03]"
                  >
                    Send Another Telegram
                  </button>
                </div>
              </div>
            ) : (
              <form 
                id="contact-form"
                onSubmit={handleSubmit}
                className="space-y-6 bg-zinc-900/10 border border-white/[0.04] p-8 sm:p-10 rounded-2xl backdrop-blur-sm"
              >
                {/* Form header/instruction */}
                <div className="pb-4 flex items-center justify-between border-b border-white/[0.04]">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">
                    Transmission parameters // EST
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 animate-pulse">
                    ● ENCRYPTED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                      Your Name <span className="text-zinc-600">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Liam Vance"
                      className="w-full bg-zinc-950 border border-white/[0.06] focus:border-white/20 text-white placeholder-zinc-700 text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-0 transition-colors"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                      Email Address <span className="text-zinc-600">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. liam@venture.co"
                      className="w-full bg-zinc-950 border border-white/[0.06] focus:border-white/20 text-white placeholder-zinc-700 text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-0 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Company field */}
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                      Venture / Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Linear Labs"
                      className="w-full bg-zinc-950 border border-white/[0.06] focus:border-white/20 text-white placeholder-zinc-700 text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-0 transition-colors"
                    />
                  </div>

                  {/* Project Type selector */}
                  <div className="space-y-2">
                    <label htmlFor="projectType" className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                      Core Objective
                    </label>
                    <select
                      id="projectType"
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/[0.06] focus:border-white/20 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-0 transition-colors cursor-pointer appearance-none"
                    >
                      {projectTypes.map((t) => (
                        <option key={t} value={t} className="bg-zinc-950 text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                    Venture Parameters & Bottlenecks <span className="text-zinc-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe what chaotic ideas we are turning into products..."
                    className="w-full bg-zinc-950 border border-white/[0.06] focus:border-white/20 text-white placeholder-zinc-700 text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-0 transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  id="submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-xs font-mono uppercase bg-white text-zinc-950 font-semibold rounded-full hover:bg-zinc-100 transition-all hover:scale-[1.01] active:translate-y-0 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(255,255,255,0.06)]"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-950" />
                      Securing Spec Telegram...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-zinc-950" />
                      Transmit Objectives
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Dynamic Transmission logs (Local Storage Feed) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            
            {/* Quick Contact Info card */}
            <div className="bg-zinc-900/10 border border-white/[0.04] p-6 rounded-2xl space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-mono text-zinc-500">
                Direct Channels
              </h3>
              
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-2 border-b border-white/[0.03]">
                  <span className="text-zinc-500">EMAIL:</span>
                  <a href="mailto:gaurav.vedi2003@gmail.com" className="hover:text-white transition-colors text-zinc-300">
                    gaurav.vedi2003@gmail.com
                  </a>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/[0.03]">
                  <span className="text-zinc-500">LOCATION:</span>
                  <span className="text-zinc-300">Late night / Anywhere UTC</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500">GITHUB:</span>
                  <a href="https://github.com/gaurav-vedi" target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-white transition-colors">
                    github.com/gaurav-vedi
                  </a>
                </div>
              </div>
            </div>

            {/* Transmission History Logs - Proof of functional code rendering */}
            <div className="bg-zinc-950/80 border border-white/[0.06] p-6 rounded-2xl relative overflow-hidden space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                  Local Spec Database
                </span>
                {loggedMessages.length > 0 && (
                  <button 
                    onClick={clearMessages}
                    className="text-[10px] text-zinc-600 hover:text-zinc-400 font-mono transition-colors cursor-pointer"
                  >
                    CLEAR LOGS
                  </button>
                )}
              </div>

              <div className="max-h-[220px] overflow-y-auto space-y-3.5 pr-2">
                {loggedMessages.length === 0 ? (
                  <div className="text-center py-8 text-zinc-600 text-xs font-mono space-y-2">
                    <MessageSquare className="w-5 h-5 mx-auto text-zinc-700 animate-pulse" />
                    <p>No active transmissions logged in local database.</p>
                    <p className="text-[10px] text-zinc-800">Submit the telegram form to audit inputs here instantly.</p>
                  </div>
                ) : (
                  loggedMessages.map((msg, index) => (
                    <div 
                      key={msg.id || index}
                      className="text-[11px] font-mono bg-white/[0.01] border border-white/[0.04] p-3.5 rounded-lg space-y-2 animate-fade-in"
                    >
                      <div className="flex items-center justify-between text-[#8a8a93]">
                        <span className="font-bold text-white uppercase">{msg.name}</span>
                        <span>{msg.timestamp || 'Logged'}</span>
                      </div>
                      
                      <div className="text-[10px] text-zinc-500 flex flex-wrap gap-2">
                        <span>OBJ: <strong className="text-zinc-400">{msg.projectType}</strong></span>
                        {msg.company && <span>CO: <strong className="text-zinc-400">{msg.company}</strong></span>}
                      </div>

                      <p className="text-zinc-400 text-xs italic border-l border-white/10 pl-3 py-1 mt-1 leading-normal break-words">
                        "{msg.message}"
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Console note footer */}
              <div className="text-[9px] font-mono text-zinc-600 uppercase text-center pt-2 border-t border-white/[0.03] select-none">
                Reactive Browser State Persistent Index v1.0.4
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
