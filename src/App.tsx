/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Scene1Spark from './components/scenes/Scene1Spark';
import Scene2Chaos from './components/scenes/Scene2Chaos';
import Scene3Clarity from './components/scenes/Scene3Clarity';
import Scene5Products from './components/scenes/Scene5Products';
import SceneAbout from './components/scenes/SceneAbout';
import SceneSkills from './components/scenes/SceneSkills';
import Scene7CTA from './components/scenes/Scene7CTA';

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05,
      // @ts-ignore
      smoothWheel: true,
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    return () => lenis.destroy();
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-white/20">
      {/* Premium Ambient Background Glow (Subtle) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_10%_110%,rgba(56,189,248,0.1),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_90%_50%,rgba(168,85,247,0.05),rgba(255,255,255,0))]" />
      </div>

      {/* Light Noise Overlay for Cinematic Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50"></div>
      
      <main className="relative z-10 w-full">
        <Scene1Spark />
        <Scene2Chaos />
        <Scene3Clarity />
        <Scene5Products />
        <SceneAbout />
        <SceneSkills />
        <Scene7CTA />
      </main>
    </div>
  );
}

