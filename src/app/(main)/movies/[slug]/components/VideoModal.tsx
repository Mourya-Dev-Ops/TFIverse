'use client';

import { useState, useEffect } from 'react';
import { PlayCircle, X } from 'lucide-react';
import Image from 'next/image';

interface VideoModalProps {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  isHero?: boolean;
}

export function VideoModal({ videoId, title, thumbnailUrl, isHero = false }: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (isHero) {
    return (
      <>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-bold text-sm transition-all bg-white text-black hover:scale-105 shadow-lg"
        >
          🎬 Trailer
        </button>
        
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-sm">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition-colors z-[60]"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black relative">
              <iframe 
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="shrink-0 w-72 aspect-video rounded-xl overflow-hidden bg-zinc-900 relative shadow-md group snap-start text-left"
      >
        <Image 
          src={thumbnailUrl || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
          alt={title} 
          fill 
          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                <PlayCircle className="w-5 h-5 text-white" />
            </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent p-4">
            <p className="text-xs font-bold text-white line-clamp-1">{title}</p>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-sm">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition-colors z-[60]"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black relative">
            <iframe 
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
