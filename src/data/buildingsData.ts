import { BuildingConfig } from "@/types/village";

export const BUILDINGS_DATA: BuildingConfig[] = [
  {
    id: "about",
    name: "About Me",
    category: "Personal Story & Bio",
    description:
      "A warm and welcoming rustic cottage nestled under the trees. Step inside to learn about my background, passions, and developer journey.",
    position: [-12.5, 0, -11],
    rotation: 0.35,
    entrancePosition: [-11.4, 0, -8.0],
    colors: {
      walls: "#fef3c7", // Warm cream plaster
      roof: "#b45309",  // Cedar shingles
      trim: "#78350f",  // Rustic timber
      accent: "#f59e0b",
      door: "#92400e",  // Solid oak door
      windowGlow: "#fef08a",
    },
    signText: "ABOUT ME",
    doorWidth: 1.1,
    doorHeight: 2.1,
  },
  {
    id: "skills",
    name: "Skills",
    category: "Tech Stack & Tools",
    description:
      "A futuristic cyber research facility with server arrays and solar collectors. Explore my programming languages, frameworks, and technical tools.",
    position: [12.5, 0, -11],
    rotation: -0.35,
    entrancePosition: [11.4, 0, -8.0],
    colors: {
      walls: "#0f172a", // Obsidian slate
      roof: "#1e3a8a",  // Solar panel blue
      trim: "#0284c7",  // Cyber cyan
      accent: "#38bdf8",
      door: "#0369a1",  // High-tech glass/alloy door
      windowGlow: "#38bdf8",
    },
    signText: "SKILLS",
    doorWidth: 1.1,
    doorHeight: 2.1,
  },
  {
    id: "projects",
    name: "Projects",
    category: "Featured Works",
    description:
      "A lofted creative atelier with expansive skylights and vibrant canopies. Discover interactive applications, 3D web games, and production software.",
    position: [15.5, 0, 2],
    rotation: -Math.PI / 2,
    entrancePosition: [12.3, 0, 2],
    colors: {
      walls: "#ea580c", // Terracotta orange
      roof: "#0f766e",  // Patina teal metal
      trim: "#fed7aa",  // Light peach timber
      accent: "#f97316",
      door: "#c2410c",  // Artisan studio door
      windowGlow: "#ffedd5",
    },
    signText: "PROJECTS",
    doorWidth: 1.1,
    doorHeight: 2.1,
  },
  {
    id: "experience",
    name: "Experience",
    category: "Career & Work History",
    description:
      "A structured corporate boutique office featuring classical stone pilasters and modern glazing. Review my career trajectory, client engagements, and roles.",
    position: [11.5, 0, 13.5],
    rotation: -2.7,
    entrancePosition: [10.1, 0, 10.6],
    colors: {
      walls: "#f1f5f9", // Polished limestone
      roof: "#334155",  // Slate grey parapet
      trim: "#64748b",  // Charcoal stone
      accent: "#d97706", // Brass/gold plaques
      door: "#1e293b",  // Graphite office door
      windowGlow: "#e2e8f0",
    },
    signText: "EXPERIENCE",
    doorWidth: 1.1,
    doorHeight: 2.1,
  },
  {
    id: "education",
    name: "Education",
    category: "Academics & Credentials",
    description:
      "A grand collegiate academy hall complete with peaked clock spire and stepped pediment. Explore degrees, certifications, and academic achievements.",
    position: [-11.5, 0, 13.5],
    rotation: 2.7,
    entrancePosition: [-10.1, 0, 10.6],
    colors: {
      walls: "#991b1b", // Heritage crimson brick
      roof: "#1e293b",  // Academy slate
      trim: "#d97706",  // Sandstone quoins
      accent: "#f59e0b",
      door: "#451a03",  // Mahogany academy door
      windowGlow: "#fef08a",
    },
    signText: "EDUCATION",
    doorWidth: 1.1,
    doorHeight: 2.1,
  },
  {
    id: "contact",
    name: "Contact",
    category: "Get in Touch",
    description:
      "A communication outpost equipped with postal boxes and broadcast antenna. Send a message, connect on socials, or collaborate on new ventures.",
    position: [-15.5, 0, 2],
    rotation: Math.PI / 2,
    entrancePosition: [-12.3, 0, 2],
    colors: {
      walls: "#7c2d12", // Rich cedar wood
      roof: "#0d9488",  // Weathered copper
      trim: "#fef3c7",  // Warm parchment
      accent: "#f59e0b", // Brass transceiver
      door: "#78350f",  // Telegraph outpost door
      windowGlow: "#fde047",
    },
    signText: "CONTACT",
    doorWidth: 1.1,
    doorHeight: 2.1,
  },
];
