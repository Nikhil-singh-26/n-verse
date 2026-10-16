export type SkillCategory = "Frontend" | "Backend" | "3D & Creative" | "Exploring";

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  type: "known" | "exploring";
  shortDesc: string;
  details: string;
  color: string;
  iconSymbol: string;
}

export const KNOWN_SKILLS: SkillItem[] = [
  // --- FRONTEND ---
  {
    id: "html-css",
    name: "HTML5 & CSS3",
    category: "Frontend",
    type: "known",
    shortDesc: "Semantic markup, modern layouts, and accessible web structure.",
    details:
      "Deep understanding of semantic document structure, CSS Flexbox & Grid layouts, CSS custom properties (variables), responsive design across breakpoints, and accessible web standards.",
    color: "#e44d26",
    iconSymbol: "🌐",
  },
  {
    id: "js-ts",
    name: "JavaScript & TypeScript",
    category: "Frontend",
    type: "known",
    shortDesc: "Strong ESNext core logic and type-safe software engineering.",
    details:
      "Proficient in modern ESNext idioms, asynchronous programming (Promises, async/await), closures, prototype mechanisms, and strict TypeScript types, interfaces, generics, and compiler configurations.",
    color: "#3178c6",
    iconSymbol: "TS",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Frontend",
    type: "known",
    shortDesc: "Utility-first rapid UI development and design system architecture.",
    details:
      "Experienced in building scalable responsive interfaces, custom design tokens, dark mode theming, modern Tailwind v4 theme configurations, and component-level style composability.",
    color: "#38bdf8",
    iconSymbol: "🎨",
  },
  {
    id: "react-next",
    name: "React & Next.js",
    category: "Frontend",
    type: "known",
    shortDesc: "Component-driven applications, App Router, and SSR workflows.",
    details:
      "Skilled in React component architecture, custom hooks, context management, performance optimization, and Next.js App Router, Server/Client components, dynamic routing, and fast Turbopack bundling.",
    color: "#61dafb",
    iconSymbol: "⚛️",
  },
  {
    id: "redux-vite",
    name: "Redux & Vite",
    category: "Frontend",
    type: "known",
    shortDesc: "Predictable centralized state management and modern bundling.",
    details:
      "Familiar with Redux Toolkit pattern, slices, dispatched actions, immutable state updates, and setting up high-speed Vite build environments with optimized HMR.",
    color: "#764abc",
    iconSymbol: "⚡",
  },

  // --- BACKEND ---
  {
    id: "node-express",
    name: "Node.js & Express.js",
    category: "Backend",
    type: "known",
    shortDesc: "Server-side REST API development and middleware architectures.",
    details:
      "Experience creating RESTful backend endpoints, routing structures, custom request middleware, CORS handling, asynchronous error handlers, and JSON request/response pipelines.",
    color: "#22c55e",
    iconSymbol: "🟢",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Backend",
    type: "known",
    shortDesc: "Document-oriented database modeling and aggregation queries.",
    details:
      "Familiar with NoSQL document schemas, Mongoose ODM modeling, CRUD operations, indexed collections, basic aggregation pipelines, and cloud database connectivity.",
    color: "#10b981",
    iconSymbol: "🍃",
  },

  // --- 3D & CREATIVE ---
  {
    id: "threejs",
    name: "Three.js",
    category: "3D & Creative",
    type: "known",
    shortDesc: "WebGL scene graphs, procedural meshes, lighting, and materials.",
    details:
      "Hands-on experience with Three.js scene hierarchies, camera projections, standard/physical materials, directional and point lighting, custom procedural geometries, and shadow mapping.",
    color: "#f59e0b",
    iconSymbol: "🔺",
  },
  {
    id: "gsap",
    name: "GSAP",
    category: "3D & Creative",
    type: "known",
    shortDesc: "Performant UI timeline sequencing, easing, and micro-interactions.",
    details:
      "Capable of building smooth timeline orchestrations, staggered entrance animations, transform tweens, and reactive interface feedback with zero frame drops.",
    color: "#84cc16",
    iconSymbol: "🎬",
  },
];

