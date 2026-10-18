import { SectionConfig, SectionId } from '@/types';

export const SECTIONS: SectionConfig[] = [
  {
    id: 'intro',
    label: 'Intro',
    stationName: 'Welcome',
    order: 0,
    cameraPosition: [0, 2.1, 7.2],
    cameraTarget: [0, 1.7, 0],
    fov: 48
  },
  {
    id: 'room',
    label: 'Studio',
    stationName: 'Creative Study Room',
    order: 1,
    cameraPosition: [0.2, 2.2, 5.8],
    cameraTarget: [-0.3, 1.6, -1.5],
    fov: 50
  },
  {
    id: 'about',
    label: 'About',
    stationName: 'Workstation Desktop',
    order: 2,
    cameraPosition: [-1.2, 2.22, -0.6],
    cameraTarget: [-1.2, 2.22, -4.45],
    fov: 50
  },
  {
    id: 'skills',
    label: 'Skills',
    stationName: 'Skills Planet & Portrait',
    order: 3,
    cameraPosition: [0.4, 1.8, 0.4],
    cameraTarget: [3.2, 1.6, 0.5],
    fov: 50
  },
  {
    id: 'projects',
    label: 'Projects',
    stationName: 'Projector Presentation',
    order: 4,
    cameraPosition: [-1.5, 2.05, 0.8],
    cameraTarget: [-4.96, 2.1, 0.8],
    fov: 46
  },
  {
    id: 'achievements',
    label: 'Milestones',
    stationName: 'Achievements & Milestones',
    order: 5,
    cameraPosition: [0, 2.1, 2.6],
    cameraTarget: [0, 2.15, 6.74],
    fov: 48
  },
  {
    id: 'contact',
    label: 'Contact',
    stationName: 'Wall Monitor & Mail',
    order: 6,
    cameraPosition: [-1.2, 2.22, -0.6],
    cameraTarget: [-1.2, 2.22, -4.45],
    fov: 50
  }
];

export const OVERVIEW_CAMERA = {
  position: [0, 2.5, 2.8] as [number, number, number],
  target: [0, 1.5, -0.5] as [number, number, number],
  fov: 56
};

export const SECTION_MAP: Record<SectionId, SectionConfig> = SECTIONS.reduce(
  (acc, section) => {
    acc[section.id] = section;
    return acc;
  },
  {} as Record<SectionId, SectionConfig>
);

// Map old ids to prevent any regressions
SECTION_MAP['gate'] = SECTIONS[0];
SECTION_MAP['welcome'] = SECTIONS[1];

export const SECTION_IDS: SectionId[] = SECTIONS.map((s) => s.id);
