import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Github, ExternalLink, Download } from 'lucide-react';

interface ProjectLinks {
  github?: string;
  portal?: string;
  demoEmail?: string;
  demoPassword?: string;
  appDownload?: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  links: ProjectLinks;
}

export function ProjectModal({ isOpen, onClose, title, links }: ProjectModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 z-[101] shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display text-white">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <a
                href={links.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 w-full p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl text-white transition-colors group"
              >
                <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Github className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">GitHub Repository</div>
                  <div className="text-xs text-white/50">View source code</div>
                </div>
              </a>

              <a
                href={links.portal || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 w-full p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl text-white transition-colors group"
              >
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">Try Portal</div>
                  <div className="text-xs text-white/50 mt-1">
                    Email: <span className="text-white/80 select-all">{links.demoEmail}</span><br />
                    Password: <span className="text-white/80 select-all">{links.demoPassword}</span>
                  </div>
                </div>
              </a>

              <a
                href={links.appDownload || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 w-full p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl text-white transition-colors group"
              >
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                  <Download className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">Download App</div>
                  <div className="text-xs text-white/50">Get the mobile application</div>
                </div>
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
