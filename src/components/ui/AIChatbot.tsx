'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const SUGGESTIONS = [
  '⚡ What is your tech stack?',
  '🚀 Tell me about your top projects',
  '💼 Are you available for hire?',
  '🎓 What is your educational background?',
];

export function SciFiRobotIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 1. Antennas */}
      <line x1="28" y1="26" x2="28" y2="10" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
      <circle cx="28" cy="8" r="3.5" fill="#3b82f6" />
      <line x1="72" y1="26" x2="72" y2="10" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
      <circle cx="72" cy="8" r="3.5" fill="#3b82f6" />

      {/* Antenna Sparkles */}
      <path d="M17 14L21 16M15 20L19 21" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M83 14L79 16M85 20L81 21" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />

      {/* 2. Headphones (Blue Ear Cups) */}
      <rect x="18" y="28" width="12" height="24" rx="6" fill="#1e40af" stroke="#1d4ed8" strokeWidth="2" />
      <rect x="70" y="28" width="12" height="24" rx="6" fill="#1e40af" stroke="#1d4ed8" strokeWidth="2" />

      {/* Headphone Boom Mic */}
      <path d="M72 46 C 72 60, 58 62, 52 62" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <rect x="45" y="59" width="9" height="6" rx="3" fill="#0f172a" />

      {/* 3. Helmet Head */}
      <rect x="25" y="18" width="50" height="42" rx="21" fill="url(#helmet-grad)" stroke="#94a3b8" strokeWidth="2" />

      {/* 4. Dark Visor Face */}
      <rect x="30" y="26" width="40" height="24" rx="12" fill="#0b1329" stroke="#1e293b" strokeWidth="1.5" />

      {/* 5. Glowing Cyan Eyes & Smile */}
      <ellipse cx="39" cy="36" rx="4" ry="6" fill="#38bdf8" />
      <ellipse cx="61" cy="36" rx="4" ry="6" fill="#38bdf8" />
      <path d="M46 42 Q50 46 54 42" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* 6. Robot Body / Torso */}
      <path d="M34 60 C 34 58, 66 58, 66 60 L 68 80 C 68 86, 32 86, 32 80 Z" fill="url(#body-grad)" stroke="#94a3b8" strokeWidth="2" />

      {/* Blue Shoulder Joints */}
      <circle cx="28" cy="66" r="6" fill="#1d4ed8" />
      <circle cx="72" cy="66" r="6" fill="#1d4ed8" />

      {/* Floating Arms */}
      <path d="M24 70 C 18 76, 20 84, 26 86" stroke="#cbd5e1" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M76 70 C 82 76, 80 84, 74 86" stroke="#cbd5e1" strokeWidth="5.5" strokeLinecap="round" />

      {/* Orange Energy Badge with Lightning Emblem */}
      <circle cx="50" cy="72" r="7" fill="#ea580c" stroke="#f97316" strokeWidth="1.5" />
      <path d="M49 68L47 72H52L50 76" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Gradients */}
      <defs>
        <linearGradient id="helmet-grad" x1="25" y1="18" x2="75" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="body-grad" x1="32" y1="58" x2="68" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hi! 👋 I'm **Tushar AI**, Tushar's personal 3D Sci-Fi Robot assistant. Ask me anything about his skills, projects, certifications, or resume!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Speech Recognition setup (Speech-to-Text)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
          handleSend(transcript);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Text-to-Speech (TTS)
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#•]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);

    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore error
      }
    }
    setIsListening(false);

    setInput('');
    setLoading(false);
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: "Hi! 👋 I'm **Tushar AI**, Tushar's personal 3D Sci-Fi Robot assistant. Ask me anything about his skills, projects, certifications, or resume!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setIsOpen(false);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Try Google Chrome.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let clientProjects = [];
      let clientCerts = [];
      if (typeof window !== 'undefined') {
        try {
          const lp = localStorage.getItem('portfolio_projects');
          if (lp) clientProjects = JSON.parse(lp);
          const lc = localStorage.getItem('portfolio_certifications');
          if (lc) clientCerts = JSON.parse(lc);
        } catch {
          // ignore error
        }
      }

      const res = await fetch('/api/avatar/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          projects: clientProjects,
          certificates: clientCerts,
        }),
      });
      const data = await res.json();
      const botText = data.answer || data.reply || "I'm sorry, I couldn't process that request right now.";

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (autoSpeak) {
        speakText(botText);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: "I'm having trouble connecting right now. Feel free to contact Tushar directly via the contact form!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating 3D Sci-Fi Robot Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open 3D Sci-Fi AI Assistant"
            className="chatbot-fab"
            style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 32px rgba(15, 23, 42, 0.8), 0 0 24px rgba(56, 189, 248, 0.35)',
              position: 'relative',
              padding: 0,
            }}
          >
            <SciFiRobotIcon size={46} />
            {/* Glowing Green Online Pulse Badge */}
            <span
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 15,
                height: 15,
                borderRadius: '50%',
                background: '#10b981',
                border: '2.5px solid #0f172a',
                boxShadow: '0 0 12px #10b981',
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card chatbot-modal"
            style={{
              width: 380,
              maxWidth: 'calc(100vw - 32px)',
              height: 540,
              maxHeight: 'calc(100vh - 90px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 40px rgba(56, 189, 248, 0.3)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '14px 18px',
                background: 'linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.98) 100%)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SciFiRobotIcon size={34} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                    TusharAI Robot <Sparkles size={14} style={{ color: '#38bdf8', display: 'inline' }} />
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#38bdf8',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    ● 3D Sci-Fi Assistant Online
                  </div>
                </div>
              </div>

              {/* Controls: Audio Toggle & Close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    setAutoSpeak(!autoSpeak);
                  }}
                  title={autoSpeak ? 'Mute AI Voice' : 'Enable AI Voice'}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: 6,
                    color: autoSpeak ? '#38bdf8' : 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {autoSpeak ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>

                <button
                  onClick={handleClose}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: 6,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Speaking Waveform Indicator */}
            {isSpeaking && (
              <div
                style={{
                  padding: '6px 16px',
                  background: 'rgba(56,189,248,0.12)',
                  borderBottom: '1px solid rgba(56,189,248,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>Robot Speaking...</div>
                <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  {[12, 20, 15, 24, 10].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, h, 4] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      style={{ width: 3, background: '#38bdf8', borderRadius: 2 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Message Area */}
            <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'flex-start',
                      maxWidth: '88%',
                      flexDirection: m.sender === 'user' ? 'row-reverse' : 'row',
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background:
                          m.sender === 'user'
                            ? 'rgba(56,189,248,0.2)'
                            : 'rgba(30,41,59,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {m.sender === 'user' ? (
                        <User size={14} style={{ color: '#38bdf8' }} />
                      ) : (
                        <SciFiRobotIcon size={22} />
                      )}
                    </div>

                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 14,
                        fontSize: '0.88rem',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-line',
                        background:
                          m.sender === 'user'
                            ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                            : 'rgba(15,23,42,0.85)',
                        border:
                          m.sender === 'user'
                            ? '1px solid rgba(56,189,248,0.4)'
                            : '1px solid var(--border)',
                        color: m.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)',
                      marginTop: 4,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {m.timestamp}
                  </span>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'rgba(30,41,59,0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <SciFiRobotIcon size={22} />
                  </div>
                  <div
                    className="glass-card"
                    style={{ padding: '8px 14px', display: 'flex', gap: 4, alignItems: 'center' }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#38bdf8',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div
              style={{
                padding: '8px 12px',
                display: 'flex',
                gap: 6,
                overflowX: 'auto',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(8,13,26,0.6)',
              }}
            >
              {SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleSend(sug)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 99,
                    background: 'rgba(56,189,248,0.1)',
                    border: '1px solid rgba(56,189,248,0.25)',
                    color: '#38bdf8',
                    fontSize: '0.72rem',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{
                padding: 12,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: 8,
                background: 'rgba(15,23,42,0.9)',
              }}
            >
              {/* Mic Voice Button */}
              <button
                type="button"
                onClick={toggleListening}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: isListening ? '1.5px solid #ef4444' : '1px solid var(--border)',
                  color: isListening ? '#ef4444' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                title="Speak question"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <input
                type="text"
                className="input-field"
                placeholder={isListening ? 'Listening...' : 'Ask Robot AI...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ padding: '10px 14px', fontSize: '0.88rem' }}
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="btn-primary"
                style={{
                  padding: '0 16px',
                  borderRadius: 12,
                  height: 42,
                  opacity: !input.trim() || loading ? 0.5 : 1,
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .chatbot-wrapper {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
        }
        @media (max-width: 640px) {
          .chatbot-wrapper {
            bottom: 16px !important;
            right: 16px !important;
          }
          .chatbot-fab {
            width: 58px !important;
            height: 58px !important;
          }
          .chatbot-modal {
            width: calc(100vw - 32px) !important;
            height: calc(100vh - 100px) !important;
          }
        }
      `}</style>
    </div>
  );
}
