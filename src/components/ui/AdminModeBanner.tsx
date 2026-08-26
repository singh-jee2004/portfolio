'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, LogOut, LayoutDashboard, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminModeBanner() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      // 1. Check local session
      const localAdmin = localStorage.getItem('admin_session') === 'true';
      if (localAdmin) {
        setIsAdminLoggedIn(true);
        return;
      }

      // 2. Check Supabase session
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && supabaseUrl.startsWith('http')) {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAdminLoggedIn(true);
          return;
        }
      }

      setIsAdminLoggedIn(false);
    };

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    localStorage.removeItem('admin_session');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl.startsWith('http')) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {}
    }
    setIsAdminLoggedIn(false);
    window.location.href = '/admin/login';
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isAdminLoggedIn ? (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-slate-950/90 border-b border-amber-500/30 backdrop-blur-md px-4 py-2 flex items-center justify-between text-xs font-mono select-none shadow-[0_0_20px_rgba(245,158,11,0.15)]"
        >
          <div className="flex items-center gap-2 text-amber-400 font-semibold tracking-wider">
            <ShieldCheck size={16} className="text-amber-400 animate-pulse" />
            <span>ADMIN CONTROL MODE ACTIVE</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all font-sans font-medium text-xs"
            >
              <LayoutDashboard size={13} />
              Dashboard
            </a>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-950/50 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition-all font-sans font-medium text-xs cursor-pointer"
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-[90]"
        >
          <a
            href="/admin/login"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all text-xs font-mono font-medium tracking-wide group"
            title="Access Admin Dashboard"
          >
            <Lock size={14} className="group-hover:scale-110 transition-transform" />
            <span>Admin Sign In</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
