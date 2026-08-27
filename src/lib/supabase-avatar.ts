import { createClient } from './supabase/client';

export interface AvatarDBResponse {
  id: string;
  question: string;
  answer: string;
  category: string;
  audio_url?: string;
  created_at?: string;
}

export interface ProjectDBRecord {
  id: string;
  title: string;
  description: string;
  summary?: string | null;
  image_url?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  tech_stack: string[];
  featured?: boolean;
}

export interface CertificateDBRecord {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  url?: string | null;
}

export async function fetchAvatarResponsesFromSupabase(): Promise<AvatarDBResponse[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('avatar_responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as AvatarDBResponse[];
  } catch (err) {
    console.warn('Supabase avatar_responses fetch warning:', err);
    return [];
  }
}

export async function fetchProjectsFromSupabase(): Promise<ProjectDBRecord[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as ProjectDBRecord[];
  } catch (err) {
    console.warn('Supabase projects fetch warning:', err);
    return [];
  }
}

export async function fetchCertificatesFromSupabase(): Promise<CertificateDBRecord[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as CertificateDBRecord[];
  } catch (err) {
    console.warn('Supabase certificates fetch warning:', err);
    return [];
  }
}

export async function addAvatarResponseToSupabase(question: string, answer: string, category = 'general'): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('avatar_responses')
      .insert([{ question, answer, category }]);

    return !error;
  } catch (err) {
    console.warn('Supabase avatar_responses insert error:', err);
    return false;
  }
}

/**
 * Builds dynamic RAG context containing 100% of all fields from Projects, Certifications, and Resume PDF details for AI prompt enrichment.
 */
export async function getLivePortfolioContextSummary(): Promise<string> {
  const [projects, certs] = await Promise.all([
    fetchProjectsFromSupabase(),
    fetchCertificatesFromSupabase(),
  ]);

  let context = '### RESUME & CANDIDATE PROFILE:\n';
  context += '- Candidate Name: Tushar Singh\n';
  context += '- Core Role: Full Stack Developer & AI Application Architect\n';
  context += '- Core Tech Stack: Next.js, React, TypeScript, Three.js WebGL, Node.js, Express, Python, Supabase, PostgreSQL, Tailwind CSS, OpenAI & Gemini APIs\n';
  context += '- Official Resume PDF Download Link: /resume.pdf\n';
  context += '- GitHub Profile: https://github.com/singh-jee2004\n';
  context += '- Instagram: @_tushar.__singh_\n\n';

  context += '### LIVE PROJECTS & WORK EXPERIENCE:\n';
  if (projects.length === 0) {
    context += '- No live project records found in database yet.\n';
  } else {
    projects.forEach((p, idx) => {
      const detailedSummary = p.summary && p.summary.trim() ? p.summary.trim() : p.description;
      context += `${idx + 1}. Project Title: "${p.title}"\n`;
      context += `   - Short Tagline Description: ${p.description || 'N/A'}\n`;
      context += `   - Comprehensive Detailed Summary & Architecture: ${detailedSummary}\n`;
      context += `   - Tech Stack Used: ${Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : 'Full Stack'}\n`;
      context += `   - GitHub Code Repository: ${p.github_url || 'N/A'}\n`;
      context += `   - Live Application Demo URL: ${p.live_url || 'N/A'}\n`;
      context += `   - Project Image / Thumbnail: ${p.image_url || 'N/A'}\n`;
      context += `   - Featured Status: ${p.featured ? 'Yes (Highlight Project)' : 'No'}\n\n`;
    });
  }

  context += '### CERTIFICATIONS & QUALIFICATIONS:\n';
  if (certs.length === 0) {
    context += '- No certification records in database yet.\n';
  } else {
    certs.forEach((c, idx) => {
      context += `${idx + 1}. Title: "${c.title}"\n`;
      context += `   - Issuer / Organization: ${c.issuer}\n`;
      context += `   - Date Issued: ${c.date || 'N/A'}\n`;
      context += `   - Verification URL: ${c.url || 'N/A'}\n\n`;
    });
  }

  return context;
}
