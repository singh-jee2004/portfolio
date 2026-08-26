'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import SkullLoader from '@/components/ui/SkullLoader';

export default function GlobalRouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('INITIALIZING SYSTEM...');

  // Hide loader when path or search params finish updating
  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  // Global click listener for links and admin navigation
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target) {
        const href = target.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
          if (href.includes('/admin')) {
            setLoadingMsg('AUTHENTICATING ADMIN ACCESS...');
          } else {
            setLoadingMsg('SYSTEM INITIALIZING...');
          }
          setLoading(true);
          // Safety timeout in case navigation is instant
          setTimeout(() => setLoading(false), 1200);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  if (!loading) return null;

  return <SkullLoader fullScreen message={loadingMsg} />;
}
