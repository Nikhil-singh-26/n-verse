# N/VERSE — My Interactive Portfolio

> **CODE. LEARN. BUILD. REPEAT.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](https://opensource.org/licenses/MIT)

**N/VERSE** is my interactive 3D portfolio: a personal engineering universe where I bring together my projects, skills, and milestones. I built it as one persistent 3D studio that visitors can explore through a guided sequence of spaces.

The experience moves from the studio introduction to the workstation, skills globe, projector-based project showcase, achievements, and studio finale. Visitors can navigate with scrolling, touch gestures, keyboard arrows, or the on-screen controls.

---

## About Me

I’m **Nikhil Singh**, a full-stack software engineer and creative developer. I’m studying Computer Science and Engineering at Government Engineering College Bilaspur (2024–2028), and I use this portfolio to share what I’m learning and building.

- **Email:** [nikhilsingh260406@gmail.com](mailto:nikhilsingh260406@gmail.com)
- **GitHub:** [github.com/Nikhil-singh-26](https://github.com/Nikhil-singh-26)
- **LinkedIn:** [linkedin.com/in/nikhil-singh-dev](https://linkedin.com/in/nikhil-singh-dev)
- **Resume:** available in the workstation’s Resume window at `/resume.pdf`

---

## Explore the Experience

### 1. Studio Entry — My Verse

- I open with a cinematic welcome animation and threshold light reveal.
- I built a persistent 3D study room with ambient lighting, desk lamps, and floor textures.
- Visitors can drag to look around the room with a smoothly damped camera.

### 2. Workstation — Desktop

The workstation features a wall-mounted 3D monitor with a dynamic canvas. Its desktop includes three interactive folders:

- **About Me:** I built a terminal-style interface with commands for my profile, skills, education, resume, contact details, page navigation, and clearing the terminal. A profile view presents my bio and skills.
- **Contact:** Visitors can copy my email, open a pre-filled email message, or visit my GitHub and LinkedIn profiles.
- **Resume:** Visitors can view a scrollable resume preview, adjust its zoom, open the PDF in a new tab, or download it.

I also implemented draggable windows, click-to-focus window layering, and a Windows-style taskbar with running app indicators and a live clock.

### 3. Skills Globe — Skills

- I created a procedural 3D sphere with glowing orbital rings and data nodes.
- I group my listed technologies into Languages, Frontend, Backend, Databases, Mobile, and DevOps & Tools.
- I show skills as badges without percentage-based proficiency claims.

### 4. Projector — Projects

- I built a desk-mounted projector that casts a cyan light beam onto the wall.
- Project cards include demo links, source repositories, and technology tags.
- The projects featured are **The Brew Club**, **Shrinka URL**, **RoadVision**, and **Know Via**.
- I provide case-study routes at `/projects/[slug]`.

### 5. Achievements — Milestones

- I present milestones, certifications, and academic information on a telemetry-style wall display.
- I include a fullscreen LeetCode inspection modal for problem-solving statistics.

### 6. Studio Finale — Outro

- I close with a personal statement, career objectives, and contact channels.

---

## Navigation & Accessibility

- I connect the six stations to vertical wheel or trackpad scrolling.
- I provide top navigation pills and bottom controls for progress, previous/next steps, and skipping.
- Visitors can hold and drag to inspect the room in 360°.
- I support touch gestures, including pinch-to-zoom and swiping, with responsive viewport framing.
- I provide a high-contrast 2D fallback for low-power devices and screen readers.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Core framework** | [Next.js 16](https://nextjs.org/) with App Router, Turbopack, and React 19 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **3D engine** | [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), and [Drei](https://github.com/pmndrs/drei) |
| **Animation and motion** | [GSAP 3](https://greensock.com/gsap/) with ScrollTrigger |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), PostCSS, and CSS Modules |
| **Icons and UI** | [Lucide React](https://lucide.dev/) and custom SVG icons |
| **Deployment** | Vercel and Cloudflare Pages compatible |

---

## Project Structure

```text
src/
├── app/
│   ├── layout.tsx                 # Root layout, metadata, and fonts
│   ├── page.tsx                   # Application entry point
│   ├── globals.css                # Design tokens and utility styles
│   └── projects/[slug]/page.tsx   # Dynamic project case studies
├── components/
│   ├── scene/                     # 3D room, workstation, skills, projects, milestones
│   ├── experience/                # Journey timeline, navigation, intro, and fallback
│   ├── overlays/                  # LeetCode inspection modal
│   └── ui/                        # Shared SVG icons
├── context/                       # Shared experience state
├── data/                          # Profile, skills, projects, contact, achievements
├── lib/                           # Experience configuration and motion setup
└── types/                         # TypeScript data definitions
```

---

## Run Locally

### Clone and install

```bash
git clone https://github.com/Nikhil-singh-26/N-VERSE.git
cd N-VERSE
npm install
```

### Start the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Build and run for production

```bash
npm run build
npm run start
```

---

## License

I release this project under the MIT License.
