import React from 'react';

interface NavbarProps {
  onNavClick: (sectionId: string) => void;
  activeSection: string;
}

export default function Navbar({ onNavClick, activeSection }: NavbarProps) {
  const navItems = [
    { label: 'Story', id: 'story' },
    { label: 'Products', id: 'products' },
    { label: 'Process', id: 'process' },
    { label: 'Services', id: 'services' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-55 bg-background/20 backdrop-blur-md border-b border-white/[0.04]">
      <nav 
        id="navbar-container"
        className="relative z-50 flex justify-between items-center px-8 py-5 max-w-7xl mx-auto"
      >
        {/* Boutique Product Studio Logo */}
        <button 
          id="nav-logo"
          onClick={() => onNavClick('hero')} 
          className="text-left font-display text-3xl tracking-tight text-foreground hover:opacity-95 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20 transition-all"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Gaurav Vedi<sup className="text-sm font-sans tracking-normal ml-0.5 pointer-events-none">®</sup>
        </button>

        {/* Desktop Navigation Links */}
        <div id="desktop-nav" className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onNavClick(item.id)}
              className={`text-sm tracking-wide cursor-pointer py-1.5 transition-colors focus:outline-none focus-visible:text-foreground hover:text-foreground ${
                activeSection === item.id 
                  ? 'text-white font-medium' 
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Navigation CTA: Build With Me */}
        <button
          id="nav-cta-btn"
          onClick={() => onNavClick('contact')}
          className="liquid-glass liquid-glass-hover text-white text-sm font-medium px-6 py-2.5 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          Build With Me
        </button>
      </nav>
    </header>
  );
}
