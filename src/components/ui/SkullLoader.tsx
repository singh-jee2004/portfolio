'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SkullLoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export default function SkullLoader({ fullScreen = false, message = 'INITIALIZING SYSTEM...' }: SkullLoaderProps) {
  const [slowConnection, setSlowConnection] = useState(false);

  useEffect(() => {
    // 1. Check Network Information API if available
    const nav = typeof window !== 'undefined' ? (navigator as any) : null;
    if (nav?.connection) {
      const conn = nav.connection;
      if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.effectiveType === '3g' || conn.saveData || conn.rtt > 400) {
        setSlowConnection(true);
      }
    }

    // 2. Timer Fallback: If loading takes longer than 2.8 seconds, flag slow connectivity
    const timer = setTimeout(() => {
      setSlowConnection(true);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const displayMessage = slowConnection ? 'LOW INTERNET CONNECTIVITY DETECTED...' : message;

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Outer Holographic HUD Container */}
      <div className="relative flex items-center justify-center w-36 h-36 md:w-44 md:h-44">
        {/* Outer Rotating Cyber Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: slowConnection ? 12 : 8, repeat: Infinity, ease: 'linear' }}
          className={`absolute inset-0 rounded-full border border-dashed shadow-[0_0_30px_rgba(245,158,11,0.2)] ${
            slowConnection
              ? 'border-red-500/40 border-t-red-500 border-r-amber-500'
              : 'border-amber-500/30 border-t-amber-400 border-r-cyan-400'
          }`}
        />

        {/* Counter Rotating Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: slowConnection ? 10 : 6, repeat: Infinity, ease: 'linear' }}
          className={`absolute inset-2 rounded-full border ${
            slowConnection
              ? 'border-amber-500/40 border-b-red-400 border-l-amber-400'
              : 'border-cyan-500/30 border-b-cyan-400 border-l-amber-400'
          }`}
        />

        {/* Pulsing Glowing Aura */}
        <motion.div
          animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute inset-4 rounded-full blur-xl ${
            slowConnection
              ? 'bg-gradient-to-r from-red-500/30 via-amber-500/30 to-purple-500/30'
              : 'bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-purple-500/20'
          }`}
        />

        {/* Cybernetic Skull SVG */}
        <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(245,158,11,0.7)]"
          >
            {/* Skull Cranium Outline */}
            <path
              d="M50 12 C30 12 18 26 18 46 C18 58 24 66 32 72 L32 82 C32 85 35 88 38 88 L62 88 C65 88 68 85 68 82 L68 72 C76 66 82 58 82 46 C82 26 70 12 50 12 Z"
              stroke="url(#skull-grad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glowing Eye Sockets */}
            <motion.path
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              d="M32 44 C32 38 38 36 41 42 C43 47 37 50 32 44 Z"
              fill={slowConnection ? '#ef4444' : '#f59e0b'}
            />
            <motion.path
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              d="M68 44 C68 38 62 36 59 42 C57 47 63 50 68 44 Z"
              fill={slowConnection ? '#f59e0b' : '#06b6d4'}
            />

            {/* Eye Pupil Laser Nodes */}
            <circle cx="37" cy="43" r="2.5" fill="#ffffff" className="animate-ping" />
            <circle cx="63" cy="43" r="2.5" fill="#ffffff" className="animate-ping" />

            {/* Triangular Cyber Nose Cavity */}
            <path d="M50 54 L44 63 L56 63 Z" fill="url(#skull-grad)" />

            {/* Cyber Teeth Grid */}
            <path d="M38 74 L38 84 M44 74 L44 84 M50 74 L50 84 M56 74 L56 84 M62 74 L62 84" stroke="url(#skull-grad)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M34 78 L66 78" stroke="url(#skull-grad)" strokeWidth="2" />

            {/* Cheekbone Cyber Lines */}
            <path d="M22 48 L30 52 M78 48 L70 52" stroke={slowConnection ? '#f59e0b' : '#38bdf8'} strokeWidth="2" strokeLinecap="round" />

            {/* Gradients */}
            <defs>
              <linearGradient id="skull-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={slowConnection ? '#ef4444' : '#f59e0b'} />
                <stop offset="50%" stopColor={slowConnection ? '#f59e0b' : '#38bdf8'} />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Cyberpunk Loading Message */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`text-xs md:text-sm font-mono tracking-[0.2em] font-semibold uppercase ${
            slowConnection ? 'text-amber-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]' : 'text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]'
          }`}
        >
          {displayMessage}
        </motion.span>

        {slowConnection && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-[11px] font-mono text-red-400 tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            POOR NETWORK SIGNAL — OPTIMIZING PACKETS...
          </motion.div>
        )}
        
        {/* Animated Progress Bar */}
        <div className="w-36 md:w-44 h-1 bg-slate-800/80 rounded-full overflow-hidden border border-amber-500/20 mt-1">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: slowConnection ? 2.5 : 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-full h-full rounded-full ${
              slowConnection
                ? 'bg-gradient-to-r from-red-500 via-amber-400 to-purple-500'
                : 'bg-gradient-to-r from-amber-500 via-cyan-400 to-purple-500'
            }`}
          />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}
