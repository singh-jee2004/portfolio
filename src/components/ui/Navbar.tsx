'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Resume',   href: '#resume' },
  { label: 'Contact',  href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive]         = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Determine active section
      const sections = NAV_LINKS.map(l => l.href.replace('#', ''));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.4s ease',
          background: scrolled
            ? 'rgba(3, 7, 18, 0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(245, 158, 11, 0.12)'
            : '1px solid transparent',
        }}
      >
        <div className="section-container">
          <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
            {/* Logo */}
            <button
              onClick={() => handleNav('#home')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <div style={{
                width: 38, height: 38,
                background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Code2 size={20} color="#000" strokeWidth={2.5} />
              </div>
              <span style={{
                fontWeight: 800, fontSize: '1.2rem',
                fontFamily: "'Space Grotesk', sans-serif",
                color: 'var(--text-primary)',
              }}>
                Tushar<span style={{ color: 'var(--accent)' }}>.</span>
              </span>
            </button>

            {/* Desktop Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                 className="hidden-mobile">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.href.replace('#', '');
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNav(link.href)}
                    style={{
                      background: isActive ? 'rgba(245,158,11,0.12)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px 16px',
                      borderRadius: 8,
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.9rem',
                      fontFamily: "'Outfit', sans-serif",
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) (e.target as HTMLButtonElement).style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) (e.target as HTMLButtonElement).style.color = 'var(--text-secondary)';
                    }}
                  >
                    {link.label}
                  </button>
                );
              })}
              <a href="/admin" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', marginLeft: 8 }}>
                Admin
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="show-mobile"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: 8 }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 72,
              left: 0,
              right: 0,
              zIndex: 40,
              background: 'rgba(3, 7, 18, 0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border)',
              padding: '16px 24px 24px',
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleNav(link.href)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '14px 0',
                  color: active === link.href.replace('#', '') ? 'var(--accent)' : 'var(--text-secondary)',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
