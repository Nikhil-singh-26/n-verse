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
    title: 'Frontend & Web Styling',
    description: 'Component architecture, responsive layouts, design systems, and modern web applications',
    color: '#00a3ff',
    skills: ['HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'React.js', 'Next.js']
  },
  {
    id: 'graphics3d',
    title: '3D Graphics & Motion',
    description: 'Cinematic web experiences, WebGL rendering, 3D math, and physics-driven animations',
    color: '#818cf8',
    skills: ['GSAP', 'Three.js', 'React Three Fiber', 'Drei']
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    description: 'Server runtimes, RESTful API design, middleware pipelines, and microservices',
    color: '#38bdf8',
    skills: ['Node.js', 'Express.js']
  },
  {
    id: 'databases',
    title: 'Databases & Storage',
    description: 'Relational data models and NoSQL document persistence with object modeling',
    color: '#0ea5e9',
    skills: ['MongoDB', 'Mongoose', 'PostgreSQL']
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    description: 'Cross-platform native mobile engineering for iOS and Android',
    color: '#06b6d4',
    skills: ['Flutter', 'Dart']
  },
  {
    id: 'cloud',
    title: 'Cloud & Deployment',
    description: 'Realtime cloud services, serverless deployment, edge hosting, and web infrastructure',
    color: '#f59e0b',
    skills: ['Firebase', 'Vercel', 'Render']
  },
  {
    id: 'tools',
    title: 'Tools & Workflow',
    description: 'Version control, developer IDEs, API debugging, and development tooling',
    color: '#22d3ee',
    skills: ['Git', 'GitHub', 'VS Code', 'Android Studio', 'Postman']
  }
];
