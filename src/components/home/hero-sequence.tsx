"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Link from "next/link";

interface HeroSequenceProps {
  isAuthenticated: boolean;
}

export default function HeroSequence({ isAuthenticated }: HeroSequenceProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [skipSequence, setSkipSequence] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    // On mobile, always skip. On desktop, check localStorage preference
    if (mobile) {
      setSkipSequence(true);
    } else {
      const pref = localStorage.getItem("tfi-skip-hero");
      if (pref === "true") setSkipSequence(true);
    }

    const handleResize = () => {
      const m = window.innerWidth < 768;
      setIsMobile(m);
      if (m) setSkipSequence(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSkip = () => {
    const next = !skipSequence;
    setSkipSequence(next);
    if (!isMobile) localStorage.setItem("tfi-skip-hero", String(next));
    if (next) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) return <div className="h-screen bg-black" />;

  if (skipSequence) {
    return <StaticHero isAuthenticated={isAuthenticated} onEnableSequence={isMobile ? undefined : toggleSkip} />;
  }

  return <ScrollSequence isAuthenticated={isAuthenticated} onSkip={toggleSkip} />;
}

/* ═══════════════════════════════════════════ */
/* STATIC HERO — Mobile default + Desktop opt */
/* ═══════════════════════════════════════════ */

function StaticHero({ isAuthenticated, onEnableSequence }: { isAuthenticated: boolean; onEnableSequence?: () => void }) {
  return (
    <div className="relative w-full min-h-[100dvh] bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Static Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/images/bahubali seq/00001.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center px-6 max-w-2xl"
      >
        <h1 className="text-[clamp(2.5rem,7vw,7rem)] font-black tracking-[-0.04em] leading-[0.85] mb-6">
          <span className="text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.15)]">TFI</span>
          <span className="bg-gradient-to-b from-white via-white/80 to-white/20 bg-clip-text text-transparent">verse</span>
        </h1>

        <p className="text-white/40 text-sm md:text-base mb-4 leading-relaxed max-w-md mx-auto">
          The definitive Telugu cinema experience. Heroes. Films. Culture. All in one universe.
        </p>

        <p className="text-white/20 text-[11px] tracking-[0.3em] uppercase font-bold mb-10">
          Welcome to the TFI Community
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {!isAuthenticated ? (
            <>
              <Link href="/register" className="px-10 py-4 bg-white text-black font-bold text-[13px] uppercase tracking-[0.2em] rounded-full transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-[0.97]">
                Get Started
              </Link>
              <Link href="/login" className="px-10 py-4 text-white/50 hover:text-white text-[13px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300">
                Sign In →
              </Link>
            </>
          ) : (
            <button onClick={() => document.getElementById("home-content")?.scrollIntoView({ behavior: "smooth" })} className="px-10 py-4 bg-white text-black font-bold text-[13px] uppercase tracking-[0.2em] rounded-full transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-[0.97]">
              Enter Universe
            </button>
          )}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-white/20 text-[9px] tracking-[0.4em] uppercase font-bold">Scroll Down</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </motion.div>

      {/* Enable Cinematic Toggle — Desktop only */}
      {onEnableSequence && (
        <button
          onClick={onEnableSequence}
          className="absolute top-24 right-6 text-[10px] text-white/20 hover:text-white/50 uppercase tracking-widest font-bold transition-colors border border-white/[0.06] hover:border-white/20 px-4 py-2 rounded-full z-20"
        >
          ▶ Cinematic Mode
        </button>
      )}

      {/* Anchor for smooth scroll */}
      <div id="home-content" className="absolute bottom-0" />
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* SCROLL SEQUENCE — Desktop cinematic mode   */
/* ═══════════════════════════════════════════ */

function ScrollSequence({ isAuthenticated, onSkip }: { isAuthenticated: boolean; onSkip: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);

  const frameCount = 1034;
  const currentFrame = (index: number) =>
    `/images/bahubali seq/${index.toString().padStart(5, '0')}.jpg`;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    let activeCanvas = 1;
    const canvas1 = canvas1Ref.current;
    const canvas2 = canvas2Ref.current;
    if (!canvas1 || !canvas2) return;

    const ctx1 = canvas1.getContext("2d", { alpha: false });
    const ctx2 = canvas2.getContext("2d", { alpha: false });
    if (!ctx1 || !ctx2) return;

    const images: HTMLImageElement[] = [];

    const preloadBatch = (start: number, end: number) => {
      for (let i = start; i <= end; i++) {
        if (!images[i]) {
          const img = new Image();
          img.src = currentFrame(i);
          images[i] = img;
        }
      }
    };

    preloadBatch(1, 50);

    let targetFrame = 0;

    const renderFrame = (index: number, force = false) => {
      if (index === targetFrame && !force) return;
      targetFrame = index;

      const img = images[index];
      if (!img) return;

      const draw = (imageToDraw: HTMLImageElement, frameIndex: number) => {
        if (frameIndex !== targetFrame) return;

        const currentCtx = activeCanvas === 1 ? ctx2 : ctx1;
        const currentCanvas = activeCanvas === 1 ? canvas2 : canvas1;
        const visibleCanvas = activeCanvas === 1 ? canvas1 : canvas2;

        const w = currentCanvas.width;
        const h = currentCanvas.height;
        const ratio = Math.max(w / imageToDraw.width, h / imageToDraw.height);
        const cw = imageToDraw.width * ratio;
        const ch = imageToDraw.height * ratio;
        const cx = (w - cw) / 2;
        const cy = (h - ch) / 2;

        currentCtx.drawImage(imageToDraw, 0, 0, imageToDraw.width, imageToDraw.height, cx, cy, cw, ch);

        currentCanvas.style.opacity = "1";
        visibleCanvas.style.opacity = "0";
        activeCanvas = activeCanvas === 1 ? 2 : 1;
      };

      if (img.complete && img.naturalWidth !== 0) {
        requestAnimationFrame(() => draw(img, index));
      } else {
        img.onload = () => requestAnimationFrame(() => draw(img, index));
      }
    };

    const resize = () => {
      canvas1.width = canvas1.clientWidth || window.innerWidth;
      canvas1.height = canvas1.clientHeight || window.innerHeight;
      canvas2.width = canvas2.clientWidth || window.innerWidth;
      canvas2.height = canvas2.clientHeight || window.innerHeight;
      renderFrame(Math.floor(scrollYProgress.get() * (frameCount - 1)) + 1, true);
    };

    window.addEventListener("resize", resize);
    setTimeout(resize, 0);

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const frame = Math.max(1, Math.min(frameCount, Math.floor(latest * (frameCount - 1)) + 1));
      renderFrame(frame);
      preloadBatch(frame, Math.min(frameCount, frame + 40));
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", resize);
    };
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="h-[600vh] w-full relative bg-black z-0">
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        <canvas ref={canvas1Ref} className="absolute inset-0 w-full h-full transition-opacity duration-0" style={{ opacity: 1 }} />
        <canvas ref={canvas2Ref} className="absolute inset-0 w-full h-full transition-opacity duration-0" style={{ opacity: 0 }} />

        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [0.7, 0, 0.4, 0.9]) }}
        />

        {/* Start Title */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.12], [1, 0]), y: useTransform(scrollYProgress, [0, 0.12], [0, -30]) }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none"
        >
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-black tracking-[-0.04em] leading-[0.85] mb-6 flex flex-row items-center gap-1">
            <span className="text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.15)]">TFI</span>
            <span className="bg-gradient-to-b from-white via-white/80 to-white/20 bg-clip-text text-transparent">verse</span>
          </h1>
          <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase font-bold">Scroll to Experience</p>
        </motion.div>

        {/* Enter CTA (bottom) */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center z-20"
        >
          <button
            onClick={() => window.scrollTo({ top: window.innerHeight * 6, behavior: "smooth" })}
            className="mb-8 px-6 py-3 rounded-full bg-white/[0.03] hover:bg-white/[0.08] transition-colors backdrop-blur-md text-[10px] font-bold tracking-[0.5em] uppercase text-white flex items-center gap-3 border border-white/[0.08] cursor-pointer"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            Enter TFI Universe
          </button>
          <div className="w-px h-16 bg-gradient-to-b from-white/80 to-transparent animate-pulse pointer-events-none" />
        </motion.div>

        {/* End CTAs */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.85, 0.95], [0, 1]), y: useTransform(scrollYProgress, [0.85, 0.95], [40, 0]) }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-auto"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">A Legacy Reborn</h2>
          <p className="text-white/60 text-lg md:text-xl max-w-xl mb-12 leading-relaxed">The definitive Telugu cinema experience. Heroes. Films. Culture. All in one place.</p>
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button onClick={() => window.scrollTo({ top: window.innerHeight * 6, behavior: "smooth" })} className="group relative px-10 py-5 bg-white text-black font-bold text-[13px] uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-[0.97]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-[1.5s]" />
                <span className="relative z-10">Get Started</span>
              </button>
              <Link href="/login" className="px-10 py-5 text-white/50 hover:text-white text-[13px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300">Sign In →</Link>
            </div>
          ) : (
            <button onClick={() => window.scrollTo({ top: window.innerHeight * 6, behavior: "smooth" })} className="px-10 py-5 bg-white text-black font-bold text-[13px] uppercase tracking-[0.2em] rounded-full transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-[0.97]">Enter Universe</button>
          )}
        </motion.div>

        {/* Skip Toggle */}
        <button
          onClick={onSkip}
          className="absolute top-24 right-6 text-[10px] text-white/20 hover:text-white/50 uppercase tracking-widest font-bold transition-colors border border-white/[0.06] hover:border-white/20 px-4 py-2 rounded-full z-30"
        >
          ✕ Skip Cinematic
        </button>
      </div>
    </div>
  );
}
