import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../lib/supabase/server';

const KNOWLEDGE_BASE = {
  name: 'Tushar Singh',
  title: 'Full Stack Developer & AI Enthusiast',
  journey: 'Started coding journey in 2024 (2+ years of experience).',
  education: 'B.Tech in Computer Science & Engineering.',
  location: 'India 🇮🇳',
  email: 'tusharsinghr26@gmail.com',
  github: 'https://github.com/singh-jee2004',
  status: 'Open to full-stack engineering opportunities, freelancing, and AI collaborations.',
  techStack: {
    frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML & CSS'],
    backend: ['Node.js', 'Express.js', 'Python', 'FastAPI', 'REST APIs'],
    database: ['PostgreSQL', 'Supabase', 'MongoDB', 'MySQL'],
    ai: ['OpenAI API', 'LangChain', 'Hugging Face', 'GitHub Copilot'],
    tools: ['Git & GitHub', 'Docker', 'VS Code', 'Vercel', 'Linux'],
  },
};

// Fetch live projects from Supabase
async function fetchProjects(): Promise<{ title: string; description: string; tech_stack: string[] }[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('projects')
      .select('title, description, tech_stack')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

function formatProjectsForReply(projects: { title: string; description: string; tech_stack: string[] }[]): string {
  if (projects.length === 0) {
    return `Tushar hasn't added any projects to the portfolio yet. Check back soon — he's always building something new! 🚀`;
  }

  const list = projects
    .map((p, i) => `${i + 1}. **${p.title}** — ${p.description}${p.tech_stack?.length ? ` _(${p.tech_stack.join(', ')})_` : ''}`)
    .join('\n');

  return `Tushar has **${projects.length} project${projects.length > 1 ? 's' : ''}** in his portfolio:\n\n${list}\n\nExplore them all in the **Projects** section!`;
}

function formatProjectsForContext(projects: { title: string; description: string; tech_stack: string[] }[]): string {
  if (projects.length === 0) return 'No projects added yet.';
  return projects
    .map((p) => `- ${p.title}: ${p.description} (Tech: ${p.tech_stack?.join(', ') || 'N/A'})`)
    .join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const query = message.toLowerCase().trim();

    // Fetch live projects from database
    const projects = await fetchProjects();

    // Check if OpenAI key is present
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey) {
      try {
        const projectContext = formatProjectsForContext(projects);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are TusharAI, the personal AI assistant for Tushar Singh's 3D Portfolio. Answer concisely, professionally, and enthusiastically using this context:
Name: ${KNOWLEDGE_BASE.name}
Title: ${KNOWLEDGE_BASE.title}
Journey: ${KNOWLEDGE_BASE.journey}
Education: ${KNOWLEDGE_BASE.education}
Location: ${KNOWLEDGE_BASE.location}
Email: ${KNOWLEDGE_BASE.email}
GitHub: ${KNOWLEDGE_BASE.github}
Status: ${KNOWLEDGE_BASE.status}
Tech Stack: ${JSON.stringify(KNOWLEDGE_BASE.techStack)}
Portfolio Projects:\n${projectContext}`,
              },
              { role: 'user', content: message },
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (err) {
        console.warn('OpenAI call failed, using intelligent local engine:', err);
      }
    }

    // Intelligent Local Knowledge Base Engine
    let reply = '';

    if (query.includes('hi') || query.includes('hello') || query.includes('hey') || query.includes('who are you')) {
      reply = `Hello! 👋 I'm **TusharAI**, Tushar Singh's personal AI assistant. I can answer questions about Tushar's skills, projects, background, or how to get in touch with him. How can I help you today?`;
    } else if (query.includes('skill') || query.includes('tech') || query.includes('stack') || query.includes('tool')) {
      reply = `Tushar is a versatile **Full Stack Developer** specializing in:\n\n• **Frontend:** React, Next.js, TypeScript, Tailwind CSS, JavaScript\n• **Backend:** Node.js, Express, Python, FastAPI, REST APIs\n• **Databases:** Supabase, PostgreSQL, MongoDB, MySQL\n• **AI & Tools:** OpenAI API, LangChain, Git, Docker, Vercel, Linux`;
    } else if (query.includes('project') || query.includes('work') || query.includes('built') || query.includes('portfolio')) {
      reply = formatProjectsForReply(projects);
    } else if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('hire') || query.includes('job') || query.includes('available')) {
      reply = `Tushar is currently **${KNOWLEDGE_BASE.status}**\n\n📫 **Email:** ${KNOWLEDGE_BASE.email}\n🐙 **GitHub:** ${KNOWLEDGE_BASE.github}\n\nYou can also send a direct message using the **Contact Form** on this website!`;
    } else if (query.includes('journey') || query.includes('experience') || query.includes('year') || query.includes('start')) {
      reply = `Tushar started his programming journey in **2024** (2+ years of hands-on coding). He continues to build high-performance production software and AI-powered applications.`;
    } else if (query.includes('education') || query.includes('college') || query.includes('degree') || query.includes('university') || query.includes('study')) {
      reply = `Tushar is pursuing his **B.Tech in Computer Science & Engineering**, with a strong foundation in Data Structures, Algorithms, Software Engineering, and Artificial Intelligence.`;
    } else {
      reply = `Tushar Singh is a **Full Stack Developer & AI Enthusiast** based in India 🇮🇳 (started coding in 2024). He excels in React, Next.js, Node.js, Python, Supabase, and AI integrations. Feel free to ask about his skills, projects, education, or contact details!`;
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Chat API Error:', err);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