export const EXPLORATION_SKILLS: SkillItem[] = [
  {
    id: "r3f",
    name: "React Three Fiber",
    category: "Exploring",
    type: "exploring",
    shortDesc: "Declarative WebGL canvas rendering within React component lifecycles.",
    details:
      "Currently learning declarative 3D composition, useFrame game loops, canvas state management, and bridging DOM and Three.js fiber trees in production projects.",
    color: "#06b6d4",
    iconSymbol: "R3F",
  },
  {
    id: "drei",
    name: "Drei",
    category: "Exploring",
    type: "exploring",
    shortDesc: "High-level R3F helper ecosystem and shader utilities.",
    details:
      "Exploring specialized Drei abstractions including procedural Sky, SDF 3D Text typography, OrbitControls, and environment lighting setups.",
    color: "#38bdf8",
    iconSymbol: "📦",
  },
  {
    id: "blender",
    name: "Blender",
    category: "Exploring",
    type: "exploring",
    shortDesc: "Low-poly 3D modeling, UV unwrapping, and asset creation.",
    details:
      "Learning foundational 3D modeling pipelines: mesh extrusion, low-poly environmental props, materials setup, and clean export workflows for the web.",
    color: "#f97316",
    iconSymbol: "🔶",
  },
  {
    id: "zustand",
    name: "Zustand",
    category: "Exploring",
    type: "exploring",
    shortDesc: "Lightweight reactive state stores for decoupled 3D architectures.",
    details:
      "Investigating atomic store patterns that allow high-frequency game-loop state access without triggering unwanted React component re-renders.",
    color: "#eab308",
    iconSymbol: "🐻",
  },
  {
    id: "rapier",
    name: "Rapier Physics",
    category: "Exploring",
    type: "exploring",
    shortDesc: "WebAssembly-powered rigid-body physical simulation.",
    details:
      "Studying physics colliders, kinematic player controllers, raycasting ground sensors, and impulse-driven dynamics for interactive web worlds.",
    color: "#ef4444",
    iconSymbol: "⚙️",
  },
  {
    id: "gltf-workflow",
    name: "GLB/glTF Workflows",
    category: "Exploring",
    type: "exploring",
    shortDesc: "Asset optimization, compression, and progressive loading.",
    details:
      "Learning asset pipelines using Draco compression, Meshopt, texture resolution budgeting, and lazy loading strategies for responsive load times.",
    color: "#a855f7",
    iconSymbol: "📁",
  },
  {
    id: "char-controllers",
    name: "Character Controllers",
    category: "Exploring",
    type: "exploring",
    shortDesc: "Procedural walk cycles, kinematics, and movement smoothing.",
    details:
      "Refining mathematical walk cycle animations, limb swinging sync, velocity dampening, slope handling, and reactive player physics.",
    color: "#10b981",
    iconSymbol: "🚶",
  },
  {
    id: "third-person-cam",
    name: "Third-Person Cameras",
    category: "Exploring",
    type: "exploring",
    shortDesc: "Spherical orbit mathematics, wall occlusion, and tracking rigs.",
    details:
      "Implementing 360-degree yaw/pitch spherical coordinates, camera-relative movement vectors, smooth lag lerping, and raycast obstacle occlusion.",
    color: "#6366f1",
    iconSymbol: "🎥",
  },
  {
    id: "3d-optimization",
    name: "3D Optimization",
    category: "Exploring",
    type: "exploring",
    shortDesc: "Draw call budgeting, geometry reuse, and device pixel scaling.",
    details:
      "Mastering WebGL performance tuning: device pixel ratio clamping, geometry instancing, material sharing, and shadow frustum minimization.",
    color: "#14b8a6",
    iconSymbol: "⚡",
  },
];
