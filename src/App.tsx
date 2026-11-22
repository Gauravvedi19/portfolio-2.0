/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Hero from "./components/showcase/Hero";
import ProductShowcase from "./components/showcase/ProductShowcase";
import Capabilities from "./components/showcase/Capabilities";
import Closing from "./components/showcase/Closing";
import HomeBackdrop from "./components/showcase/HomeBackdrop";
import TopBar from "./components/showcase/TopBar";
import Preloader from "./components/showcase/Preloader";
import { setLenis } from "./lib/scroll";
import { jumpToProduct } from "./components/showcase/phoneStore";
import { PRODUCTS } from "./showcase/products";
import CaseStudyPage from "./components/case/CaseStudyPage";
import CustomCursor from "./components/CustomCursor";
import { PageTransition } from "./components/PageTransition";

// three.js is the heaviest thing on the page, so the 3D stage is its own chunk — but its download
// starts now, alongside the page's, rather than once the first page has rendered.
const stageChunk = import("./components/showcase/PhoneStage");
const PhoneStage = lazy(() => stageChunk);

let globalLenis: Lenis | null = null;

/**
 * Where a new page opens: a project's place in the line-up (coming back from its case study), a
 * #section, or the top. It waits for its target to exist, then scrolls there once. It used to keep
 * re-scrolling every 100ms for five seconds, by two different offsets: the page jumped back and forth,
 * and any scroll the visitor began was snatched back.
 */
function ScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    const lenis = globalLenis;
    if (!lenis) return;
    const product = (location.state as { product?: string } | null)?.product;
    const index = product ? PRODUCTS.findIndex((p) => p.id === product) : -1;
    const targetId = location.hash.replace("#", "");

    let timer = 0;
    let tries = 0;
    const attempt = () => {
      // The line-up installs its jump once it has mounted.
      if (index >= 0 && jumpToProduct(index, { immediate: true })) return;
      const element = targetId ? document.getElementById(targetId) : null;
      if (index < 0 && element) return lenis.scrollTo(element, { immediate: true, force: true });
      if (index < 0 && !targetId) return lenis.scrollTo(0, { immediate: true, force: true });
      if (++tries < 40) timer = window.setTimeout(attempt, 50);
    };
    // After the new page has laid out.
    timer = window.setTimeout(attempt, 10);
    return () => window.clearTimeout(timer);
  }, [location]);

  return null;
}

function Home() {
  return (
    <>
      <a href="#work" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:px-4 focus:py-2 focus:rounded-full focus:bg-white focus:text-black text-sm">
        Skip to work
      </a>
      <Preloader />
      <HomeBackdrop />
      <TopBar />
      <Hero />
      <ProductShowcase />
      <Capabilities />
      <Closing />
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
    setLenis(lenisInstance);

    let rafId: number;
    function raf(time: number) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
      globalLenis = null;
      setLenis(null);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollHandler />
      <PageTransition />
      <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-white/20">
        <CustomCursor />

        {/* Light Noise Overlay for Cinematic Texture */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.035] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50 mix-blend-overlay"></div>

        <main className="relative z-10 w-full min-h-screen">
          {/* The one 3D iPhone, kept from page to page: a case study reuses the phone, its shaders and
              its light the home page already built, instead of starting a new 3D canvas. */}
          <Suspense fallback={null}>
            <PhoneStage />
          </Suspense>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/postcard" element={<CaseStudyPage id="postcard" />} />
            <Route path="/tender9" element={<CaseStudyPage id="tender9" />} />
            <Route path="/arianestudio" element={<CaseStudyPage id="arianestudio" />} />
            <Route path="/crave" element={<CaseStudyPage id="crave" />} />
            <Route path="/washadmin" element={<CaseStudyPage id="washadmin" />} />
            <Route path="/cliniko" element={<CaseStudyPage id="cliniko" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
