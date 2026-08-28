/**
 * AI Knowledge Base & Assistant Engine for Portfolio Avatar
 */

export interface AvatarKnowledgeItem {
  question: string;
  answer: string;
  category: 'skills' | 'projects' | 'experience' | 'education' | 'interests' | 'languages' | 'contact' | 'general' | 'girlfriend' | 'family';
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
    answer: "I specialize in Next.js, React, TypeScript, Three.js, React Three Fiber, Node.js, Express, Python, Tailwind CSS, Supabase, PostgreSQL, and AI model integration like Gemini & OpenAI.",
    keywords: ['skills', 'tech', 'stack', 'technologies', 'react', 'next', 'three', 'supabase', 'know', 'expertise'],
  },
  {
    category: 'languages',
    question: 'What coding languages do you know?',
    answer: "Tushar is proficient in the following programming languages & frameworks:\n\n• **Coding Languages:** JavaScript (ES6+), TypeScript, Python, HTML5, CSS3, SQL\n• **Frameworks & Runtime:** React, Next.js, Node.js, Express, FastAPI, Three.js / WebGL, Tailwind CSS\n• **Databases & Tools:** Supabase, PostgreSQL, MongoDB, Git, Docker",
    keywords: ['language', 'languages', 'coding languages', 'programming languages', 'code in', 'speak'],
  },
  {
    category: 'education',
    question: 'What is your educational background?',
    answer: "Tushar's Educational Background:\n\n• Has completed secondary education from INDIA INTERNATIONAL SCHOOL with a Percentile of 80% \n\n• He has also Completed Diploma in Civil Engineering from Asansol Polytechnic with a percentile of 70% \n\n• **Currently Pursuing:** B.Tech in Computer Science & Engineering (CSE) with specializations in Software Engineering, Web Technologies, Data Structures & Algorithms, and Artificial Intelligence.",
    keywords: ['education', 'educational', 'degree', 'study', 'studying', 'college', 'university', 'student', 'qualification', 'high school', 'btech', 'b.tech', 'school', 'polytechnic', 'diploma'],
  },
  {
    category: 'interests',
    question: 'What are your interests and hobbies?',
    answer: "Tushar's Interests & Hobbies:\n\n• **Technical Interests:** 3D Interactive Web Development (Three.js & WebGL), AI Agent Architectures, RAG Pipelines, and Open Source Software.\n• **Personal Hobbies:** Exploring new AI models, UI/UX graphic design, technology blogging, and music.",
    keywords: ['interest', 'interests', 'hobby', 'hobbies', 'passion', 'passionate', 'like to do', 'free time'],
  },
  {
    category: 'projects',
    question: 'What projects have you built?',
    answer: "Tushar haven't added any project yet.",
    keywords: ['projects', 'built', 'portfolio', 'work', 'apps', 'applications'],
  },
  {
    category: 'experience',
    question: 'What is your background and experience?',
    answer: "I have experience building end-to-end full stack web & mobile applications with real-time database backends, AI integrations, responsive UIs, and interactive 3D WebGL scenes.",
    keywords: ['experience', 'background', 'work', 'history', 'role', 'developer'],
  },
  {
    category: 'contact',
    question: 'How can I contact you?',
    answer: "You can reach out via GitHub at github.com/singh-jee2004, Instagram @_tushar.__singh_, or through the contact section right here on my portfolio website!",
    keywords: ['contact', 'email', 'reach', 'hire', 'instagram', 'github', 'connect', 'touch'],
  },
  {
    category: 'girlfriend',
    question: 'Do Tushar have a girlfriend?',
    answer: "Tushar is single. His heart belongs to his laptop. Or speaking truth i don't know the exact count 😉. If u want I can ask him and can get back to you 😉.",
    keywords: ['girlfriend', 'gf', 'single'],
  },
  {
    category: 'family',
    question: 'Do Tushar have a family?',
    answer: "Yes, Tushar is blessed with a loving family. He has a loving mother.",
    keywords: ['family', 'parents', 'mother', 'sister', 'niece'],
  }
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
  return `Thanks for asking! I'm Tushar's AI representative. Tushar is a Full Stack & AI Developer pursuing B.Tech in CSE, skilled in TypeScript, Python, Next.js, Three.js, and Supabase. Feel free to ask about his education, interests, coding languages, projects, or contact info!`;
}
