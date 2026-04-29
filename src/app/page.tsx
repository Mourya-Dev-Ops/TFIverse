import Link from "next/link";
import Navbar from "@/components/layout/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111] via-black to-black opacity-60 z-0"></div>

      {/* Navigation Component - assuming it exists or we build it */}
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center">
        
        {/* Cinematic Badge */}
        <div className="mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium tracking-widest uppercase text-neutral-400">
          The Next Generation Cinematic Database
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
          TFIVERSE
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-12 font-light">
          A premium sanctuary for heroes, movies, and cinematic tier lists. 
          Step into the ultimate database engineered for the modern era.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link 
            href="/register" 
            className="group relative px-8 py-4 bg-white text-black font-semibold rounded-none overflow-hidden transition-all hover:scale-105"
          >
            <span className="relative z-10">ENTER THE UNIVERSE</span>
            <div className="absolute inset-0 bg-neutral-200 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
          </Link>
          
          <Link 
            href="/login" 
            className="group px-8 py-4 bg-transparent text-white border border-white/20 font-semibold rounded-none hover:bg-white/5 transition-all"
          >
            SIGN IN
          </Link>
        </div>
      </div>

    </main>
  );
}
