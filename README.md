# N/VERSE — An Interactive Engineering Universe

> **CODE. LEARN. BUILD. REPEAT.**

**N/VERSE** is a production-quality, cinematic 3D developer portfolio and personal engineering universe built for **Nikhil Singh** (Computer Science Engineering student & aspiring software engineer).

The portfolio is structured as **one persistent 3D engineering laboratory room** featuring 6 continuous stations navigated through vertical scroll, touch gestures, keyboard arrows, or persistent HUD controls.

---

## 🌟 The 7 Ordered Stations

1. **The N/VERSE Gate (Stop 0: `gate`)**
   - Industrial blast doors with emissive `N/VERSE` lintel wordmark and hydraulic hinges.
   - Stylized humanoid engineer avatar standing before the gate.
   - Initial understated prompt: `SCROLL TO ENTER`.
2. **Welcome Reveal (Stop 1: `welcome`)**
   - Hydraulic blast doors glide and pivot open outward as visitor scrolls.
   - Engineer avatar strides forward into the threshold and dissolves smoothly.
   - Real HTML typography reveals **`WELCOME TO N/VERSE`** with blur-to-sharp scaling transition.
   - Atmospheric threshold light spills into the room as camera advances.
3. **Computer / About Terminal (Stop 2: `about`)**
   - Curved ultra-wide terminal monitor, mechanical keyboard, and liquid-cooled PC tower.
   - Interactive terminal window with quick prompt execution (`about`, `stack`, `education`, `links`, `clear`) and custom command input.
4. **Skills Planet (Stop 3: `skills`)**
   - Floating procedural 3D planet with anti-gravity containment lasers, geometric wireframe cage, atmospheric glow, and rotating orbital rings with satellite data nodes.
   - Interactive domain categories: Languages, Frontend, Backend, Databases, Mobile, DevOps.
   - Verified technologies only (no fabricated proficiency percentages).
5. **Projector / Project Showcase (Stop 4: `projects`)**
   - Desk-mounted projector that powers on, casting a volumetric cyan light beam onto the back wall.
   - Interactive project showcase cards:
     - **The Brew Club** — Creator-support and community crowdfunding platform.
     - **EcoTrack AI** — Energy consumption monitoring & carbon footprint insights.
     - **Know Via** — Contextual knowledge management & linked research notes.
     - **RoadVision** — Computer vision road hazard intelligence & safer routes.
   - Dedicated case-study drawer and standalone deep-link routes (`/projects/[slug]`).
6. **Achievement Board (Stop 5: `achievements`)**
   - Wall-mounted illuminated telemetry board with timeline track and milestone markers.
   - Verified timeline covering B.Tech CSE degree, DSA mastery, full-stack development, and competitive sprints.
7. **Telephone / Comms Console (Stop 6: `contact`)**
   - Physical telephone unit with pulse indicator LED, receiver handset, and holographic comms ring signal.
   - Direct communication channels: Email (with instant copy & mailto), LinkedIn, GitHub, LeetCode, Resume PDF (`/resume.pdf`).
   - Concludes with the architectural mantra: `CODE. LEARN. BUILD. REPEAT.`

---

## 🎮 Navigation & Exploration

- **Desktop**: Vertical mouse wheel / trackpad scroll drives the camera forward and backward smoothly.
- **Mobile**: Vertical swipe gestures advance or reverse the journey without trapping inner text panel scrolling.
- **Persistent Controls**:
  - Direct station jumper pills (Gate, About, Skills, Projects, Timeline, Contact).
  - **Skip Control**: Jump forward to the next station instantly without scrubbing through intermediate frames.
  - **360° Free-Look Exploration Mode**: Toggle with one click to elevate the camera and freely drag around the entire 3D laboratory.
  - **Audio Mute Toggle** & **Reduced-Motion Toggle**.
  - Accessible **2D WebGL Fallback** for low-power hardware or screen readers.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **3D Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Animation**: GSAP (GreenSock) & ScrollTrigger
- **Styling**: Tailwind CSS v4, PostCSS
- **Icons**: Lucide React & Custom SVG brand icons
- **Deployment**: Vercel / Cloudflare Pages compatible

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or 20.x+ (Tested on Node v24.12.0)
- npm 9+ or 11+

### Installation

