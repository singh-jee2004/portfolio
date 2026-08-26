'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Coffee, Target, Briefcase, Calendar } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

const TIMELINE = [
  {
    year: '2024',
    title: 'Started Coding Journey',
    description: 'Fell in love with programming, mastering HTML, CSS, JavaScript, and core computer science fundamentals.',
    icon: '🚀',
  },
  {
    year: '2025',
    title: 'Dived into Full Stack & AI',
    description: 'Expanded expertise into React, Next.js, Node.js, databases, and integrating modern AI capabilities into web apps.',
    icon: '🤖',
  },
  {
    year: '2026+',
    title: 'Building Production Applications',
    description: 'Focusing on high-performance web applications, modern 3D UI experiences, and scalable AI solutions.',
    icon: '⚡',
  },
];

const INTERESTS = [
  { emoji: '🤖', label: 'AI' },
  { emoji: '📱', label: 'Mobile Apps' },
  { emoji: '☕', label: 'Coffee Lover' },
  { emoji: '🎵', label: 'Music' },
  { emoji: '🏋️', label: 'Fitness' },
  { emoji: '🎮', label: 'Gaming' },
];

export default function AboutSection() {
  const [projectCount, setProjectCount] = useState<number>(0);

  useEffect(() => {
    const fetchProjectCount = async () => {
      let count = 0;
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))) {
          const client = createClient();
          const { data } = await client.from('projects').select('id');
          if (data && data.length > 0) {
            count = data.length;
            setProjectCount(count);
            return;
          }
        }
      } catch {
        // Check local storage fallback
      }

      try {
        const local = localStorage.getItem('portfolio_projects');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            count = parsed.length;
          }
        }
      } catch {
        // ignore
      }

      setProjectCount(count);
    };

    fetchProjectCount();
  }, []);

  const STATS = [
    { value: '2+', label: 'Years Coding' },
    { value: projectCount > 0 ? `${projectCount}+` : '0', label: 'Projects Built' },
    { value: '8+', label: 'Technologies' },
    { value: '∞', label: 'Cups of Coffee' },
  ];

  return (
    <section id="about" className="section">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 64 }}
        >
          <p className="section-label">About Me</p>
          <h2 className="section-title">Who I Am</h2>
          <div className="accent-line" />
        </motion.div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 72 }}
          className="stats-grid">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card"
              style={{ padding: '28px 20px', textAlign: 'center' }}
            >
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--accent)', fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 6 }}>{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}
          className="about-grid">

          {/* Left: Who I am */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif" }}>
              A developer with a <span className="gradient-text">passion for crafting</span> beautiful experiences
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
              I&apos;m a <strong style={{ color: 'var(--text-primary)' }}>Full Stack Developer</strong> and AI
              enthusiast who thrives at the intersection of design and technology. I love building applications
              that are not only functional but delightful to use.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32 }}>
              My journey started with curiosity and a love for problem-solving. Today, I specialize in
              building scalable web applications using modern frameworks and AI tools.
            </p>

            {/* Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: MapPin, text: 'India 🇮🇳', label: 'Location' },
                { icon: GraduationCap, text: 'B.Tech in Computer Science & Engineering', label: 'Education' },
                { icon: Briefcase, text: 'Open to opportunities', label: 'Status' },
                { icon: Coffee, text: 'tusharsinghr26@gmail.com', label: 'Email' },
              ].map(({ icon: Icon, text, label }) => (
                <div key={label} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>{text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interests */}
            <div style={{ marginTop: 28 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                Interests &amp; hobbies:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {INTERESTS.map(({ emoji, label }) => (
                  <div key={label} className="tech-badge" style={{ background: 'rgba(17,24,39,0.6)' }}>
                    {emoji} {label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <Target size={20} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>My Journey</h3>
            </div>

            <div style={{ position: 'relative', paddingLeft: 24 }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: 2,
                background: 'linear-gradient(to bottom, var(--accent), transparent)',
              }} />

              {TIMELINE.map(({ year, title, description, icon }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ position: 'relative', marginBottom: 28 }}
                >
                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: -30,
                    width: 12, height: 12, borderRadius: '50%',
                    background: 'var(--accent)',
                    top: 6,
                    boxShadow: '0 0 10px var(--accent-glow)',
                  }} />

                  <div className="glass-card" style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                      <div style={{
                        fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace",
                        color: 'var(--accent)', fontWeight: 600, padding: '2px 8px',
                        background: 'rgba(245,158,11,0.1)', borderRadius: 4,
                      }}>
                        {year}
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <Calendar size={11} />
                      </span>
                    </div>
                    <h4 style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.95rem' }}>{title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-grid  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
