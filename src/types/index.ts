export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  tech_stack: string[];
  featured: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  bio: string;
  tagline: string;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  resume_url: string | null;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url: string | null;
  image_url: string | null;
}

export interface Skill {
  name: string;
  icon: string;
  level: number; // 1-5
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'tools';
}
