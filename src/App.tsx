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

function ScrollHandler({ lenis }: { lenis: Lenis | null }) {
  const location = useLocation();

  useEffect(() => {
    if (!lenis) return;

    let targetId = location.hash.replace("#", "");

    if (!targetId && location.pathname !== "/") {
      targetId = location.pathname.substring(1);
    }

    if (targetId) {
      // Retry finding element a few times if it delays rendering
      let attempts = 0;
      const findAndScroll = () => {
        const element = document.getElementById(targetId);
        if (element) {
          lenis.scrollTo(element, {
            offset: -50,
            immediate: true, // Jump immediately rather than animating
          });
        } else if (attempts < 10) {
          attempts++;
          setTimeout(findAndScroll, 100);
        }
      };
      findAndScroll();
    } else if (location.pathname === "/" && !location.hash) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location, lenis]);

  return null;
}

export default function App() {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      lerp: 0.05,
      // @ts-ignore
      smoothWheel: true,
    });

    setLenis(lenisInstance);

    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollHandler lenis={lenis} />
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
