/**
 * AI Knowledge Base & Assistant Engine for Portfolio Avatar
 */

export interface AvatarKnowledgeItem {
  question: string;
  answer: string;
  category: 'skills' | 'projects' | 'experience' | 'education' | 'contact' | 'general';
  keywords: string[];
}

export const PORTFOLIO_KNOWLEDGE: AvatarKnowledgeItem[] = [
  {
    category: 'general',
    question: 'Who are you?',
    answer: "Hi! I'm Tushar Singh, a Full Stack Developer and AI enthusiast specializing in modern web apps, 3D interactive experiences, and full-stack architecture.",
    keywords: ['who', 'identity', 'about', 'tushar', 'intro', 'name'],
  },
  {
    category: 'skills',
    question: 'What are your skills?',
    answer: "I specialize in Next.js, React, TypeScript, Three.js, React Three Fiber, Node.js, Tailwind CSS, Supabase, PostgreSQL, and AI model integration like Gemini & OpenAI.",
    keywords: ['skills', 'tech', 'stack', 'technologies', 'react', 'next', 'three', 'supabase', 'know', 'expertise'],
  },
  {
    category: 'projects',
    question: 'What projects have you built?',
    answer: "I've built an AI-Powered 3D Avatar Portfolio, WildScan Animal Identifier app, a Recipe Social Platform, Student Result System, and an AI Chatbot powered by Gemini API.",
    keywords: ['projects', 'built', 'portfolio', 'work', 'apps', 'applications', 'wildscan', 'recipe'],
  },
  {
    category: 'experience',
    question: 'What is your background and experience?',
    answer: "I have experience building end-to-end full stack web & mobile applications with real-time database backends, AI integrations, responsive UIs, and interactive 3D WebGL scenes.",
    keywords: ['experience', 'background', 'work', 'history', 'role', 'developer'],
  },
  {
    category: 'education',
    question: 'What is your education?',
    answer: "I am a Computer Science background developer focused on software engineering, AI application development, database management, and modern Web3/3D graphic systems.",
    keywords: ['education', 'degree', 'study', 'college', 'university', 'student', 'qualification'],
  },
  {
    category: 'contact',
    question: 'How can I contact you?',
    answer: "You can reach out via GitHub at github.com/singh-jee2004, Instagram @_tushar.__singh_, or through the contact section right here on my portfolio website!",
    keywords: ['contact', 'email', 'reach', 'hire', 'instagram', 'github', 'connect', 'touch'],
  },
];

/**
 * Finds the best response for a user query from the knowledge base.
 */
export function getAvatarResponse(query: string): string {
  const normalized = query.toLowerCase().trim();

  // Match keyword relevance
  let bestMatch: AvatarKnowledgeItem | null = null;
  let maxScore = 0;

  for (const item of PORTFOLIO_KNOWLEDGE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (normalized.includes(kw)) {
        score += 1;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore > 0) {
    return bestMatch.answer;
  }

  // General fallback response
  return `Thanks for asking! I'm Tushar's AI representative. Tushar is a Full Stack & AI Developer skilled in Next.js, Three.js, Supabase, and AI integration. Feel free to ask about his projects, skills, or contact info!`;
}
