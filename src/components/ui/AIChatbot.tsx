'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, User } from 'lucide-react';

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

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hi! 👋 I'm **Tushar AI**, Tushar's personal AI assistant. Ask me anything about his skills, projects, journey, or how to hire him!",
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
    // 1. Stop audio voice playback
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);

    // 2. Stop speech recognition listening
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore error
      }
    }
    setIsListening(false);

    // 3. Reset input & refresh chat messages
    setInput('');
    setLoading(false);
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: "Hi! 👋 I'm **TusharAI**, Tushar's personal AI assistant. Ask me anything about his skills, projects, journey, or how to hire him!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    // 4. Close widget
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
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();
      const botText = data.reply || "I'm sorry, I couldn't process that request right now.";

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
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999 }}>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(245, 158, 11, 0.45)',
              position: 'relative',
            }}
          >
            <Bot size={28} color="#030712" strokeWidth={2.2} />
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#10b981',
                border: '2px solid #030712',
                boxShadow: '0 0 10px #10b981',
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
            className="glass-card"
            style={{
              width: 380,
              maxWidth: 'calc(100vw - 32px)',
              height: 540,
              maxHeight: 'calc(100vh - 100px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 40px var(--accent-glow)',
              border: '1.5px solid var(--border-hover)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(15,23,42,0.9) 100%)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={22} color="#000" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                    TusharAI <Sparkles size={14} style={{ color: 'var(--accent)', display: 'inline' }} />
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--accent-light)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    ● AI Assistant & Voice Online
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
                    color: autoSpeak ? 'var(--accent)' : 'var(--text-muted)',
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
                  background: 'rgba(245,158,11,0.12)',
                  borderBottom: '1px solid rgba(245,158,11,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>Speaking...</div>
                <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  {[12, 20, 15, 24, 10].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, h, 4] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      style={{ width: 3, background: 'var(--accent)', borderRadius: 2 }}
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
                      maxWidth: '85%',
                      flexDirection: m.sender === 'user' ? 'row-reverse' : 'row',
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background:
                          m.sender === 'user'
                            ? 'rgba(56,189,248,0.2)'
                            : 'rgba(245,158,11,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {m.sender === 'user' ? (
                        <User size={14} style={{ color: '#38bdf8' }} />
                      ) : (
                        <Bot size={14} style={{ color: 'var(--accent)' }} />
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
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background: 'rgba(245,158,11,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Bot size={14} style={{ color: 'var(--accent)' }} />
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
                          background: 'var(--accent)',
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
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    color: 'var(--accent-light)',
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
                placeholder={isListening ? 'Listening...' : 'Ask TusharAI...'}
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
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
