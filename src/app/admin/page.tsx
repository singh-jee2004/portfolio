'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SkullLoader from '@/components/ui/SkullLoader';
import { Plus, Trash2, Edit3, Eye, MessageSquare, FolderOpen, LogOut, Upload, X, Check, Code2, Home, Award } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Project, Message, Certification } from '@/types';

type Tab = 'projects' | 'certificates' | 'messages' | 'resume';

const EMPTY_PROJECT: Omit<Project, 'id' | 'created_at'> = {
  title: '', description: '', summary: '', image_url: null,
  github_url: null, live_url: null, tech_stack: [], featured: false,
};

const EMPTY_CERT = {
  title: '',
  issuer: '',
  date: '',
  url: '',
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [certificates, setCertificates] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  // Project Form State
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [techInput, setTechInput] = useState('');

  // Certificate Form State
  const [certForm, setCertForm] = useState(EMPTY_CERT);
  const [editingCert, setEditingCert] = useState<string | null>(null);
  const [showCertForm, setShowCertForm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeMsg, setResumeMsg] = useState('');

  const router = useRouter();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = Boolean(supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')));
  const supabase = createClient();

  // Strict session check: Redirect to login if user signed out
  useEffect(() => {
    const verifySession = async () => {
      const isLocalAdmin = typeof window !== 'undefined' && localStorage.getItem('admin_session') === 'true';
      if (isLocalAdmin) return;

      if (isConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/admin/login');
        }
      } else if (!isLocalAdmin) {
        router.push('/admin/login');
      }
    };
    verifySession();
  }, [isConfigured, router, supabase.auth]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const checkAdminAuth = async (): Promise<boolean> => {
    const isLocalAdmin = typeof window !== 'undefined' && localStorage.getItem('admin_session') === 'true';
    if (isLocalAdmin) return true;

    if (isConfigured) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) return true;
    }

    showToast('Unauthorized: Please sign in to make changes');
    router.push('/admin/login');
    return false;
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isAuth = await checkAdminAuth();
    if (!isAuth) return;

    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please select a valid PDF file (.pdf)');
      return;
    }
    setUploadingResume(true);
    setResumeMsg('Uploading resume PDF...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Resume PDF uploaded successfully!');
        setResumeMsg('Resume updated successfully! The "Download PDF" button is now active.');
      } else {
        showToast(data.error || 'Upload failed');
        setResumeMsg('');
      }
    } catch {
      showToast('Upload error occurred');
      setResumeMsg('');
    } finally {
      setUploadingResume(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      let loadedProjects: Project[] = [];
      let loadedMessages: Message[] = [];
      let loadedCerts: Certification[] = [];

      if (isConfigured) {
        try {
          const [p, m, c] = await Promise.all([
            supabase.from('projects').select('*').order('created_at', { ascending: false }),
            supabase.from('messages').select('*').order('created_at', { ascending: false }),
            supabase.from('certificates').select('*').order('created_at', { ascending: false }),
          ]);
          if (p.data && p.data.length > 0) loadedProjects = p.data as Project[];
          if (m.data && m.data.length > 0) loadedMessages = m.data as Message[];
          if (c.data && c.data.length > 0) loadedCerts = c.data as Certification[];
        } catch {
          // Fallback to local storage if network or DB request fails
        }
      }

      if (loadedProjects.length === 0) {
        const localP = localStorage.getItem('portfolio_projects');
        if (localP) {
          try { loadedProjects = JSON.parse(localP); } catch { loadedProjects = []; }
        }
      }

      if (loadedMessages.length === 0) {
        const localM = localStorage.getItem('portfolio_messages');
        if (localM) {
          try { loadedMessages = JSON.parse(localM); } catch { loadedMessages = []; }
        }
      }

      if (loadedCerts.length === 0) {
        const local = localStorage.getItem('portfolio_certifications');
        if (local) {
          try { loadedCerts = JSON.parse(local); } catch { loadedCerts = []; }
        }
      }

      if (!cancelled) {
        setProjects(loadedProjects);
        setMessages(loadedMessages);
        setCertificates(loadedCerts);
        setLoading(false);
      }
    };

    fetchData();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfigured]);

  // Project Handlers
  const handleSave = async () => {
    const isAuth = await checkAdminAuth();
    if (!isAuth) return;

    if (!form.title.trim()) { showToast('Title is required'); return; }
    setSaving(true);
    let updatedProjects: Project[] = [...projects];

    let supabaseSuccess = false;
    if (isConfigured) {
      try {
        if (editing) {
          const { error } = await supabase.from('projects').update(form).eq('id', editing);
          if (error) {
            console.error('Supabase update error:', error);
            showToast(`⚠️ Cloud save failed: ${error.message}. Saved locally only.`);
          } else {
            supabaseSuccess = true;
          }
        } else {
          const { error } = await supabase.from('projects').insert(form);
          if (error) {
            console.error('Supabase insert error:', error);
            showToast(`⚠️ Cloud save failed: ${error.message}. Saved locally only.`);
          } else {
            supabaseSuccess = true;
          }
        }
      } catch (err) {
        console.error('Supabase network error:', err);
        showToast('⚠️ Cloud save failed (network error). Saved locally only.');
      }
    }

    // If Supabase succeeded, re-fetch from DB to get the server-generated id
    if (supabaseSuccess) {
      try {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          updatedProjects = data as Project[];
        }
      } catch {
        // Fall through to local update
      }
    }

    if (!supabaseSuccess) {
      if (editing) {
        updatedProjects = updatedProjects.map(p => p.id === editing ? { ...p, ...form } : p);
      } else {
        const newProj: Project = {
          id: Date.now().toString(),
          ...form,
          created_at: new Date().toISOString(),
        };
        updatedProjects = [newProj, ...updatedProjects];
      }
    }

    setProjects(updatedProjects);
    localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('portfolio_data_updated'));

    setForm(EMPTY_PROJECT); setEditing(null); setShowForm(false);
    if (supabaseSuccess) showToast(editing ? 'Project updated (synced to cloud)!' : 'Project added (synced to cloud)!');
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const isAuth = await checkAdminAuth();
    if (!isAuth) return;

    if (!confirm('Delete this project?')) return;
    if (isConfigured) {
      try { await supabase.from('projects').delete().eq('id', id); } catch { }
    }
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('portfolio_projects', JSON.stringify(updated));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('portfolio_data_updated'));
    showToast('Project deleted');
  };

  const handleEdit = (p: Project) => {
    setForm({ title: p.title, description: p.description, summary: p.summary || '', image_url: p.image_url, github_url: p.github_url, live_url: p.live_url, tech_stack: p.tech_stack, featured: p.featured });
    setEditing(p.id); setShowForm(true);
  };

  const addTech = () => {
    if (techInput.trim() && !form.tech_stack.includes(techInput.trim())) {
      setForm(f => ({ ...f, tech_stack: [...f.tech_stack, techInput.trim()] }));
    }
    setTechInput('');
  };

  // Certificate Handlers
  const handleSaveCert = async () => {
    const isAuth = await checkAdminAuth();
    if (!isAuth) return;

    if (!certForm.title.trim()) { showToast('Certificate Title is required'); return; }
    setSaving(true);

    const certData = {
      title: certForm.title.trim(),
      issuer: certForm.issuer.trim() || 'Verified Provider',
      date: certForm.date.trim(),
      url: certForm.url.trim() || null,
      image_url: null,
    };

    let updatedCerts: Certification[] = [...certificates];

    let certSupabaseSuccess = false;
    if (isConfigured) {
      try {
        if (editingCert) {
          const { error } = await supabase.from('certificates').update(certData).eq('id', editingCert);
          if (error) {
            console.error('Supabase cert update error:', error);
            showToast(`⚠️ Cloud save failed: ${error.message}. Saved locally only.`);
          } else {
            certSupabaseSuccess = true;
          }
        } else {
          const { error } = await supabase.from('certificates').insert(certData);
          if (error) {
            console.error('Supabase cert insert error:', error);
            showToast(`⚠️ Cloud save failed: ${error.message}. Saved locally only.`);
          } else {
            certSupabaseSuccess = true;
          }
        }
      } catch (err) {
        console.error('Supabase cert network error:', err);
        showToast('⚠️ Cloud save failed (network error). Saved locally only.');
      }
    }

    if (certSupabaseSuccess) {
      try {
        const { data } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          updatedCerts = data as Certification[];
        }
      } catch {
        // Fall through
      }
    }

    if (!certSupabaseSuccess) {
      if (editingCert) {
        updatedCerts = updatedCerts.map(c => c.id === editingCert ? { ...c, ...certData } : c);
      } else {
        const newCert: Certification = {
          id: Date.now().toString(),
          ...certData,
        };
        updatedCerts = [newCert, ...updatedCerts];
      }
    }

    setCertificates(updatedCerts);
    localStorage.setItem('portfolio_certifications', JSON.stringify(updatedCerts));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('portfolio_data_updated'));

    setCertForm(EMPTY_CERT); setEditingCert(null); setShowCertForm(false);
    if (certSupabaseSuccess) showToast(editingCert ? 'Certificate updated (synced to cloud)!' : 'Certificate added (synced to cloud)!');
    setSaving(false);
  };

  const handleDeleteCert = async (id: string) => {
    const isAuth = await checkAdminAuth();
    if (!isAuth) return;

    if (!confirm('Delete this certificate?')) return;
    if (isConfigured) {
      try { await supabase.from('certificates').delete().eq('id', id); } catch { }
    }
    const updated = certificates.filter(c => c.id !== id);
    setCertificates(updated);
    localStorage.setItem('portfolio_certifications', JSON.stringify(updated));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('portfolio_data_updated'));
    showToast('Certificate deleted');
  };

  const handleEditCert = (c: Certification) => {
    setCertForm({
      title: c.title,
      issuer: c.issuer,
      date: c.date || '',
      url: c.url || '',
    });
    setEditingCert(c.id);
    setShowCertForm(true);
  };

  const TABS = [
    { key: 'projects' as Tab, label: 'Projects', icon: FolderOpen },
    { key: 'certificates' as Tab, label: 'Certifications', icon: Award },
    { key: 'messages' as Tab, label: 'Messages', icon: MessageSquare },
    { key: 'resume' as Tab, label: 'Resume', icon: Upload },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', padding: '28px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, padding: '0 8px' }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,var(--accent),var(--accent-dark))', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Code2 size={17} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>Admin Panel</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: tab === key ? 'rgba(245,158,11,0.12)' : 'transparent', color: tab === key ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: tab === key ? 600 : 400, fontFamily: "'Outfit',sans-serif", fontSize: '0.9rem', transition: 'all 0.2s', width: '100%', textAlign: 'left' }}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            <Home size={16} /> View Site
          </Link>
          <button onClick={async () => {
            localStorage.removeItem('admin_session');
            if (isConfigured) { try { await supabase.auth.signOut(); } catch { } }
            router.push('/admin/login');
          }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: '#f87171', fontFamily: "'Outfit',sans-serif", fontSize: '0.88rem', width: '100%', textAlign: 'left' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 36px', maxWidth: 'calc(100vw - 240px)' }}>
        {/* Toast */}
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'fixed', top: 24, right: 24, zIndex: 100, background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)', borderRadius: 10, padding: '12px 20px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <Check size={16} /> {toast}
          </motion.div>
        )}

        {!isConfigured && (
          <div style={{ marginBottom: 28, padding: '16px 20px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 12, color: 'var(--accent)', fontSize: '0.9rem' }}>
            ⚠️ Supabase not configured. Add credentials to <code style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 4 }}>.env.local</code> to enable full cloud sync.
          </div>
        )}

        {/* ── PROJECTS TAB ── */}
        {tab === 'projects' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <h1 style={{ fontWeight: 800, fontSize: '1.6rem', fontFamily: "'Space Grotesk',sans-serif" }}>Projects</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>{projects.length} projects in your portfolio</p>
              </div>
              <button onClick={() => { setForm(EMPTY_PROJECT); setEditing(null); setShowForm(true); }} className="btn-primary">
                <Plus size={17} /> Add Project
              </button>
            </div>

            {/* Project Form Modal */}
            {showForm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card" style={{ width: '100%', maxWidth: 640, padding: 36, maxHeight: '90vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.2rem', fontFamily: "'Space Grotesk',sans-serif" }}>{editing ? 'Edit Project' : 'New Project'}</h2>
                    <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      { label: 'Title *', key: 'title', ph: 'My Awesome Project' },
                      { label: 'GitHub URL', key: 'github_url', ph: 'https://github.com/...' },
                      { label: 'Live URL', key: 'live_url', ph: 'https://myproject.com' },
                      { label: 'Image URL', key: 'image_url', ph: 'https://cdn.../screenshot.png' },
                    ].map(({ label, key, ph }) => (
                      <div key={key}>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 7 }}>{label}</label>
                        <input className="input-field" placeholder={ph} value={(form as Record<string, unknown>)[key] as string || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value || null }))} />
                      </div>
                    ))}

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 7 }}>Short Description</label>
                      <textarea className="input-field" rows={2} placeholder="Brief tagline summary..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--accent)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 7, fontWeight: 700 }}>
                        Detailed Project Summary (AI Assistant Memory &amp; RAG)
                      </label>
                      <textarea className="input-field" rows={4} placeholder="Write a detailed summary of key features, architecture, and impact so the AI Avatar can explain this project in depth..." value={form.summary || ''} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} style={{ resize: 'vertical' }} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 7 }}>Tech Stack</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input className="input-field" placeholder="React, Node.js..." value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} />
                        <button type="button" onClick={addTech} className="btn-outline" style={{ padding: '10px 16px', borderRadius: 10, whiteSpace: 'nowrap' }}>Add</button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                        {form.tech_stack.map(t => (
                          <span key={t} className="tech-badge" style={{ cursor: 'pointer' }} onClick={() => setForm(f => ({ ...f, tech_stack: f.tech_stack.filter(x => x !== t) }))}>{t} ×</span>
                        ))}
                      </div>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mark as Featured</span>
                    </label>

                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                      <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                        {saving ? 'Saving...' : <><Check size={16} /> {editing ? 'Update' : 'Create'} Project</>}
                      </button>
                      <button onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Projects List */}
            {loading ? (
              <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
                <SkullLoader message="LOADING ADMIN PROJECTS..." />
              </div>
            ) : projects.length === 0 ? (
              <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
                <FolderOpen size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-muted)' }}>No projects yet. Click &quot;Add Project&quot; to get started.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {projects.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>{p.title}</span>
                        {p.featured && <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 99, color: 'var(--accent)' }}>Featured</span>}
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                        {p.tech_stack.slice(0, 4).map(t => <span key={t} className="tech-badge" style={{ fontSize: '0.68rem' }}>{t}</span>)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', color: 'var(--text-muted)', transition: 'all 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}><Eye size={15} /></a>}
                      <button onClick={() => handleEdit(p)} style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}><Edit3 size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(248,113,113,0.2)', background: 'transparent', color: '#f87171', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}><Trash2 size={15} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CERTIFICATIONS TAB ── */}
        {tab === 'certificates' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <h1 style={{ fontWeight: 800, fontSize: '1.6rem', fontFamily: "'Space Grotesk',sans-serif" }}>Certifications</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>{certificates.length} certifications on your resume</p>
              </div>
              <button onClick={() => { setCertForm(EMPTY_CERT); setEditingCert(null); setShowCertForm(true); }} className="btn-primary">
                <Plus size={17} /> Add Certification
              </button>
            </div>

            {/* Certification Form Modal */}
            {showCertForm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card" style={{ width: '100%', maxWidth: 540, padding: 36, maxHeight: '90vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.2rem', fontFamily: "'Space Grotesk',sans-serif" }}>{editingCert ? 'Edit Certification' : 'New Certification'}</h2>
                    <button onClick={() => setShowCertForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 7 }}>Title / Certificate Name *</label>
                      <input className="input-field" placeholder="e.g. AWS Certified Solutions Architect" value={certForm.title} onChange={e => setCertForm(f => ({ ...f, title: e.target.value }))} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 7 }}>Issuer / Organization</label>
                      <input className="input-field" placeholder="e.g. Amazon Web Services, Meta, Coursera" value={certForm.issuer} onChange={e => setCertForm(f => ({ ...f, issuer: e.target.value }))} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 7 }}>Issue Date / Year</label>
                      <input className="input-field" placeholder="e.g. 2024" value={certForm.date} onChange={e => setCertForm(f => ({ ...f, date: e.target.value }))} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 7 }}>Credential / Verification Link</label>
                      <input className="input-field" placeholder="https://coursera.org/verify/..." value={certForm.url} onChange={e => setCertForm(f => ({ ...f, url: e.target.value }))} />
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                      <button onClick={handleSaveCert} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                        {saving ? 'Saving...' : <><Check size={16} /> {editingCert ? 'Update' : 'Add'} Certification</>}
                      </button>
                      <button onClick={() => setShowCertForm(false)} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Certifications List */}
            {loading ? (
              <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
                <SkullLoader message="LOADING CERTIFICATIONS..." />
              </div>
            ) : certificates.length === 0 ? (
              <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
                <Award size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-muted)' }}>No certifications added yet. Click &quot;Add Certification&quot; to get started.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {certificates.map((c, i) => (
                  <motion.div key={c.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', display: 'block' }}>{c.title}</span>
                      <p style={{ color: 'var(--accent-light)', fontSize: '0.84rem', marginTop: 3 }}>
                        {c.issuer} {c.date ? `• ${c.date}` : ''}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', color: 'var(--text-muted)', transition: 'all 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}><Eye size={15} /></a>}
                      <button onClick={() => handleEditCert(c)} style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}><Edit3 size={15} /></button>
                      <button onClick={() => handleDeleteCert(c.id)} style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(248,113,113,0.2)', background: 'transparent', color: '#f87171', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}><Trash2 size={15} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
        {tab === 'messages' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontWeight: 800, fontSize: '1.6rem', fontFamily: "'Space Grotesk',sans-serif" }}>Messages</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>{messages.length} messages received</p>
            </div>
            {messages.length === 0 ? (
              <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
                <MessageSquare size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-muted)' }}>No messages yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {messages.map((m, i) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card" style={{ padding: '22px 26px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <span style={{ fontWeight: 700 }}>{m.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: 12 }}>{m.email}</span>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: "'JetBrains Mono',monospace" }}>{new Date(m.created_at).toLocaleDateString()}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>{m.message}</p>
                    <div style={{ marginTop: 14 }}>
                      <a href={`mailto:${m.email}`} className="btn-outline" style={{ padding: '7px 16px', fontSize: '0.82rem' }}>Reply via Email</a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RESUME TAB ── */}
        {tab === 'resume' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontWeight: 800, fontSize: '1.6rem', fontFamily: "'Space Grotesk',sans-serif" }}>Resume & Files</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>Upload your resume PDF and manage certifications</p>
            </div>

            <div className="glass-card" style={{ padding: 48, textAlign: 'center', border: '2px dashed var(--border-hover)' }}>
              <input
                type="file"
                accept=".pdf"
                id="resume-file-input"
                style={{ display: 'none' }}
                onChange={handleResumeUpload}
                disabled={uploadingResume}
              />

              <Upload size={48} style={{ color: 'var(--accent)', margin: '0 auto 16px', opacity: uploadingResume ? 0.5 : 1 }} />
              <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>Upload Resume PDF</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
                Select your updated resume PDF. It will immediately activate the &quot;Download PDF&quot; button on your live portfolio.
              </p>

              {resumeMsg && (
                <div style={{ marginBottom: 20, color: 'var(--accent-light)', fontSize: '0.9rem', fontWeight: 600 }}>
                  ✅ {resumeMsg}
                </div>
              )}

              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <label
                  htmlFor="resume-file-input"
                  className="btn-primary"
                  style={{ cursor: uploadingResume ? 'wait' : 'pointer', display: 'inline-flex', opacity: uploadingResume ? 0.7 : 1 }}
                >
                  <Upload size={18} /> {uploadingResume ? 'Uploading PDF...' : 'Choose PDF File'}
                </label>

                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ display: 'inline-flex' }}
                >
                  Preview Current Resume ↗
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
