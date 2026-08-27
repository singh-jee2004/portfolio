'use client';

import React, { useState } from 'react';
import { Send, Volume2, Sparkles, MessageSquare, Bot, User } from 'lucide-react';
import { useVoiceController } from '../avatar/VoiceController';
import VoiceInput from './VoiceInput';

const QUICK_QUESTIONS = [
  'What projects have you built?',
  'What are your core skills?',
  'Tell me about your background',
  'How can I contact Tushar?',
];

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'avatar'; text: string }>>([
    {
      sender: 'avatar',
      text: "Hi! I'm Tushar's AI Avatar representative. Click an intro or ask me anything about Tushar's projects & skills!",
    },
  ]);

  const { speak, isSpeaking, currentSubtitle } = useVoiceController();

  const handleSend = async (questionText: string) => {
    if (!questionText.trim() || loading) return;

    const q = questionText.trim();
    setInput('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: q }]);
    setLoading(true);

    try {
      const res = await fetch('/api/avatar/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      const answer = data.answer || "I'm Tushar's AI assistant!";

      setChatHistory((prev) => [...prev, { sender: 'avatar', text: answer }]);
      // Speak response out loud and animate 3D avatar lips
      await speak(answer);
    } catch (err) {
      console.warn('Chat request error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIntro = () => {
    const introText =
      "Hi, I'm Tushar. I'm a Full Stack Developer building AI-powered applications, interactive 3D web experiences, and scalable cloud solutions. Welcome to my portfolio!";
    setChatHistory((prev) => [...prev, { sender: 'avatar', text: introText }]);
    speak(introText);
  };

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: 24,
        padding: 20,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(245,158,11,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        maxWidth: 480,
        width: '100%',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-[#between]', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a',
            }}
          >
            <Bot size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              AI Portfolio Representative
            </h3>
            <span style={{ fontSize: '0.75rem', color: isSpeaking ? '#38bdf8' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isSpeaking ? '#38bdf8' : '#4ade80',
                  display: 'inline-block',
                }}
              />
              {isSpeaking ? 'Speaking natural voice...' : 'Online & Ready'}
            </span>
          </div>
        </div>

        {/* Intro Trigger Button */}
        <button
          onClick={handleIntro}
          title="Play Avatar Greeting"
          style={{
            padding: '6px 12px',
            borderRadius: 99,
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: 'var(--accent)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
        >
          <Volume2 size={14} />
          Play Intro
        </button>
      </div>

      {/* Real-time Subtitle Banner when Avatar Speaks */}
      {isSpeaking && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 14,
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: '0.85rem',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Sparkles size={16} className="animate-spin" />
          <span>&quot;{currentSubtitle}&quot;</span>
        </div>
      )}

      {/* Quick Suggestion Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            disabled={loading}
            style={{
              padding: '6px 12px',
              borderRadius: 99,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Controls */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        style={{ display: 'flex', gap: 8, alignItems: 'center' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Tushar's avatar anything..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 14,
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />

        {/* Voice Input Button */}
        <VoiceInput onTranscript={(text) => handleSend(text)} disabled={loading} />

        {/* Send Button */}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 16px',
            borderRadius: 14,
            background: 'var(--accent)',
            color: '#0f172a',
            border: 'none',
            fontWeight: 700,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading || !input.trim() ? 0.6 : 1,
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
