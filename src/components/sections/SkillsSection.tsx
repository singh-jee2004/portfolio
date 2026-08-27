'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Category = 'all' | 'frontend' | 'backend' | 'database' | 'ai' | 'tools';

interface Skill {
  name: string;
  icon: string;
  level: number; // 0–100
  category: Exclude<Category, 'all'>;
}

const SKILLS: Skill[] = [
  // Frontend
  { name: 'React', icon: '⚛️', level: 92, category: 'frontend' },
  { name: 'Next.js', icon: '▲', level: 88, category: 'frontend' },
  { name: 'TypeScript', icon: '🔷', level: 85, category: 'frontend' },
  { name: 'Tailwind CSS', icon: '🎨', level: 90, category: 'frontend' },
  { name: 'JavaScript', icon: '🟡', level: 93, category: 'frontend' },
  { name: 'HTML & CSS', icon: '🌐', level: 95, category: 'frontend' },
  // Backend
  { name: 'Node.js', icon: '🟢', level: 85, category: 'backend' },
  { name: 'Express.js', icon: '🚂', level: 82, category: 'backend' },
  { name: 'Python', icon: '🐍', level: 88, category: 'backend' },
  { name: 'FastAPI', icon: '⚡', level: 75, category: 'backend' },
  { name: 'REST APIs', icon: '🔗', level: 90, category: 'backend' },
  // Database
  { name: 'PostgreSQL', icon: '🐘', level: 82, category: 'database' },
  { name: 'Supabase', icon: '⚡', level: 88, category: 'database' },
  { name: 'MongoDB', icon: '🍃', level: 78, category: 'database' },
  { name: 'MySQL', icon: '🗄️', level: 75, category: 'database' },
  // AI
  { name: 'OpenAI API', icon: '🤖', level: 85, category: 'ai' },
  { name: 'LangChain', icon: '🔗', level: 72, category: 'ai' },
  { name: 'Hugging Face', icon: '🤗', level: 68, category: 'ai' },
  { name: 'GitHub Copilot', icon: '🚀', level: 90, category: 'ai' },
  // Tools
  { name: 'Git & GitHub', icon: '🐙', level: 92, category: 'tools' },
  { name: 'Docker', icon: '🐳', level: 72, category: 'tools' },
  { name: 'VS Code', icon: '💙', level: 95, category: 'tools' },
  { name: 'Vercel', icon: '▲', level: 88, category: 'tools' },
  { name: 'Linux', icon: '🐧', level: 75, category: 'tools' },
];

const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: 'all', label: 'All Skills', emoji: '✨' },
  { key: 'frontend', label: 'Frontend', emoji: '🎨' },
  { key: 'backend', label: 'Backend', emoji: '⚙️' },
  { key: 'database', label: 'Database', emoji: '🗄️' },
  { key: 'ai', label: 'AI & ML', emoji: '🤖' },
  { key: 'tools', label: 'Tools', emoji: '🛠️' },
];

function levelLabel(n: number) {
  if (n >= 90) return 'Expert';
  if (n >= 75) return 'Advanced';
  if (n >= 60) return 'Intermediate';
  return 'Learning';
}

export default function SkillsSection() {
  const [active, setActive] = useState<Category>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = active === 'all' ? SKILLS : SKILLS.filter((s) => s.category === active);

  return (
    <section id="skills" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 48, textAlign: 'center' }}
        >
          <p className="section-label">What I know</p>
          <h2 className="section-title">Skills &amp; Technologies</h2>
          <div className="accent-line" style={{ margin: '16px auto 0' }} />
          <p className="section-subtitle" style={{ margin: '20px auto 0', textAlign: 'center' }}>
            A curated set of technologies I use to bring ideas to life.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 48 }}
        >
          {CATEGORIES.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                padding: '10px 20px',
                borderRadius: 99,
                border: active === key ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: active === key ? 'rgba(245,158,11,0.15)' : 'transparent',
                color: active === key ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: active === key ? 700 : 400,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.25s',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {emoji} {label}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            {filtered.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card"
                style={{ padding: '20px 22px', cursor: 'default' }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.4rem' }}>{skill.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{skill.name}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                      padding: '3px 8px',
                      background: 'rgba(245,158,11,0.1)',
                      borderRadius: 4,
                      color: 'var(--accent)',
                    }}
                  >
                    {levelLabel(skill.level)}
                  </span>
                </div>

                {/* Progress bar track */}
                <div
                  style={{
                    height: 6,
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 99,
                    overflow: 'hidden',
                    width: '100%',
                  }}
                >
                  <motion.div
                    className="skill-bar-fill"
                    initial={{ width: '0%' }}
                    whileInView={{ width: mounted ? `${skill.level}%` : '0%' }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 1.0, delay: i * 0.04, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 60%, #38bdf8 100%)',
                      borderRadius: 99,
                      boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {skill.level}%
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
