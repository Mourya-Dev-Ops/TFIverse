'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const Lottie = dynamic(async () => (await import('lottie-react')).default, { ssr: false });

// ✅ UPDATED: Import ALL badge animations from centralized map
import { BADGE_ANIMATIONS } from '@/lib/badge-animations';

// ✅ Use the centralized animation map with ALL badges
const badgeAnimationMap: Record<string, any> = BADGE_ANIMATIONS;

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
type BadgeStatus = 'earned' | 'locked' | 'progress';

const RARITY_COLORS: Record<Rarity, string> = {
  common: '#94A3B8',
  rare: '#3B82F6',
  epic: '#9333EA',
  legendary: '#F59E0B',
};

export type BadgeRecord = {
  badge_id?: string;
  name: string;
  description?: string;
  rarity?: Rarity;
  earned_at?: string;
  icon?: string;
};

function hexToRgba(hex: string, alpha = 1) {
  const c = hex.replace('#', '');
  const bigint = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function Badge({
  badge,
  size = 28,
  showTooltip = true,
  status = 'earned',
  progressPct = 0,
}: {
  badge: BadgeRecord;
  size?: number;
  showTooltip?: boolean;
  status?: BadgeStatus;
  progressPct?: number;
}) {
  const [hover, setHover] = useState(false);
  const [tapOpen, setTapOpen] = useState(false);
  const lottieRef = useRef<any>(null);

  const rarity = (badge.rarity || 'common') as Rarity;
  const color = RARITY_COLORS[rarity];
  const animationData = badge.badge_id ? badgeAnimationMap[badge.badge_id] : null;

  // DEBUG: log what Badge receives
  useEffect(() => {
    console.log('Badge component received:', {
      badge_id: badge.badge_id,
      name: badge.name,
      hasAnimation: badge.badge_id ? !!badgeAnimationMap[badge.badge_id] : false,
      animationData: animationData ? 'loaded' : 'missing',
    });
  }, [badge.badge_id, badge.name, animationData]);

  const ring = useMemo(() => {
    const stroke = Math.max(3, Math.round(size * 0.12));
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const pct = Math.max(0, Math.min(100, progressPct));
    return { stroke, r, c, dash: c - (pct / 100) * c };
  }, [size, progressPct]);

  useEffect(() => {
    if (!tapOpen) return;
    const t = setTimeout(() => setTapOpen(false), 1500);
    return () => clearTimeout(t);
  }, [tapOpen]);

  const handleClick = () => {
    if (status === 'earned' && lottieRef.current) {
      lottieRef.current.stop();
      lottieRef.current.play();
    }
    setTapOpen(true);
  };

  const show = showTooltip && (hover || tapOpen);

  const wrapperStyles: React.CSSProperties = {
    width: size,
    height: size,
    filter:
      status === 'locked'
        ? 'grayscale(0.9) opacity(0.6)'
        : `drop-shadow(0 0 6px ${hexToRgba(color, 0.35)})`,
  };

  const content = (
    <>
      {status === 'earned' && animationData ? (
        <motion.div
          className="relative"
          style={{ width: size, height: size }}
          whileHover={{ scale: 1.12, filter: `drop-shadow(0 0 12px ${hexToRgba(color, 0.7)})` }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 20 }}
        >
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop
            autoplay
            style={{ width: size, height: size, background: 'transparent', display: 'block' }}
            rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
          />
        </motion.div>
      ) : badge.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={badge.icon}
          alt={badge.name}
          className="h-[74%] w-[74%] object-contain pointer-events-none"
          draggable={false}
        />
      ) : (
        <span className="text-white text-[11px] leading-none font-bold">
          {badge.badge_id === 'verified' ? '' : (badge.name?.charAt(0)?.toUpperCase() ?? 'B')}
        </span>
      )}

      {status === 'progress' && (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 pointer-events-none"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={ring.r}
            stroke={hexToRgba('#ffffff', 0.15)}
            strokeWidth={ring.stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={ring.r}
            stroke={color}
            strokeWidth={ring.stroke}
            strokeDasharray={ring.c}
            strokeDashoffset={ring.dash}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
      )}

      {status === 'locked' && (
        <div className="absolute inset-0 rounded-full bg-black/30 pointer-events-none" />
      )}
    </>
  );

  return (
    <div
      className="group relative inline-flex items-center justify-center rounded-full bg-transparent select-none cursor-pointer"
      style={wrapperStyles}
      tabIndex={0}
      aria-label={badge.name}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClick}
    >
      {content}

      <AnimatePresence>
        {show && (
          <motion.div
            className="absolute left-0 top-full mt-3 z-[95]"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
          >
            <div
              className="absolute -left-1.5 top-4 h-0 w-0"
              style={{
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                borderRight: `7px solid rgba(148, 163, 184, 0.45)`,
              }}
            />
            <div
              className="rounded-2xl backdrop-blur-md"
              style={{
                background: 'linear-gradient(180deg, rgba(14,14,16,0.92), rgba(10,10,12,0.92))',
                boxShadow: '0 8px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
                border: '1px solid rgba(148,163,184,0.45)',
                minWidth: 220,
                maxWidth: 320,
              }}
            >
              <div className="px-4 pt-3 pb-2 flex items-center gap-2">
                <div
                  className="grid place-items-center rounded-full"
                  style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.06)' }}
                >
                  <div className="rounded-full" style={{ width: 10, height: 10, background: color }} />
                </div>
                <p className="text-[14px] font-semibold tracking-wide" style={{ color: '#C7D2FE' }}>
                  {badge.name}
                </p>
              </div>

              <div className="px-4 pb-3">
                {badge.description ? (
                  <p className="text-[14px] text-gray-200 leading-snug">{badge.description}</p>
                ) : null}

                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
                  <div className="text-gray-400">Rarity</div>
                  <div className="text-gray-200 capitalize">{badge.rarity || 'common'}</div>
                  {status === 'progress' ? (
                    <>
                      <div className="text-gray-400">Progress</div>
                      <div className="text-gray-200">{Math.round(Math.max(0, Math.min(100, progressPct)))}%</div>
                    </>
                  ) : null}
                  {badge.earned_at && status === 'earned' ? (
                    <>
                      <div className="text-gray-400">Earned</div>
                      <div className="text-gray-200">
                        {new Date(badge.earned_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ✅ Also export as default for backward compatibility
export default Badge;
