import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Tushar Singh Portfolio',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {children}
    </div>
  );
}
