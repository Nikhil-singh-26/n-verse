import { SectionConfig, SectionId } from '@/types';

export const SECTIONS: SectionConfig[] = [
  {
    id: 'intro',
    label: 'Intro',
    stationName: 'Cinematic Gateway',
    order: 0,
    cameraPosition: [0, 2.1, 7.2],
    cameraTarget: [0, 1.7, 0],
    fov: 48
  },
  {
    id: 'room',
    label: 'My Verse',
    stationName: 'Studio Entry',
    order: 1,
    cameraPosition: [0.2, 2.2, 5.8],
    cameraTarget: [-0.3, 1.6, -1.5],
    fov: 50
  },
  {
    id: 'workstation',
    label: 'Desktop',
    stationName: 'Display',
    order: 2,
    cameraPosition: [-1.2, 2.22, -1.80],
    cameraTarget: [-1.2, 2.22, -4.45],
    fov: 50
  },
  {
    id: 'skills',
    label: 'Skills',
    stationName: 'Technology & Skills Planet',
    order: 3,
    cameraPosition: [-0.6, 1.45, 0.0],
    cameraTarget: [3.0, 1.45, 0.0],
    fov: 46
  },
  {
    id: 'projects',
    label: 'Projects',
    stationName: 'Projects Arena',
    order: 4,
    cameraPosition: [-1.05, 1.62, 1.95],
    cameraTarget: [-4.96, 2.05, 0.70],
    fov: 50
  },
  {
    id: 'achievements',
    label: 'Milestones',
    stationName: 'Achievements & Milestones',
    order: 5,
    cameraPosition: [0, 2.15, 3.45],
    cameraTarget: [0, 2.15, 6.74],
    fov: 48
  },
  {
    id: 'finale',
    label: 'Outro',
    stationName: 'Outro',
    order: 6,
    cameraPosition: [0.0, 2.5, 5.6],
    cameraTarget: [0.0, 1.6, -1.0],
    fov: 52
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

// Map old and inner desktop window ids to workstation
SECTION_MAP['about'] = SECTIONS[2];
SECTION_MAP['resume'] = SECTIONS[2];
SECTION_MAP['contact'] = SECTIONS[2];
SECTION_MAP['gate'] = SECTIONS[0];
SECTION_MAP['welcome'] = SECTIONS[1];

export const SECTION_IDS: SectionId[] = SECTIONS.map((s) => s.id);
