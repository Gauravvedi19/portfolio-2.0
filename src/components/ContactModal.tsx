import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Linkedin, Github, Mail, Phone } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
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
              <h3 className="text-xl font-display text-white">Let's Build</h3>
              <button
                onClick={onClose}
                className="p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 w-full p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl text-white transition-colors group"
              >
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">LinkedIn</div>
                  <div className="text-xs text-white/50">Connect professionally</div>
                </div>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 w-full p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl text-white transition-colors group"
              >
                <div className="p-3 bg-white/10 text-white rounded-lg group-hover:bg-white/20 transition-colors">
                  <Github className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">GitHub</div>
                  <div className="text-xs text-white/50">View repositories</div>
                </div>
              </a>

              <a
                href="mailto:gaurav.vedi2003@gmail.com"
                className="flex items-center gap-4 w-full p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl text-white transition-colors group"
              >
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">Email</div>
                  <div className="text-xs text-white/80 select-all">gaurav.vedi2003@gmail.com</div>
                </div>
              </a>

              <a
                href="tel:+916378640389"
                className="flex items-center gap-4 w-full p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl text-white transition-colors group"
              >
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">Phone</div>
                  <div className="text-xs text-white/80 select-all">+91 6378640389</div>
                </div>
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
