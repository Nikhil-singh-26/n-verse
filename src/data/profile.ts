import { ProfileData } from '@/types';

export const profileData: ProfileData = {
  name: 'Nikhil Singh',
  brand: 'N/VERSE',
  mainTitle: 'N/VERSE — Nikhil Universe',
  tagline: 'CODE. LEARN. BUILD. REPEAT.',
  role: 'Computer Science Engineering Student & Aspiring Software Engineer',
  degree: 'B.Tech in Computer Science Engineering',
  university: 'Government Engineering College Bilaspur',
  graduationYear: '2028',
  location: 'Bilaspur, Chhattisgarh, India',
  status: 'Open to Software Engineering Internships & Opportunities',
  bio: [
    'A developer learning, experimenting, and building practical projects across web and mobile technologies, with a focus on improving engineering fundamentals and creating useful products.',
    'Currently pursuing B.Tech in Computer Science Engineering at Government Engineering College Bilaspur (2024 — 2028).',
    'Passionate about software engineering, full-stack systems, interactive web experiences, Flutter mobile applications, and algorithmic problem solving.'
  ],
  terminalPrompts: [
    {
      command: 'about',
      description: 'Who I am and engineering philosophy',
      output: [
        'Nikhil Singh — Computer Science Engineering student & aspiring software engineer / full-stack developer.',
        'Learning, experimenting, and building practical projects across web and mobile technologies.',
        'Philosophy: Strong engineering fundamentals, clean modular code, and creating genuinely useful products.'
      ]
    },
    {
      command: 'education',
      description: 'Academic background & institution',
      output: [
        'Degree: B.Tech in Computer Science & Engineering (2024 — 2028)',
        'Institution: Government Engineering College Bilaspur (CG)',
        'Performance: CGPA 7.6 / 10',
        'Core Disciplines: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks.'
      ]
    },
    {
      command: 'stack',
      description: 'Technologies I work with',
      output: [
        'Languages: Java, JavaScript, TypeScript, C, Dart',
        'Frontend: HTML5, CSS3, React, Next.js, Tailwind CSS, Drei, Three.js, Gsap',
        'Backend: Node.js, Express.js',
        'Databases: MongoDB, Mongoose, PostgreSQL, MySQL',
        'Mobile: Flutter',
        'Tools & Workflow: Git, GitHub, VS Code, Android Studio, Postman'
      ]
    },
    {
      command: 'focus',
      description: 'What I am currently building and learning',
      output: [
        'Full-Stack Systems: Building resilient web applications with Next.js, React, and Node.js.',
        'Mobile Engineering: Crafting smooth cross-platform applications with Flutter and Dart.',
        'Interactive 3D Web: Exploring Three.js / React Three Fiber for immersive interfaces.',
        'Problem Solving: Practicing algorithmic problem-solving consistently on LeetCode.'
      ]
    },
    {
      command: 'links',
      description: 'Configured external profiles & contact',
      output: [
        'GitHub: https://github.com/Nikhil-singh-26',
        'LinkedIn: https://linkedin.com/in/nikhil-singh-dev',
        'LeetCode: https://leetcode.com/u/Nikhil_singh_26/',
        'Email: nikhilsingh260406@gmail.com',
        'Resume: /resume.pdf'
      ]
    },
    {
      command: 'help',
      description: 'List available commands',
      output: [
        'Available commands:',
        '  about     - Introduction and engineering background',
        '  education - Academic degree and university details',
        '  stack     - Core technical stack and technologies',
        '  focus     - What I am currently building and learning',
        '  links     - Configured external profiles and contact',
        '  help      - Display this command manual',
        '  clear     - Clear the terminal screen'
      ]
    }
  ],
  contactLinks: {
    email: 'nikhilsingh260406@gmail.com',
    github: 'https://github.com/Nikhil-singh-26',
    linkedin: 'https://linkedin.com/in/nikhil-singh-dev',
    leetcode: 'https://leetcode.com/u/Nikhil_singh_26/',
    resume: '/resume.pdf'
  }
};

