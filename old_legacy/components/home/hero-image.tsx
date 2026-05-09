'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function HeroImage() {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 bg-gradient-to-br from-white/10 via-black to-black/90"
      >
        {/* Animated gradient overlay - CINEMA SILVER */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/5 opacity-60"
          animate={{
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full h-full relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Image */}
      <img
        src="/images/hero-bg-4k.jpg"
        alt="TFIverse Hero Background"
        className="w-full h-full object-cover opacity-50"
        onError={() => setImageError(true)}
      />

      {/* Cinema Silver Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      {/* Premium Silver Accent Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.02]"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
