import { AchievementItem } from '@/types';

export const achievementsData: AchievementItem[] = [
  {
    id: 'achievement-leetcode',
    title: 'LeetCode Problem Solving & Profile',
    organization: 'Algorithmic Problem Solving',
    period: 'Verified',
    type: 'milestone',
    category: 'Achievements & Leadership',
    description: 'Demonstrated algorithmic problem solving across Core Data Structures & Algorithms, including Arrays, Trees, Dynamic Programming, and Graph Traversals on LeetCode.',
    badge: 'LeetCode Profile',
    image: '/leetcode.png',
    credentialUrl: 'https://leetcode.com/u/Nikhil_singh_26/',
    status: 'Verified',
    featured: true
  },
  {
    id: 'achievement-ssh',
    title: 'Symbiosis Skill Hackathon (SSH)',
    organization: 'Semifinalist, Team Lead',
    period: 'Feb 2026',
    type: 'hackathon',
    category: 'Achievements & Leadership',
    description: 'Led the engineering team to the semifinals at Symbiosis Skill Hackathon (SSH), directing system architecture and rapid prototype delivery.',
    badge: 'Semifinalist • Team Lead',
    status: 'Semifinalist',
    featured: true
  },
  {
    id: 'achievement-iiit-nr',
    title: 'IIIT Naya Raipur Hackathon',
    organization: 'Finalist, Team Lead',
    period: 'Mar 2026',
    type: 'hackathon',
    category: 'Achievements & Leadership',
    description: 'Led the engineering team as a finalist at IIIT Naya Raipur Hackathon, architecting innovative software solutions and delivering prototype demonstrations under competitive deadlines.',
    badge: 'Finalist • Team Lead',
    status: 'Finalist',
    featured: true
  },
  {
    id: 'achievement-gdg',
    title: 'Google Developer Groups (GDG), CGIT Bilaspur',
    organization: 'Member',
    period: '2025–Present',
    type: 'milestone',
    category: 'Achievements & Leadership',
    description: 'Active member of Google Developer Groups (GDG) at CGIT Bilaspur, contributing to developer community events, technical workshops, and collaborative open-source learning.',
    badge: 'Community Member',
    status: 'Member 2025–Present',
    featured: true
  }
];
