'use client';

import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useVoiceController } from './VoiceController';

const INTRO_AND_PASSION_TEXT =
  "Hi, I'm Tushar Singh! I'm a passionate Full Stack Developer and AI Application Architect. My true passion lies in crafting modern, high-performance web applications, interactive 3D WebGL experiences, and intelligent AI solutions that solve real-world problems. Welcome to my portfolio!";

export default function AvatarSpeakerButton() {
  const { speak, stop, isSpeaking, currentSubtitle } = useVoiceController();

  const handleClick = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(INTRO_AND_PASSION_TEXT);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
      {/* 🔊 SPEAKER EMOJI BUTTON BESIDE/OVERLAYING AVATAR */}
      <button
        onClick={handleClick}
        aria-label="Listen to Tushar's Intro & Passion"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 24px',
          borderRadius: 99,
          background: isSpeaking
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(245, 158, 11, 0.9))'
            : 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isSpeaking ? '2px solid #ffffff' : '1px solid rgba(245, 158, 11, 0.5)',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: 'pointer',
          boxShadow: isSpeaking
            ? '0 0 30px rgba(239, 68, 68, 0.6), 0 0 10px rgba(245, 158, 11, 0.4)'
            : '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(245, 158, 11, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
        onMouseEnter={(e) => {
          if (!isSpeaking) {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(245, 158, 11, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSpeaking) {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(245, 158, 11, 0.2)';
          }
        }}
      >
        <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🔊</span>
        <span>{isSpeaking ? 'Pause Speech' : 'Play Intro & Passion'}</span>
        {isSpeaking && <Sparkles size={18} className="animate-spin" style={{ color: '#ffffff' }} />}
      </button>

      {/* SUBTITLE OVERLAY WHEN SPEAKING */}
      {isSpeaking && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 16,
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f8fafc',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            textAlign: 'center',
            maxWidth: 460,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          <span style={{ color: 'var(--accent)', fontWeight: 700, marginRight: 6 }}>Tushar:</span>
          &quot;{currentSubtitle || INTRO_AND_PASSION_TEXT}&quot;
        </div>
      )}
    </div>
  );
}