```bash
git clone https://github.com/Nikhil-singh-26/N-VERSE.git
cd N-VERSE
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to experience the 3D universe.

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Architecture

```text
src/
├── app/
│   ├── layout.tsx                 # Root layout with SEO metadata & Google Fonts
│   ├── page.tsx                   # SSR-safe dynamic entry point for 3D universe
│   ├── globals.css                # Futuristic design tokens & laboratory styles
│   └── projects/[slug]/page.tsx   # Standalone project case-study route
├── components/
│   ├── scene/
│   │   ├── PortfolioCanvas.tsx    # R3F Canvas root & scene wrapper
│   │   ├── CameraController.tsx   # Cinematic waypoint lerping & 360 OrbitControls
│   │   ├── SceneLighting.tsx      # Atmospheric directional, point & spotlights
│   │   ├── DeveloperRoom.tsx      # Persistent floor, walls, ceiling & dust motes
│   │   ├── Gate.tsx               # Blast doors with N/VERSE lintel wordmark
│   │   ├── Character.tsx          # Stylized walking & dissolving engineer avatar
│   │   ├── Workstation.tsx        # Desk, curved terminal monitor, PC tower
│   │   ├── SkillsPlanet.tsx       # Procedural planet with orbital rings & nodes
│   │   ├── Projector.tsx          # Optical projector & volumetric light beam
│   │   ├── AchievementBoard.tsx   # Telemetry wall timeline with milestone nodes
│   │   └── Telephone.tsx          # Physical telephone console with comms beacon
│   ├── experience/
│   │   ├── ExperienceController.tsx # Master controller assembling canvas & UI
│   │   ├── ScrollTimeline.tsx     # Scroll, swipe, and keyboard event driver
│   │   ├── SectionNavigation.tsx  # Top HUD with station pills & utility toggles
│   │   ├── ProgressIndicator.tsx  # Station counter & progress percentage
│   │   ├── SkipControl.tsx        # Skip-to-next and previous buttons
│   │   ├── LoadingScreen.tsx      # Initialization progress screen
│   │   ├── WebGLFallback.tsx      # High-contrast 2D accessible fallback
│   │   └── ExplorationControls.tsx# 360 free-look HUD banner
│   ├── overlays/
│   │   ├── WelcomeOverlay.tsx     # Opening titles & enter prompt
│   │   ├── TerminalPanel.tsx      # Interactive About terminal with quick prompts
│   │   ├── SkillsPanel.tsx        # Categorized technology grid
│   │   ├── ProjectShowcase.tsx    # Project carousel and case study modal
│   │   ├── AchievementPanel.tsx   # Filterable milestone timeline
│   │   └── ContactPanel.tsx       # Direct transmission card & profile links
│   └── ui/
│       └── Icons.tsx              # Clean SVG brand icons (GitHub, LinkedIn)
├── context/
│   └── ExperienceContext.tsx      # Centralized state provider for camera & stations
├── data/
│   ├── profile.ts                 # Developer identity, bio & terminal prompts
│   ├── skills.ts                  # Categorized technical stack
│   ├── projects.ts                # Verified project details & case studies
│   └── achievements.ts            # Education, certifications & hackathons
├── lib/
│   ├── experience-config.ts       # Camera waypoints & station coordinates
│   ├── accessibility.ts           # Screen reader announcements & reduced motion
│   └── motion.ts                  # GSAP registration & interpolation helpers
└── types/
    └── index.ts                   # Core TypeScript data definitions
```

---

## ⚙️ Configuration & Customization

All personal and technical content is isolated in `src/data/`:
- **Profile & Terminal**: Edit [profile.ts](file:///d:/Programing/Portfolio/N-VERSE/src/data/profile.ts) to adjust bio, education, or terminal command responses.
- **Skills**: Edit [skills.ts](file:///d:/Programing/Portfolio/N-VERSE/src/data/skills.ts) to update languages, frameworks, or databases.
- **Projects**: Edit [projects.ts](file:///d:/Programing/Portfolio/N-VERSE/src/data/projects.ts) to add or configure projects, GitHub URLs, or live demo links.
- **Achievements**: Edit [achievements.ts](file:///d:/Programing/Portfolio/N-VERSE/src/data/achievements.ts) to update timeline entries and certifications.

---

## 📄 License

MIT © [Nikhil Singh](https://github.com/Nikhil-singh-26)
