/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Scene1Spark from "./components/scenes/Scene1Spark";
import Scene2Chaos from "./components/scenes/Scene2Chaos";
import Scene3Clarity from "./components/scenes/Scene3Clarity";
import Scene5Products from "./components/scenes/Scene5Products";
import SceneAbout from "./components/scenes/SceneAbout";
import SceneSkills from "./components/scenes/SceneSkills";
import Scene7CTA from "./components/scenes/Scene7CTA";

function ScrollHandler({ getLenis }: { getLenis: () => Lenis | null }) {
  const location = useLocation();

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;

    // Check if there's a hash, otherwise check path (e.g., /about -> target 'about')
    let targetId = location.hash.replace("#", "");

    if (!targetId && location.pathname !== "/") {
      targetId = location.pathname.substring(1);
    }

    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        // slight delay to ensure layout is ready
        setTimeout(() => {
          lenis.scrollTo(element, {
            offset: 0,
            duration: 1.5,
            immediate: false,
          });
        }, 100);
      }
    } else if (location.pathname === "/" && !location.hash) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location, getLenis]);

  return null;
}

export default function App() {
  const lenisRef = React.useRef<Lenis | null>(null);

  const getLenis = React.useCallback(() => lenisRef.current, []);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05,
      // @ts-ignore
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollHandler getLenis={getLenis} />
      <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-white/20">
        {/* Premium Ambient Background Glow (Aurora Blue) */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen overflow-hidden">
          <div className="absolute -inset-[10%] bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(56,189,248,0.25),rgba(255,255,255,0))] animate-aurora-1" />
          <div className="absolute -inset-[10%] bg-[radial-gradient(ellipse_60%_60%_at_10%_110%,rgba(14,165,233,0.2),rgba(255,255,255,0))] animate-aurora-2" />
          <div className="absolute -inset-[10%] bg-[radial-gradient(ellipse_60%_60%_at_90%_50%,rgba(2,132,199,0.2),rgba(255,255,255,0))] animate-aurora-3" />
        </div>

        {/* Light Noise Overlay for Cinematic Texture */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.035] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50 mix-blend-overlay"></div>

        <main className="relative z-10 w-full">
          <div id="home" />
          <Scene1Spark />

          <div id="intro" />
          <Scene2Chaos />

          <div id="projects" />
          <Scene3Clarity />

          <div id="products" />
          <Scene5Products />

          <div id="about" />
          <SceneAbout />

          <div id="skills" />
          <SceneSkills />

          <div id="contact" />
          <Scene7CTA />
        </main>
      </div>
    </BrowserRouter>
  );
}
