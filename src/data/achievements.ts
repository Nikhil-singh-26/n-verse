import { AchievementItem } from '@/types';

export const achievementsData: AchievementItem[] = [
  {
    id: 'edu-btech',
    title: 'B.Tech in Computer Science & Engineering',
    organization: 'Government Engineering College Bilaspur',
    period: '2022 — 2026',
    type: 'education',
    category: 'Education',
    description: 'Pursuing undergraduate engineering studies with foundational and advanced coursework in Data Structures & Algorithms, Database Management Systems, Operating Systems, Computer Networks, and Software Engineering.',
    badge: 'Degree Program',
    status: 'In Progress',
    featured: true
  },
  {
    id: 'cert-dsa',
    title: 'Data Structures & Algorithms Specialization',
    organization: 'Curriculum & Algorithmic Problem Solving',
    period: 'Verified',
    type: 'certification',
    category: 'Technical Achievement',
    description: 'Comprehensive study and practical application of graph algorithms, dynamic programming, tree traversals, searching, sorting, and asymptotic time/space complexity optimization.',
    badge: 'Algorithms',
    credentialUrl: 'https://leetcode.com/u/Nikhil_singh_26/',
    status: 'Verified',
    featured: true
  },
  {
    id: 'cert-fullstack',
    title: 'Full-Stack Web Systems Engineering',
    organization: 'Self-Directed Engineering & Project Builds',
    period: 'Verified',
    type: 'certification',
    category: 'Technical Achievement',
    description: 'Hands-on architectural implementation of modern Next.js and React client applications, Node.js and Express REST services, database schema design, and secure authentication pipelines.',
    badge: 'Full-Stack Web',
    status: 'Verified',
    featured: true
  },
  {
    id: 'hack-innovation',
    title: 'Engineering Hackathons & Prototyping',
    organization: 'Competitive Development Sprints',
    period: '2023 — Present',
    type: 'hackathon',
    category: 'Hackathons',
    description: 'Participated in rapid-prototyping team sprints creating proof-of-concept solutions for smart road hazard detection, creator crowdfunding models, and real-time energy telemetry analytics.',
    badge: 'Hackathon Sprint',
    status: 'Active Contender',
    featured: true
  },
  {
    id: 'milestone-leetcode',
    title: 'Algorithmic Problem Solving Track',
    organization: 'LeetCode Platform Profile',
    period: 'Ongoing',
    type: 'milestone',
    category: 'Milestones',
    description: 'Demonstrated problem-solving practice across core data structures including arrays, linked lists, trees, recursion, two-pointer methods, and hash maps on LeetCode.',
    badge: 'Problem Solving',
    credentialUrl: 'https://leetcode.com/u/Nikhil_singh_26/',
    status: 'Ongoing Practice',
    featured: true
  },
  {
    id: 'exp-placeholder',
    title: 'Software Engineering Trainee / Internship',
    organization: 'Configurable Experience Record (Source: src/data/achievements.ts)',
    period: 'Upcoming',
    type: 'experience',
    category: 'Internship Opportunity',
    description: 'Candidate ready for software engineering internships. Proficient in TypeScript, JavaScript, React, Next.js, Node.js, Flutter, and relational database systems.',
    badge: 'Open to Roles',
    status: 'Candidate Record',
    featured: false
  }
];

