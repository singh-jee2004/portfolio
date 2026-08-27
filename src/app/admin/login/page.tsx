'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Code2, ArrowRight, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect straight to admin panel
  useEffect(() => {
    const checkUser = async () => {
      const isLocalAdmin = typeof window !== 'undefined' && localStorage.getItem('admin_session') === 'true';
      if (isLocalAdmin) {
        router.push('/admin');
        return;
      }
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && supabaseUrl.startsWith('http') && !supabaseUrl.includes('placeholder')) {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            router.push('/admin');
          }
        } catch {}
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'tusharsinghr26@gmail.com').toLowerCase();
    const inputEmail = email.trim().toLowerCase();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin12345';

    const isTargetAdmin = inputEmail === adminEmail;
    const isTargetPassword = password === adminPassword;

    // 1. Try Supabase Auth if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isConfigured = supabaseUrl && supabaseUrl.startsWith('http') && !supabaseUrl.includes('placeholder');

    if (isConfigured) {
      try {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: inputEmail,
          password: password,
        });
        if (!authError) {
          localStorage.setItem('admin_session', 'true');
          router.push('/admin');
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local admin verification below if network/DB error
      }
    }

    // 2. Local Admin Credential Verification (Fallback for offline/local environment)
    if (isTargetAdmin && isTargetPassword) {
      localStorage.setItem('admin_session', 'true');
      router.push('/admin');
      setLoading(false);
      return;
    }

    setError('Invalid email or password. Access denied.');
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        padding: '24px',
      }}
      className="grid-bg"
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: 420, padding: '44px 40px' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div
            style={{
              width: 56,
              height: 56,
              margin: '0 auto 16px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Code2 size={26} color="#000" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 6 }}>
            Sign in to manage your portfolio content
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '14px 16px',
              borderRadius: 10,
              marginBottom: 20,
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.25)',
              color: '#f87171',
              fontSize: '0.85rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 8,
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="email"
                id="admin-email"
                className="input-field"
                placeholder="tusharsinghr26@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: 42 }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 8,
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type={showPwd ? 'text' : 'password'}
                id="admin-password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: 42, paddingRight: 44 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
                aria-label="Toggle password visibility"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="admin-login-btn"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
          >
            {loading ? 'Signing in...' : <><ArrowRight size={18} /> Sign In</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          <a href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Back to Portfolio</a>
        </p>
      </motion.div>
    </div>
  );
}
