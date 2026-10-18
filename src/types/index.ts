export type SectionId =
  | 'intro'
  | 'room'
  | 'workstation'
  | 'about'
  | 'resume'
  | 'contact'
  | 'skills'
  | 'projects'
  | 'achievements'
  | 'finale'
  | 'gate'
  | 'welcome';

export interface SectionConfig {
  id: SectionId;
  label: string;
  stationName: string;
  order: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  fov: number;
}

export interface ProfileData {
  name: string;
  brand: string;
  mainTitle: string;
  tagline: string;
  role: string;
  degree: string;
  university: string;
  graduationYear: string;
  location: string;
  status: string;
  bio: string[];
  terminalPrompts: {
    command: string;
    description: string;
    output: string | string[];
  }[];
  contactLinks: {
    email: string;
    github?: string;
    linkedin?: string;
    leetcode?: string;
    resume?: string;
  };
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  color: string;
  skills: string[];
}

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  shortDescription?: string;
  description?: string;
  status: 'Production' | 'Active Development' | 'Concept' | 'Prototype';
  category: string;
  purpose: string;
  technologies: string[];
  keyFunctionality: string[];
  featured?: boolean;
  repositoryUrl?: string;
  liveDemoUrl?: string;
  links: {
    github?: string;
    live?: string;
    demo?: string;
  };
  details: {
    problemStatement: string;
    architectureOverview: string;
    highlights: string[];
  };
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  type: 'education' | 'certification' | 'experience' | 'hackathon' | 'milestone';
  category?: string;
  description: string;
  badge?: string;
  image?: string;
  credentialUrl?: string;
  status?: string;
  featured?: boolean;
}

