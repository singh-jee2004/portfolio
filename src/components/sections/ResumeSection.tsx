'use client';

import { motion } from 'framer-motion';
import { Download, Award, ExternalLink, BookOpen } from 'lucide-react';

const CERTIFICATIONS = [
  {
    title: 'Add your certifications via Admin Dashboard',
    issuer: 'Login to /admin and upload your certificates',
    date: '',
    url: null,
    placeholder: true,
  },
];

const EDUCATION = [
  {
    degree: 'Bachelor of Computer Science / Technology',
    institution: 'Your University',
    year: '2024 – Present',
    description: 'Specializing in Software Engineering, Algorithms, and Artificial Intelligence.',
    gpa: 'Update via Admin',
  },
];

export default function ResumeSection() {
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
            <div style={{
              width: 60, height: 60, borderRadius: 16,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <BookOpen size={28} color="#000" />
            </div>
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>
                My Resume
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Upload your resume PDF via the Admin Dashboard → it will appear here for download.
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}
             className="resume-grid">

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.15rem', fontFamily: "'Space Grotesk', sans-serif" }}>Certifications</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {CERTIFICATIONS.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card"
                  style={{
                    padding: '20px 22px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    opacity: cert.placeholder ? 0.6 : 1,
                    borderStyle: cert.placeholder ? 'dashed' : 'solid',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{cert.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{cert.issuer}</div>
                  </div>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer"
                       style={{ color: 'var(--accent)', flexShrink: 0 }}>
                      <ExternalLink size={16} />
                    </a>
                  )}
                </motion.div>
              ))}

              <a href="/admin" className="btn-outline" style={{ justifyContent: 'center', marginTop: 8 }}>
                + Add Certification via Admin
              </a>
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
