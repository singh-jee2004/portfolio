'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, CheckCircle, XCircle, Loader } from 'lucide-react';
import { GithubIcon } from '../ui/Icons';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="contact" className="section">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">Let&apos;s Work Together</h2>
          <div className="accent-line" style={{ margin: '16px auto 0' }} />
          <p className="section-subtitle" style={{ margin: '20px auto 0', textAlign: 'center' }}>
            Have a project in mind? I&apos;d love to hear from you. Drop a message and I&apos;ll get back to you shortly.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 48, alignItems: 'start' }}
          className="contact-grid">

          {/* ── Left: Info ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 16, fontFamily: "'Space Grotesk', sans-serif" }}>
              Say Hello 👋
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 32 }}>
              Whether you have a project idea, want to collaborate, or just want to say hi — my inbox is always open.
            </p>

            {/* Contact details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
              {[
                { icon: Mail, text: 'hello@tusharsingh.dev', label: 'Email' },
                { icon: MapPin, text: 'India 🇮🇳', label: 'Location' },
              ].map(({ icon: Icon, text, label }) => (
                <div key={label} className="glass-card"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>
                — also find me on
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { icon: GithubIcon, href: 'https://github.com/singh-jee2004', label: 'GitHub' },
                ].map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={label}
                    style={{
                      width: 44, height: 44, borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.25s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.borderColor = 'var(--accent)';
                      el.style.color = 'var(--accent)';
                      el.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.borderColor = 'var(--border)';
                      el.style.color = 'var(--text-secondary)';
                      el.style.transform = 'none';
                    }}>
                    <Icon size={19} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card"
            style={{ padding: '36px' }}
          >
            {/* Status messages */}
            {status === 'success' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 10, marginBottom: 24, color: '#4ade80' }}>
                <CheckCircle size={18} /> Message sent! I&apos;ll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10, marginBottom: 24, color: '#f87171' }}>
                <XCircle size={18} /> Something went wrong. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}
                className="form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
                    Your Name *
                  </label>
                  <input
                    type="text" id="contact-name"
                    className="input-field"
                    placeholder="Tushar Singh"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  {errors.name && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 6 }}>{errors.name}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
                    Email Address *
                  </label>
                  <input
                    type="email" id="contact-email"
                    className="input-field"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  {errors.email && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 6 }}>{errors.email}</p>}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
                  Subject
                </label>
                <input
                  type="text" id="contact-subject"
                  className="input-field"
                  placeholder="Project Collaboration / Hiring / Just saying hi"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  className="input-field"
                  rows={6}
                  placeholder="Tell me about your project, idea, or just say hello..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ resize: 'vertical', minHeight: 140 }}
                />
                {errors.message && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 6 }}>{errors.message}</p>}
              </div>

              <button
                type="submit"
                id="contact-submit"
                disabled={status === 'loading'}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
              >
                {status === 'loading'
                  ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
                  : <><Send size={18} /> Send Message</>
                }
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
