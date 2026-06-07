'use client';
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export function HorizontalScroller({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  React.useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const onScroll = () => update();
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, []);

  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = ref.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.9);
    el.scrollTo({
      left: el.scrollLeft + (dir === 'left' ? -delta : delta),
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative group">
      {canLeft && (
        <button
          aria-label={`Scroll ${ariaLabel} left`}
          title="Scroll left"
          aria-controls={`${ariaLabel}-scroller`}
          onClick={() => scrollByAmount('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 grid place-items-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
        >
          <FaChevronLeft />
        </button>
      )}
      {canRight && (
        <button
          aria-label={`Scroll ${ariaLabel} right`}
          title="Scroll right"
          aria-controls={`${ariaLabel}-scroller`}
          onClick={() => scrollByAmount('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 grid place-items-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
        >
          <FaChevronRight />
        </button>
      )}
      <div
        id={`${ariaLabel}-scroller`}
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
      >
        {children}
      </div>
    </div>
  );
}
