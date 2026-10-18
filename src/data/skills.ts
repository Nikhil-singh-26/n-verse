import { SkillCategory } from '@/types';

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Programming Languages',
    description: 'Foundational languages for software systems, mobile apps, and logic development',
    color: '#00f0ff',
    skills: ['Java', 'JavaScript', 'TypeScript', 'C', 'Dart']
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Modern component architectures, interactive UI design, and responsive web styling',
    color: '#00a3ff',
    skills: ['HTML5', 'CSS3', 'React', 'Next.js', 'Tailwind CSS']
  },
  {
    id: 'backend',
    title: 'Backend Development',
    description: 'Server runtimes, RESTful API design, and modular application logic',
    color: '#38bdf8',
    skills: ['Node.js', 'Express.js']
  },
  {
    id: 'databases',
    title: 'Databases & Storage',
    description: 'Relational database schemas and NoSQL document persistence models',
    color: '#0ea5e9',
    skills: ['MongoDB', 'Mongoose', 'PostgreSQL', 'MySQL']
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    description: 'Cross-platform mobile application development for Android and iOS',
    color: '#06b6d4',
    skills: ['Flutter']
  },
  {
    id: 'tools',
    title: 'Tools & Workflow',
    description: 'Version control, developer IDEs, API debugging, and development tooling',
    color: '#22d3ee',
    skills: ['Git', 'GitHub', 'VS Code', 'Android Studio', 'Postman']
  }
];

