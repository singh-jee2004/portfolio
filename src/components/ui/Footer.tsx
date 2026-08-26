'use client';

import { Code2, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './Icons';

const SOCIAL = [
  { icon: GithubIcon, href: 'https://github.com/singh-jee2004', label: 'GitHub' },
  { icon: LinkedinIcon, href: 'https://linkedin.com/in/tusharsingh', label: 'LinkedIn' },
  { icon: TwitterIcon, href: 'https://twitter.com/tusharsingh', label: 'Twitter' },
];

const QUICK = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      padding: '60px 0 28px',
    }}>
      <div className="section-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
                borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Code2 size={18} color="#000" strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                Tushar<span style={{ color: 'var(--accent)' }}>.</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 260 }}>
              Full Stack Developer & AI Enthusiast building modern, scalable web experiences.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 38, height: 38, borderRadius: 9,
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = 'var(--accent)';
                    el.style.borderColor = 'var(--accent)';
                    el.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = 'var(--text-secondary)';
                    el.style.borderColor = 'var(--border)';
                    el.style.transform = 'none';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {QUICK.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    → {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              Get In Touch
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
              Open to exciting opportunities and collaborations.<br />
              <a href="mailto:hello@tusharsingh.dev"
                style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                hello@tusharsingh.dev
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Tushar Singh. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            Made with <Heart size={14} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} /> using Next.js & Three.js
          </p>
        </div>
      </div>
    </footer>
  );
}
