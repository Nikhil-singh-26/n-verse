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
    tagline: 'Contextual Mobile Knowledge Engine & Linked Research Notes (Android APK)',
    shortDescription: 'Mobile knowledge management app in APK format with markdown editing, bidirectional backlinks, and concept graphs.',
    description: 'A standalone Android mobile application (distributed as an APK) allowing developers and researchers to capture notes in markdown, interconnect ideas through bidirectional links, and explore associative concept graphs on the go.',
    status: 'Active Development',
    category: 'Mobile Application (Android APK)',
    featured: true,
    purpose: 'Empowers engineers to organize structured technical notes on Android, cross-reference interconnected concepts, and eliminate information silos through a local-first associative backlinking system.',
    technologies: ['Android / APK', 'Flutter', 'Dart', 'SQLite', 'Markdown', 'Graph Visualizer'],
    keyFunctionality: [
      'Distraction-free mobile Markdown editor with live preview, syntax highlighting, and formatting tools',
      'Bidirectional backlink graph linking references across documentation nodes',
      'Local-first offline SQLite storage with instant search indexing and zero cloud dependency',
      'Standalone Android APK distribution packaged for direct installation and testing'
    ],
    repositoryUrl: 'https://github.com/Nikhil-singh-26/know-via',
    links: {
      github: 'https://github.com/Nikhil-singh-26/know-via'
    },
    details: {
      problemStatement: 'Desktop knowledge tools lack distraction-free offline mobile counterparts, making quick capture on Android cumbersome.',
      architectureOverview: 'Packaged as a standalone Android APK built with Flutter and SQLite for local-first storage, providing fast bidirectional link indexing and graph rendering without relying on cloud services. (Source code and APK builds available on GitHub).',
      highlights: [
        'Local-first SQLite storage delivering sub-10ms search results offline',
        'Associative link parser dynamically resolving internal [[WikiLinks]]',
        'Zero-telemetry privacy-first architecture with standalone APK installation'
      ]
    }
  }
];

