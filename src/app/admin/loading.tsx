import React from 'react';
import SkullLoader from '@/components/ui/SkullLoader';

export default function AdminLoading() {
  return <SkullLoader fullScreen message="AUTHENTICATING ADMIN ACCESS..." />;
}
