import React from 'react';
import SkullLoader from '@/components/ui/SkullLoader';

export default function GlobalLoading() {
  return <SkullLoader fullScreen message="LOADING PORTFOLIO DATA..." />;
}
