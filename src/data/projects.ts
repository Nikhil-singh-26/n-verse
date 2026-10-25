import { ProjectData } from '@/types';

export const projectsData: ProjectData[] = [
  {
    id: 'the-brew-club',
    slug: 'the-brew-club',
    title: 'The Brew Club',
    tagline: 'Direct Creator Support & Community Crowdfunding Platform',
    shortDescription: 'Peer contribution platform empowering independent creators with direct tipping and membership rewards.',
    description: 'A creator-support platform where supporters can contribute to creators, unlock membership tiers, and follow creator milestones without prohibitive intermediary commission fees.',
    status: 'Active Development',
    category: 'Full-Stack Web Application',
    featured: true,
    purpose: 'Enables digital creators to establish direct peer contribution pipelines, manage tiered membership access, and share exclusive updates with their core audience.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Stripe / Razorpay API'],
    keyFunctionality: [
      'Custom creator profiles with supporter tip milestones and real-time feeds',
      'One-time contribution checkout and tiered patron membership access',
      'Webhook listener handling payment events and automated transactional receipts',
      'Creator analytics dashboard displaying contribution logs and supporter engagement'
    ],
    repositoryUrl: 'https://github.com/Nikhil-singh-26/the-brew-club',
    liveDemoUrl: 'https://the-brew-club.vercel.app',
    links: {
      github: 'https://github.com/Nikhil-singh-26/the-brew-club',
      live: 'https://the-brew-club.vercel.app',
      demo: 'https://the-brew-club.vercel.app'
    },
    details: {
      problemStatement: 'Creators face high platform commission fees (up to 20%), complicated payout configurations, and fragmented tools for managing both one-time contributions and ongoing patron tiers.',
      architectureOverview: 'Built on Next.js App Router with server-rendered creator landing pages, MongoDB transactional persistence for balance tracking, and secure server-side webhook endpoints for payment verification.',
      highlights: [
        'Implemented sandbox payment gateway workflows with cryptographic webhook signature validation',
        'Atomic database transactions preventing duplicate credit or out-of-sync supporter balances',
        'Responsive mobile-first layout with instant client-side feedback and dark mode'
      ]
    }
  },
  {
    id: 'shrinka-url',
    slug: 'shrinka-url',
    title: 'Shrinka URL',
    tagline: 'High-Performance URL Shortener & Dynamic Link Analytics Platform',
    shortDescription: 'Fast, modern link shortening service with instant redirection, custom alias generation, and click analytics.',
    description: 'A full-stack URL shortening platform engineered for speed, custom slug routing, dynamic QR code sharing, and comprehensive click analytics tracking.',
    status: 'Active Development',
    category: 'Full-Stack Web Application',
    featured: true,
    purpose: 'Enables users to condense long URLs into high-speed vanity links, generate instant QR codes for mobile distribution, and monitor real-time visit analytics.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Vercel'],
    keyFunctionality: [
      'Instant URL shortening with custom vanity alias validation and collision prevention',
      'Low-latency redirection engine routing visitors directly to destination URLs',
      'Dynamic QR code generator enabling frictionless mobile scanning and link sharing',
      'Real-time click telemetry logging visits, access timestamps, and referrer metadata'
    ],
    repositoryUrl: 'https://github.com/Nikhil-singh-26/Shrinka_url',
    liveDemoUrl: 'https://shrinka-url.vercel.app/',
    links: {
      github: 'https://github.com/Nikhil-singh-26/Shrinka_url',
      live: 'https://shrinka-url.vercel.app/',
      demo: 'https://shrinka-url.vercel.app/'
    },
    details: {
      problemStatement: 'Long, cluttered URLs are cumbersome to share across social media and provide zero visibility into engagement, traffic sources, or geographic clicks.',
      architectureOverview: 'A Next.js full-stack architecture powered by an indexed MongoDB datastore for rapid key-value slug lookups, paired with a modern responsive frontend providing instant clipboard copying and SVG QR synthesis.',
      highlights: [
        'Optimized sub-millisecond route redirection with indexed database query caching',
        'Custom vanity slug generation with collision prevention and validation',
        'Responsive, clean UI with one-click QR code generation and copy utilities'
      ]
    }
  },
  {
    id: 'roadvision',
    slug: 'roadvision',
    title: 'RoadVision',
    tagline: 'Computer Vision Road Hazard Intelligence & Detection Prototype',
    shortDescription: 'Computer vision research prototype detecting road surface hazards and distress markers from video inputs.',
    description: 'A smart mobility engineering prototype that analyzes video frames using lightweight YOLO models to recognize road surface distress (potholes and asphalt degradation) and map geotagged hazard coordinates.',
    status: 'Prototype',
    category: 'Computer Vision & AI',
    featured: true,
    purpose: 'Explores how edge computer vision can detect surface road anomalies and map hazard heatmaps to support road maintenance awareness and commuter safety.',
    technologies: ['Python', 'OpenCV', 'PyTorch / YOLO', 'Flask API', 'Leaflet', 'NumPy'],
    keyFunctionality: [
      'Bounding-box object detection identifying potholes and asphalt degradation from video inputs',
      'Geotagged hazard mapping displaying detected road surface points on interactive maps',
      'Frame-by-frame inference evaluation scoring alternative paths based on recorded hazard density',
      'Spatial clustering algorithms eliminating duplicate detections across contiguous video frames'
    ],
    repositoryUrl: 'https://github.com/Nikhil-singh-26/roadvision',
    links: {
      github: 'https://github.com/Nikhil-singh-26/roadvision'
    },
    details: {
      problemStatement: 'Unmarked road hazards lead to vehicular wear and accidents, while traditional manual municipal road inspection cycles are slow and costly.',
      architectureOverview: 'A Python backend leveraging OpenCV and a custom-trained lightweight YOLO model to detect road distress markers in recorded video streams, exposing coordinate data through a local Flask API service.',
      highlights: [
        'Real-time frame processing optimized for edge computing constraints',
        'Spatial clustering of duplicate coordinate detections to eliminate duplicate markers',
        'Robust computer vision pipeline tested on diverse asphalt road conditions'
      ]
    }
  },
  {
    id: 'know-via',
    slug: 'know-via',
    title: 'Know Via',
    tagline: 'Local-First Document Learning, Spaced Repetition & Revision Suite',
    shortDescription: 'Privacy-first document revision ecosystem combining Google Gemini AI, deterministic SM-2 spaced repetition, and Drift SQLite storage.',
    description: 'A local-first document learning and knowledge management application designed for active recall. Rather than acting as just a PDF reader with an attached chatbot, Know Via turns imported study materials into a personalized revision ecosystem: grounded Gemini AI Q&A, deterministic SuperMemo-2 (SM-2) spaced repetition flashcards, interactive multiple-choice quizzes, persistent study notes, and privacy-first local Drift SQLite storage.',
    status: 'Active Development',
    category: 'Mobile Application (Flutter & Gemini AI)',
    featured: true,
    purpose: 'Transforms imported PDFs, study materials, and notes into an active recall revision ecosystem powered by grounded Gemini 2.5 Flash AI, deterministic SM-2 spaced repetition flashcards, and interactive knowledge-check quizzes.',
    technologies: ['Flutter 3.x', 'Dart 3', 'Google Gemini 2.5 Flash', 'Drift SQLite (v8)', 'Riverpod', 'SuperMemo-2 (SM-2)', 'Speech to Text', 'Material 3'],
    keyFunctionality: [
      'Source-Grounded Document AI: Multi-turn Q&A and suggested contextual prompts powered by Google Gemini 2.5 Flash',
      'Deterministic SM-2 Spaced Repetition: 3D animated flip cards with interval and ease factor calculations based on user recall ratings',
      'Interactive Knowledge Check Quizzes: 4-option MCQ generation with detailed explanations, scoring, and mistake review',
      'Universal Document Ingestion: Imports PDFs, TXT, MD, CSV, JSON, and images with full offline reader and search',
      'Privacy-First Local Persistence: Powered by Drift SQLite (Schema v8) keeping all documents and study progress on-device'
    ],
    repositoryUrl: 'https://github.com/Nikhil-singh-26/knowvia',
    liveDemoUrl: 'https://github.com/Nikhil-singh-26/knowvia/releases',
    links: {
      github: 'https://github.com/Nikhil-singh-26/knowvia',
      live: 'https://github.com/Nikhil-singh-26/knowvia/releases',
      demo: 'https://github.com/Nikhil-singh-26/knowvia/releases'
    },
    details: {
      problemStatement: 'Learners collect numerous PDFs, research articles, lecture slides, and study notes, but reading them once rarely leads to long-term retention while cloud-based AI tools risk document privacy.',
      architectureOverview: 'Engineered with Flutter 3.x, Dart 3, and Riverpod using Drift SQLite (Schema v8) for 100% local persistence of documents, notes, flashcard intervals, and quiz history. Grounded AI queries communicate on-demand with Google Gemini 2.5 Flash over encrypted HTTPS without intermediate tracking servers.',
      highlights: [
        'Deterministic SuperMemo-2 (SM-2) algorithm calculating ease factors and due-deck intervals',
        'Source-grounded Gemini 2.5 Flash Q&A with customizable user API key storage in local preferences',
        'Local-first Drift SQLite database architecture with zero third-party cloud data transmission'
      ]
    }
  }
];

