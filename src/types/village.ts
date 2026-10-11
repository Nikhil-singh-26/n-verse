export type BuildingId =
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "contact";

export interface BuildingColors {
  walls: string;
  roof: string;
  trim: string;
  accent: string;
  door: string;
  windowGlow?: string;
}

export interface BuildingConfig {
  id: BuildingId;
  name: string;
  category: string;
  description: string;
  position: [number, number, number];
  rotation: number;
  entrancePosition: [number, number, number]; // World position for door interaction trigger
  colors: BuildingColors;
  signText: string;
  doorWidth: number;
  doorHeight: number;
}

export interface InteractionState {
  activeBuildingId: BuildingId | null;
  nearestDistance: number;
  promptText: string | null;
  doorsOpen: Record<BuildingId, boolean>;
}
