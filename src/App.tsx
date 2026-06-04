/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Scene1Spark from "./components/scenes/Scene1Spark";
import Scene2Chaos from "./components/scenes/Scene2Chaos";
import Scene3Clarity from "./components/scenes/Scene3Clarity";
import Scene5Products from "./components/scenes/Scene5Products";
import SceneAbout from "./components/scenes/SceneAbout";
import SceneSkills from "./components/scenes/SceneSkills";
import Scene7CTA from "./components/scenes/Scene7CTA";

function ScrollHandler({ lenisRef, lenisReady }: { lenisRef: React.MutableRefObject<Lenis | null>, lenisReady: boolean }) {
  const location = useLocation();

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis || !lenisReady) return;

    let targetId = location.hash.replace("#", "");

    if (!targetId && location.pathname !== "/") {
      targetId = location.pathname.substring(1).toLowerCase();
    }

    if (targetId) {
      console.log("Deep link detected. Target:", targetId);
      
      // Use a timeout to ensure the DOM has painted and layout is stable
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          // Force layout calculation
          element.getBoundingClientRect();
          // Scroll immediately via Lenis
          lenis.scrollTo(element, { offset: -100, immediate: true });
          // Fallback native scroll
          element.scrollIntoView({ behavior: "auto", block: "start" });
          
          // Re-adjust after images/fonts might have loaded (e.g. 500ms and 1000ms later)
          setTimeout(() => lenis.scrollTo(element, { offset: -100, immediate: true }), 500);
          setTimeout(() => lenis.scrollTo(element, { offset: -100, immediate: true }), 1000);
        } else {
          // If not found immediately, retry a few times (helps if dynamically rendered)
          let retries = 0;
          const retryInterval = setInterval(() => {
            const el = document.getElementById(targetId);
            if (el) {
              clearInterval(retryInterval);
              lenis.scrollTo(el, { offset: -100, immediate: true });
              el.scrollIntoView({ behavior: "auto", block: "start" });
            }
            retries++;
            if (retries > 20) clearInterval(retryInterval); // Stop after 2 seconds
          }, 100);
        }
      }, 100);
    } else {
      setTimeout(() => {
        if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
      }, 10);
    }
  }, [location, lenisRef, lenisReady]);

  return null;
}

function Home() {
  return (
    <>
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
    </>
  );
}

export default function App() {
  const lenisRef = React.useRef<Lenis | null>(null);
  const [lenisReady, setLenisReady] = useState(false);

  useEffect(() => {
    const lenisInstance = new Lenis({
      lerp: 0.05,
      // @ts-ignore
      smoothWheel: true,
    });

    lenisRef.current = lenisInstance;
    setLenisReady(true);

    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollHandler lenisRef={lenisRef} lenisReady={lenisReady} />
      <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-white/20">
        {/* Premium Ambient Background Glow (Aurora Blue) */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen overflow-hidden">
          <div className="absolute -inset-[10%] bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(56,189,248,0.25),rgba(255,255,255,0))] animate-aurora-1" />
          <div className="absolute -inset-[10%] bg-[radial-gradient(ellipse_60%_60%_at_10%_110%,rgba(14,165,233,0.2),rgba(255,255,255,0))] animate-aurora-2" />
          <div className="absolute -inset-[10%] bg-[radial-gradient(ellipse_60%_60%_at_90%_50%,rgba(2,132,199,0.2),rgba(255,255,255,0))] animate-aurora-3" />
        </div>

        {/* Light Noise Overlay for Cinematic Texture */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.035] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50 mix-blend-overlay"></div>

        <main className="relative z-10 w-full min-h-screen">
          <Routes>
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
