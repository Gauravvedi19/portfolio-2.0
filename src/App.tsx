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
import WashAdminCaseStudy from "./components/WashAdminCaseStudy";
import ClinkoCaseStudy from "./components/scenes/ClinkoCaseStudy";
import ProjectCivicCaseStudy from "./components/scenes/ProjectCivicCaseStudy";

let globalLenis: Lenis | null = null;

function ScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    if (!globalLenis) return;

    let targetId = location.hash.replace("#", "");

    if (targetId) {
      console.log("Deep link detected. Target:", targetId);
      let attempts = 0;
      const MAX_ATTEMPTS = 50;

      const findAndScroll = () => {
        const element = document.getElementById(targetId);
        if (element) {
          if (attempts === 0) {
            globalLenis!.scrollTo(element, { offset: -100, immediate: true });
          }
          element.scrollIntoView({ behavior: "auto", block: "start" });
          if (attempts < MAX_ATTEMPTS) {
            attempts++;
            setTimeout(() => {
              globalLenis!.scrollTo(element, { offset: -100, immediate: true });
              findAndScroll();
            }, 100);
          }
        } else if (attempts < MAX_ATTEMPTS) {
          attempts++;
          setTimeout(findAndScroll, 100);
        }
      };
      findAndScroll();
    } else {
      setTimeout(() => {
        globalLenis!.scrollTo(0, { immediate: true });
      }, 10);
    }
  }, [location]);

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
  useEffect(() => {
    const lenisInstance = new Lenis({
      lerp: 0.05,
      // @ts-ignore
      smoothWheel: true,
    });

    globalLenis = lenisInstance;

    let rafId: number;
    function raf(time: number) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
      globalLenis = null;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollHandler />
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
            <Route path="/" element={<Home />} />
            <Route
              path="/washadmin"
              element={
                <div className="max-w-7xl mx-auto px-6 pb-32">
                  <WashAdminCaseStudy />
                </div>
              }
            />
            <Route
              path="/cliniko"
              element={
                <div className="max-w-7xl mx-auto px-6 pb-32 pt-32">
                  <ClinkoCaseStudy />
                </div>
              }
            />
            <Route
              path="/projectcivic"
              element={
                <div className="max-w-7xl mx-auto px-6 pb-32 pt-32">
                  <ProjectCivicCaseStudy />
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
