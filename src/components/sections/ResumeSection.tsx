'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Award, ExternalLink, BookOpen, Plus } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
import type { Certification } from '../../types';

const EDUCATION = [
  {
    degree: 'Bachelor of Computer Science & Engineering',
    institution: 'University',
    year: '2024 – Present',
    description: 'Specializing in Full Stack Web Development, Software Engineering, Algorithms, and Artificial Intelligence.',
  },
];

export default function ResumeSection() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))) {
          const supabase = createClient();
          const { data } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
          if (data && data.length > 0) {
            setCertifications(data as Certification[]);
            setLoading(false);
            return;
          }
        }
        // Fallback to localStorage if set
        const local = localStorage.getItem('portfolio_certifications');
        if (local) {
          setCertifications(JSON.parse(local));
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  return (
    <section id="resume" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 56 }}
        >
          <p className="section-label">Resume</p>
          <h2 className="section-title">Education & Certifications</h2>
          <div className="accent-line" />
        </motion.div>

        {/* Download Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card"
          style={{
            padding: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
            marginBottom: 56,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(17,24,39,0.7) 100%)',
            border: '1px solid rgba(245,158,11,0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Download size={26} color="#000" />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 4, fontFamily: "'Space Grotesk', sans-serif" }}>
                Looking for my detailed Resume?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Download a PDF copy summarizing my tech stack, projects, and education.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Tushar_Singh_Resume.pdf"
              className="btn-primary"
            >
              <Download size={18} /> Download PDF
            </a>
            <a href="/admin" className="btn-outline">
              Upload Resume →
            </a>
          </div>
        </motion.div>

        {/* Education & Certifications Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }} className="resume-grid">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.15rem', fontFamily: "'Space Grotesk', sans-serif" }}>Education</h3>
            </div>

            {EDUCATION.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card"
                style={{ padding: '24px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', maxWidth: '70%' }}>{edu.degree}</h4>
                  <span style={{
                    fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace",
                    padding: '3px 10px', background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.2)', borderRadius: 99,
                    color: 'var(--accent)', whiteSpace: 'nowrap',
                  }}>
                    {edu.year}
                  </span>
                </div>
                <p style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>{edu.institution}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.65 }}>{edu.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.15rem', fontFamily: "'Space Grotesk', sans-serif" }}>Certifications</h3>
              </div>
              <a href="/admin" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Plus size={14} /> Add New
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {loading ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: 20 }}>Loading certifications...</div>
              ) : certifications.length === 0 ? (
                <div className="glass-card" style={{ padding: 24, textAlign: 'center', border: '1.5px dashed var(--border)' }}>
                  <Award size={32} style={{ color: 'var(--accent)', opacity: 0.5, margin: '0 auto 10px' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 16 }}>
                    No certifications added yet. Manage and showcase your credentials via the Admin Dashboard.
                  </p>
                  <a href="/admin" className="btn-outline" style={{ display: 'inline-flex', fontSize: '0.82rem', padding: '8px 16px' }}>
                    + Add Certification via Admin
                  </a>
                </div>
              ) : (
                certifications.map((cert, i) => (
                  <motion.div
                    key={cert.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card"
                    style={{
                      padding: '20px 22px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 4 }}>{cert.title}</div>
                      <div style={{ color: 'var(--accent-light)', fontSize: '0.82rem', fontWeight: 500 }}>
                        {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                      </div>
                    </div>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', flexShrink: 0, gap: 5 }}
                      >
                        Verify <ExternalLink size={13} />
                      </a>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .resume-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
