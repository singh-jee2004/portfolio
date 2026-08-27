'use client';

import React from 'react';
import SkullLoader from '@/components/ui/SkullLoader';

export default function FallbackAvatarVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <SkullLoader message="LOADING 3D AVATAR SYSTEM..." />
    </div>
  );
}
