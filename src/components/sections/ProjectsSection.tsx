'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Layers } from 'lucide-react';
import { GithubIcon } from '../ui/Icons';
import { createClient } from '../../lib/supabase/client';
import type { Project } from '../../types';

/* ── Placeholder projects (shown before Supabase is configured) ── */
const PLACEHOLDER_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'WildScan — Animal Identifier',
    description: 'AI-powered mobile application for real-time animal identification using React Native, Expo, and Supabase backend with a custom ML classification model.',
    image_url: null,
    github_url: 'https://github.com/tusharsingh/wildscan',
    live_url: null,
    tech_stack: ['React Native', 'Expo', 'Supabase', 'Python', 'TensorFlow'],
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: '3D Developer Portfolio',
    description: 'This very website! An immersive 3D portfolio built with Next.js 16, React Three Fiber, Framer Motion, and Supabase for the backend CMS.',
    image_url: null,
    github_url: 'https://github.com/tusharsingh/portfolio',
    live_url: 'https://tusharsingh.dev',
    tech_stack: ['Next.js', 'Three.js', 'TypeScript', 'Supabase', 'Framer Motion'],
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Student Result Management System',
    description: 'A comprehensive result management system with role-based access, custom grading logic (A★ to F), and a animated loading experience.',
    image_url: null,
    github_url: 'https://github.com/tusharsingh/student-results',
    live_url: null,
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Express', 'Tailwind CSS'],
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Recipe Social Platform',
    description: 'A full-featured recipe sharing social platform with likes, comments, recipe CRUD, search & filter functionality, and real-time updates.',
    image_url: null,
    github_url: 'https://github.com/tusharsingh/recipe-social',
    live_url: null,
    tech_stack: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind CSS'],
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Ultron AI Assistant',
    description: 'A real-time AI voice assistant with a futuristic HUD interface, integrating OpenAI GPT, browser speech recognition, and neural voice synthesis.',
    image_url: null,
    github_url: 'https://github.com/tusharsingh/ultron',
    live_url: null,
    tech_stack: ['React', 'FastAPI', 'Python', 'OpenAI', 'WebSpeech API'],
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'AI Chatbot Platform',
    description: 'Multi-model AI chatbot platform supporting GPT-4, Claude, and Gemini with conversation history, file uploads, and custom personas.',
    image_url: null,
    github_url: 'https://github.com/tusharsingh/ai-chatbot',
    live_url: null,
    tech_stack: ['Next.js', 'OpenAI', 'Anthropic', 'Vercel AI SDK', 'Prisma'],
    featured: false,
    created_at: new Date().toISOString(),
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);

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
          {project.tech_stack.map(tech => (
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
  const [projects, setProjects] = useState<Project[]>(PLACEHOLDER_PROJECTS);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://'))) return;

    const client = createClient();
    client.from('projects').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setProjects(data as Project[]); });
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

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {displayed.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
