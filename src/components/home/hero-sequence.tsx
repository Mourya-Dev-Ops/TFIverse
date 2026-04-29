"use client";

import { useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Link from "next/link";

interface HeroSequenceProps {
  isAuthenticated: boolean;
}

export default function HeroSequence({ isAuthenticated }: HeroSequenceProps) {
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

    // Use alpha: false to optimize performance if there is no transparency
    const ctx1 = canvas1.getContext("2d", { alpha: false });
    const ctx2 = canvas2.getContext("2d", { alpha: false });
    if (!ctx1 || !ctx2) return;

    const images: HTMLImageElement[] = [];

    const preloadBatch = (start: number, end: number) => {
      for (let i = start; i <= end; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images[i] = img;
      }
    };

    // Preload first batch immediately so first frame is ready
    preloadBatch(1, 100);

    // Idle load the rest to avoid blocking
    if (typeof window !== 'undefined') {
      const loadMore = () => preloadBatch(101, frameCount);
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadMore);
      } else {
        setTimeout(loadMore, 1000);
      }
    }

    let targetFrame = 0;

    const renderFrame = (index: number, force = false) => {
      if (index === targetFrame && !force) return;
      targetFrame = index;

      const img = images[index];
      if (!img) return;

      const draw = (imageToDraw: HTMLImageElement, frameIndex: number) => {
        // If the user has already scrolled past this frame while it was loading, drop it!
        if (frameIndex !== targetFrame) return;

        // Dual canvas swap logic
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

        // Swap visibility
        currentCanvas.style.opacity = "1";
        visibleCanvas.style.opacity = "0";
        activeCanvas = activeCanvas === 1 ? 2 : 1;
      };

      if (img.complete && img.naturalWidth !== 0) {
        requestAnimationFrame(() => draw(img, index));
      } else {
        // Attach onload, but only draw if we haven't scrolled past it
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
    // Add a slight delay to ensure DOM is ready for client dimensions
    setTimeout(resize, 0);

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const frame = Math.max(1, Math.min(frameCount, Math.floor(latest * (frameCount - 1)) + 1));
      renderFrame(frame);
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", resize);
    };
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="h-[600vh] w-full relative bg-black z-0">
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* Dual Canvas Setup */}
        <canvas ref={canvas1Ref} className="absolute inset-0 w-full h-full transition-opacity duration-0" style={{ opacity: 1 }} />
        <canvas ref={canvas2Ref} className="absolute inset-0 w-full h-full transition-opacity duration-0" style={{ opacity: 0 }} />

        {/* Overlay Darkening */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [0.7, 0, 0.4, 0.9])
          }}
        />

        {/* Start Title - Fades out early */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.12], [1, 0]),
            y: useTransform(scrollYProgress, [0, 0.12], [0, -30])
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none"
        >
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-black tracking-[-0.04em] leading-[0.85] mb-6 flex flex-row items-center gap-1">
            <span className="text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.15)]">TFI</span>
            <span className="bg-gradient-to-b from-white via-white/80 to-white/20 bg-clip-text text-transparent">verse</span>
          </h1>
          <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase font-bold">
            Scroll to Experience
          </p>
        </motion.div>

        {/* Enter TFI Universe CTA (bottom) - fades out early */}
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

        {/* End CTAs - Fades in at the end of the scroll */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.85, 0.95], [0, 1]),
            y: useTransform(scrollYProgress, [0.85, 0.95], [40, 0])
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-auto"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
            A Legacy Reborn
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-xl mb-12 leading-relaxed">
            The definitive Telugu cinema experience. Heroes. Films. Culture. All in one place.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button onClick={() => window.scrollTo({ top: window.innerHeight * 6, behavior: "smooth" })} className="group relative px-10 py-5 bg-white text-black font-bold text-[13px] uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-[0.97]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-[1.5s]" />
                <span className="relative z-10">Get Started</span>
              </button>
              <Link href="/login" className="px-10 py-5 text-white/50 hover:text-white text-[13px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300">
                Sign In →
              </Link>
            </div>
          ) : (
            <button onClick={() => window.scrollTo({ top: window.innerHeight * 6, behavior: "smooth" })} className="px-10 py-5 bg-white text-black font-bold text-[13px] uppercase tracking-[0.2em] rounded-full transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-[0.97]">
              Enter Universe
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
