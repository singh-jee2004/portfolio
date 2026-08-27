'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { GithubIcon, InstagramIcon } from '../ui/Icons';

import { FallbackAvatarVisual } from '../avatar/AvatarScene';
import { LipSyncProvider } from '../avatar/LipSync';
import { VoiceControllerProvider } from '../avatar/VoiceController';
import AvatarSpeakerButton from '../avatar/AvatarSpeakerButton';

const AvatarScene = dynamic(() => import('../avatar/AvatarScene'), {
  ssr: false,
  loading: () => <FallbackAvatarVisual />,
});

const TYPING_TEXTS = [
  'Full Stack Developer',
  'AI Application Architect',
  '3D WebGL Creator',
  'Problem Solver',
  'Open Source Contributor',
];

function TypewriterText() {
  const [displayed, setDisplayed] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = TYPING_TEXTS[textIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 80);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, 40);
    } else {
      setDeleting(false);
      setTextIdx((i) => (i + 1) % TYPING_TEXTS.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx]);

  return (
    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
      {displayed}
      <span className="blink-cursor" style={{ color: 'var(--accent)', marginLeft: 2 }}>
        |
      </span>
    </span>
  );
}

export default function HeroSection() {
  const handleScroll = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <LipSyncProvider>
      <VoiceControllerProvider>
        <section
          id="home"
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            padding: '60px 0',
          }}
          className="grid-bg"
        >
          {/* Ambient multi-color gradient glow spotlights */}
          <div
            style={{
              position: 'absolute',
              top: '15%',
              left: '-5%',
              width: 550,
              height: 550,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, rgba(245,158,11,0.06) 50%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '25%',
              right: '-5%',
              width: 550,
              height: 550,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(225,29,72,0.25) 0%, rgba(168,85,247,0.08) 50%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <div className="section-container" style={{ width: '100%', position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
                alignItems: 'center',
                gap: 30,
                minHeight: '85vh',
              }}
              className="hero-grid"
            >
              {/* ── Left: Bio Content ── */}
              <div>
                {/* Status badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    borderRadius: 99,
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    marginBottom: 24,
                  }}
                >
                  <span
                    style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'block' }}
                    className="pulse-glow"
                  />
                  <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                  <span
                    style={{
                      color: 'var(--accent)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    Interactive 3D Developer Avatar
                  </span>
                </motion.div>

                {/* Greeting */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.1rem',
                    marginBottom: 8,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  👋 Hi, I&apos;m
                </motion.p>

                {/* Name */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
                    fontWeight: 900,
                    lineHeight: 1.05,
                    fontFamily: "'Space Grotesk', sans-serif",
                    marginBottom: 16,
                  }}
                >
                  <span className="gradient-text">Tushar Singh</span>
                </motion.h1>

                {/* Typewriter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', marginBottom: 24, minHeight: 44 }}
                >
                  <TypewriterText />
                </motion.div>

                {/* Bio */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.05rem',
                    lineHeight: 1.75,
                    maxWidth: 520,
                    marginBottom: 36,
                  }}
                >
                  I craft <strong style={{ color: 'var(--text-primary)' }}> Modern, Scalable Web Applications</strong>. with a passion for AI integration and beautiful use experiences. Let's collaborate and bring our extraordinary ideas to life.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}
                >
                  <a href="#projects" className="btn-primary">
                    View My Work →
                  </a>
                  <a href="#contact" className="btn-outline">
                    Contact Me
                  </a>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}
                >
                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    Find me on:
                  </span>
                  {[
                    { icon: GithubIcon, href: 'https://github.com/singh-jee2004', label: 'GitHub' },
                    { icon: InstagramIcon, href: 'https://www.instagram.com/_tushar.__singh_/', label: 'Instagram' },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.25s',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.borderColor = 'var(--accent)';
                        el.style.color = 'var(--accent)';
                        el.style.transform = 'translateY(-3px)';
                        el.style.boxShadow = '0 5px 20px var(--accent-glow)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.borderColor = 'var(--border)';
                        el.style.color = 'var(--text-secondary)';
                        el.style.transform = 'none';
                        el.style.boxShadow = 'none';
                      }}
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </motion.div>
              </div>

              {/* ── Right: 3D Developer Avatar & Speaker Emoji Button ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', width: '100%' }}
              >
                {/* 3D Canvas Container */}
                <div
                  style={{ position: 'relative', height: 460, width: '100%', borderRadius: 24, overflow: 'hidden' }}
                  className="hero-canvas-wrapper"
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at 50% 50%, rgba(225,29,72,0.2) 0%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <AvatarScene />
                </div>

                {/* 🔊 Speaker Emoji Button to play Intro & Passion */}
                <AvatarSpeakerButton />
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.button
            onClick={handleScroll}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="float-anim"
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'none',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              width: 44,
              height: 44,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
            aria-label="Scroll to about"
          >
            <ArrowDown size={18} />
          </motion.button>

          <style>{`
            @media (max-width: 768px) {
              .hero-grid {
                grid-template-columns: 1fr !important;
                padding-top: 60px;
                padding-bottom: 40px;
              }
              .hero-canvas-wrapper {
                height: 340px !important;
              }
            }
          `}</style>
        </section>
      </VoiceControllerProvider>
    </LipSyncProvider>
  );
}
