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
      architectureOverview: 'Built on Next.js App Router with server-rendered creator landing pages, MongoDB transactional persistence for balance tracking, and secure server-side webhook endpoints for payment verification. (Note: Payment checkout flows and webhook verification are implemented and tested in sandbox/test mode; live production merchant settlement requires completed business entity onboarding).',
      highlights: [
        'Implemented sandbox payment gateway workflows with cryptographic webhook signature validation',
        'Atomic database transactions preventing duplicate credit or out-of-sync supporter balances',
        'Responsive mobile-first layout with instant client-side feedback and dark mode'
      ]
    }
  },
  {
    id: 'ecotrack-ai',
    slug: 'ecotrack-ai',
    title: 'EcoTrack AI',
    tagline: 'Intelligent Energy Consumption Monitoring & Carbon Footprint Insights',
    shortDescription: 'Predictive energy consumption telemetry providing actionable heuristics to reduce household electrical waste.',
    description: 'An energy monitoring and sustainability analytics application that visualizes usage telemetry, detects irregular load spikes, and provides heuristic recommendations to curb power waste.',
    status: 'Active Development',
    category: 'AI & Sustainable Tech',
    featured: true,
    purpose: 'Provides households and small offices with intuitive consumption telemetry, peak load anomaly alerts, and actionable recommendations to optimize electrical efficiency.',
    technologies: ['Python', 'FastAPI', 'Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Recharts'],
    keyFunctionality: [
      'Interactive time-series telemetry charts showing consumption patterns across hourly intervals',
      'Anomaly detection heuristics flagging abnormal continuous draw (vampire load detection)',
      'Tariff-aware cost forecasting calculating estimated billing based on regional rate tiers',
      'Exportable energy audit summaries with simulated appliance breakdown estimates'
    ],
    repositoryUrl: 'https://github.com/Nikhil-singh-26/ecotrack-ai',
    liveDemoUrl: 'https://ecotrack-ai.vercel.app',
    links: {
      github: 'https://github.com/Nikhil-singh-26/ecotrack-ai',
      live: 'https://ecotrack-ai.vercel.app',
      demo: 'https://ecotrack-ai.vercel.app'
    },
    details: {
      problemStatement: 'Consumers receive aggregate monthly utility invoices without visibility into which equipment or operational habits caused consumption spikes.',
      architectureOverview: 'A FastAPI service processes incoming time-series telemetry streams using sliding-window anomaly algorithms, while the Next.js client visualizes consumption curves and heuristic recommendations via responsive Recharts SVG elements. (Telemetry telemetry is based on simulated IoT sensor models; real-world hardware IoT deployment is in experimental planning).',
      highlights: [
        'High-efficiency time-series indexing in PostgreSQL for rapid interval rollups',
        'Rule-based heuristic engine identifying appliance standby anomalies',
        'Clean modern dashboard with high-contrast accessibility across desktop and mobile'
      ]
    }
  },
  {
    id: 'know-via',
    slug: 'know-via',
    title: 'Know Via',
    tagline: 'Contextual Knowledge Management & Linked Research Notes Engine',
    shortDescription: 'Personal knowledge base with bidirectional backlinking, markdown editing, and concept graph exploration.',
    description: 'A personal knowledge management platform allowing developers and researchers to capture notes in markdown, interconnect ideas through bidirectional links, and navigate knowledge graphs.',
    status: 'Active Development',
    category: 'Productivity & Knowledge Graphs',
    featured: true,
    purpose: 'Empowers engineers to organize structured technical notes, cross-reference interconnected concepts, and eliminate information silos through an associative backlinking system.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma ORM', 'Tailwind CSS'],
    keyFunctionality: [
      'Split-pane Markdown editor with live preview, syntax highlighting, and LaTeX formula support',
      'Bidirectional backlink graph linking references across different documentation nodes',
      'Keyboard-first command palette (Cmd/Ctrl + K) for rapid note searching and creation',
      'Local-first cached storage supporting immediate note retrieval and offline editing'
    ],
    repositoryUrl: 'https://github.com/Nikhil-singh-26/know-via',
    liveDemoUrl: 'https://know-via.vercel.app',
    links: {
      github: 'https://github.com/Nikhil-singh-26/know-via',
      live: 'https://know-via.vercel.app',
      demo: 'https://know-via.vercel.app'
    },
    details: {
      problemStatement: 'Hierarchical folder systems force arbitrary single-parent categorization, making it difficult to locate cross-disciplinary notes or trace how research topics relate to one another.',
      architectureOverview: 'Relational node-and-edge graph modeling in PostgreSQL via Prisma ORM, coupled with a React client utilizing interactive canvas views to illustrate topic clusters. (Implemented: local markdown editor, bidirectional backlinks, and search index; Planned future: peer-to-peer note synchronization and team workspaces).',
      highlights: [
        'PostgreSQL full-text search indexing (tsvector) delivering sub-20ms search results',
        'Associative link parser dynamically resolving internal [[WikiLinks]]',
        'Distraction-free typography with keyboard-centric modal controls'
      ]
    }
  },
  {
    id: 'roadvision',
    slug: 'roadvision',
    title: 'RoadVision',
    tagline: 'Computer Vision Road Hazard Intelligence & Safer Route Mapping',
    shortDescription: 'Computer vision prototype detecting road surface hazards and mapping safer commuter paths.',
    description: 'A smart mobility prototype that analyzes video frames to recognize road hazards (such as potholes and degraded asphalt) and visualize geotagged risk points on interactive route maps.',
    status: 'Prototype',
    category: 'Computer Vision & Geospatial',
    featured: true,
    purpose: 'Explores how edge computer vision can detect surface road anomalies and map hazard heatmaps to help commuters choose smoother routes and support maintenance awareness.',
    technologies: ['Python', 'OpenCV', 'PyTorch / YOLO', 'Flutter', 'Flask API', 'Leaflet / OpenStreetMap'],
    keyFunctionality: [
      'Bounding-box object detection identifying potholes and asphalt degradation from video inputs',
      'Geotagged hazard mapping displaying detected road surface points on interactive Leaflet maps',
      'Route evaluation prototype scoring alternative paths based on recorded hazard density',
      'Mobile client concept for capturing camera feeds and transmitting coordinates'
    ],
    repositoryUrl: 'https://github.com/Nikhil-singh-26/roadvision',
    liveDemoUrl: 'https://roadvision.vercel.app',
    links: {
      github: 'https://github.com/Nikhil-singh-26/roadvision',
      live: 'https://roadvision.vercel.app',
      demo: 'https://roadvision.vercel.app'
    },
    details: {
      problemStatement: 'Unmarked road hazards lead to vehicular wear and traffic accidents, while traditional municipal road inspection relies on slow, manual survey cycles.',
      architectureOverview: 'A Python backend leveraging OpenCV and a custom-trained lightweight YOLO model to detect road distress markers in recorded video streams, exposing a Flask API that returns coordinates to a Leaflet-based mapping client. (Note: Project is an engineering prototype and proof-of-concept; not currently deployed in production municipal traffic infrastructure).',
      highlights: [
        'Real-time frame processing optimized for edge computing constraints',
        'Spatial clustering of duplicate coordinate detections to eliminate duplicate map markers',
        'Intuitive color-graded route overlay highlighting road quality indicators'
      ]
    }
  }
];

