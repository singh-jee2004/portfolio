'use client';

import React, { useState } from 'react';
import { Heart, MessageSquare, Repeat2, Volume2, Share2, Sparkles, Check } from 'lucide-react';
import { useVoiceController } from './VoiceController';

interface SocialActionBarProps {
  onOpenChat?: () => void;
}

export default function SocialActionBar({ onOpenChat }: SocialActionBarProps) {
  const [likes, setLikes] = useState(23600);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reposts, setReposts] = useState(417);
  const [hasReposted, setHasReposted] = useState(false);

  const { speak, isSpeaking } = useVoiceController();

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleRepost = () => {
    if (!hasReposted) {
      setReposts((prev) => prev + 1);
      setHasReposted(true);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleIntroSpeech = () => {
    const text =
      "Hi, I'm Tushar! Welcome to my portfolio website. Feel free to ask me anything about my full stack and AI projects!";
    speak(text);
  };

  const formatCount = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        zIndex: 10,
      }}
    >
      {/* 1. HEART / LIKE BUTTON */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <button
          onClick={handleLike}
          aria-label="Like Avatar Portfolio"
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: hasLiked ? 'rgba(239, 68, 68, 0.25)' : 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)',
            border: hasLiked ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
            color: hasLiked ? '#ef4444' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: hasLiked ? '0 0 20px rgba(239, 68, 68, 0.5)' : '0 8px 24px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart size={24} fill={hasLiked ? '#ef4444' : 'transparent'} />
        </button>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
          {formatCount(likes)}
        </span>
      </div>

      {/* 2. AI CHAT / COMMENT BUTTON */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <button
          onClick={onOpenChat}
          aria-label="Open AI Assistant Chat"
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.color = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = '#ffffff';
          }}
        >
          <MessageSquare size={22} />
        </button>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
          15.9K
        </span>
      </div>

      {/* 3. REPOST / RECIRCULATE BUTTON */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <button
          onClick={handleRepost}
          aria-label="Repost"
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: hasReposted ? 'rgba(74, 222, 128, 0.25)' : 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)',
            border: hasReposted ? '2px solid #4ade80' : '1px solid rgba(255, 255, 255, 0.15)',
            color: hasReposted ? '#4ade80' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Repeat2 size={22} />
        </button>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
          {reposts}
        </span>
      </div>

      {/* 4. SHARE PORTFOLIO LINK */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <button
          onClick={handleShare}
          aria-label="Share Portfolio Link"
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: copied ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)',
            border: copied ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
            color: copied ? '#38bdf8' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {copied ? <Check size={22} /> : <Share2 size={22} />}
        </button>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: copied ? '#38bdf8' : 'var(--text-muted)' }}>
          {copied ? 'Copied!' : 'Share'}
        </span>
      </div>

      {/* 5. VOICE AUDIO EQUALIZER BUTTON */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <button
          onClick={handleIntroSpeech}
          aria-label="Play Avatar Voice Intro"
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: isSpeaking ? 'linear-gradient(135deg, #ef4444, #f59e0b)' : 'linear-gradient(135deg, #f59e0b, #38bdf8)',
            border: '2px solid #ffffff',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.6)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isSpeaking ? <Sparkles size={24} className="animate-spin" /> : <Volume2 size={24} />}
        </button>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {isSpeaking ? 'Speaking' : 'Listen'}
        </span>
      </div>
    </div>
  );
}
