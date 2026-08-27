'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkullLoader from '@/components/ui/SkullLoader';
import { ExternalLink, Star, Layers, FolderOpen } from 'lucide-react';
import { GithubIcon } from '../ui/Icons';
import { createClient } from '../../lib/supabase/client';
import type { Project } from '../../types';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const techList = Array.isArray(project.tech_stack) ? project.tech_stack : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-6px)' : 'none',
        boxShadow: hovered ? '0 20px 60px rgba(245,158,11,0.15)' : 'none',
      }}
    >
      {/* Featured badge */}
      {project.featured && (
        <div style={{
          position: 'absolute', top: 14, right: 14, zIndex: 2,
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px',
          background: 'rgba(245,158,11,0.2)',
          border: '1px solid rgba(245,158,11,0.4)',
          borderRadius: 99,
          fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)',
        }}>
          <Star size={11} fill="currentColor" /> Featured
        </div>
      )}

      {/* Image / Placeholder */}
      <div style={{
        height: 180,
        background: `linear-gradient(135deg, rgba(17,24,39,0.9), rgba(245,158,11,0.08))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {project.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Layers size={40} style={{ color: 'var(--accent)', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8 }}>Screenshot coming soon</p>
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 60%)',
        }} />
      </div>

      {/* Content */}
      <div style={{ padding: '22px 24px' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 10, fontFamily: "'Space Grotesk', sans-serif" }}>
          {project.title}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: 18 }}>
          {project.description}
        </p>

        {/* Tech Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 20 }}>
          {techList.map(tech => (
            <span key={tech} className="tech-badge" style={{ fontSize: '0.7rem' }}>
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 12 }}>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="btn-outline"
              style={{ padding: '8px 16px', fontSize: '0.82rem', flex: 1, justifyContent: 'center' }}>
              <GithubIcon size={15} /> Code
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.82rem', flex: 1, justifyContent: 'center' }}>
              <ExternalLink size={15} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let supabaseChannel: ReturnType<ReturnType<typeof createClient>['channel']> | null = null;

    const fetchProjects = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))) {
          const client = createClient();
          const { data } = await client.from('projects').select('*').order('created_at', { ascending: false });
          if (data && data.length > 0) {
            setProjects(data as Project[]);
            setLoading(false);
            return;
          }
        }
        // Fallback to localStorage if set via Admin Panel
        const local = localStorage.getItem('portfolio_projects');
        if (local) {
          setProjects(JSON.parse(local));
        }
      } catch {
        const local = localStorage.getItem('portfolio_projects');
        if (local) {
          try { setProjects(JSON.parse(local)); } catch {}
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // 1. Listen for local custom events (Admin mutations in same tab)
    window.addEventListener('portfolio_data_updated', fetchProjects);
    // 2. Listen for storage events (Admin mutations in different tab)
    window.addEventListener('storage', fetchProjects);

    // 3. Listen for Supabase Realtime changes
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))) {
      try {
        const client = createClient();
        supabaseChannel = client
          .channel('realtime-projects-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
            fetchProjects();
          })
          .subscribe();
      } catch {
        // ignore realtime subscription failures
      }
    }

    return () => {
      window.removeEventListener('portfolio_data_updated', fetchProjects);
      window.removeEventListener('storage', fetchProjects);
      if (supabaseChannel) {
        try { supabaseChannel.unsubscribe(); } catch {}
      }
    };
  }, []);

  const displayed = filter === 'featured' ? projects.filter(p => p.featured) : projects;

  return (
    <section id="projects" className="section">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 48 }}
        >
          <p className="section-label">My Work</p>
          <h2 className="section-title">Featured Projects</h2>
          <div className="accent-line" />
          <p className="section-subtitle" style={{ marginTop: 16 }}>
            A selection of real-world projects I&apos;ve built. Add more via the admin dashboard.
          </p>
        </motion.div>

        {/* Filter */}
        {projects.length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
            {(['all', 'featured'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '9px 22px', borderRadius: 99, border: filter === f ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: filter === f ? 'rgba(245,158,11,0.12)' : 'transparent',
                  color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: filter === f ? 700 : 400,
                  fontSize: '0.88rem', cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                  transition: 'all 0.2s',
                }}>
                {f === 'all' ? '🚀 All Projects' : '⭐ Featured'}
              </button>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
            <SkullLoader message="FETCHING PROJECTS DATA..." />
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ padding: '60px 40px', textAlign: 'center', border: '1.5px dashed var(--border)' }}
          >
            <FolderOpen size={48} style={{ color: 'var(--accent)', opacity: 0.5, margin: '0 auto 16px' }} />
            <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
              No projects yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: 420, margin: '0 auto' }}>
              Projects will appear here once added via the <strong style={{ color: 'var(--accent)' }}>Admin Dashboard</strong>. Head to <code style={{ color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem' }}>/admin</code> to add your first project!
            </p>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && displayed.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {displayed.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
