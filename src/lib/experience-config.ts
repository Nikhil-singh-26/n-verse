import { SectionConfig, SectionId } from '@/types';

export const SECTIONS: SectionConfig[] = [
  {
    id: 'gate',
    label: 'Gate',
    stationName: 'N/VERSE Gateway',
    order: 0,
    cameraPosition: [0, 1.75, 15.2],
    cameraTarget: [0, 1.6, 10.5],
    fov: 48
  },
  {
    id: 'welcome',
    label: 'Welcome',
    stationName: 'Lab Threshold',
    order: 1,
    cameraPosition: [0, 1.7, 9.8],
    cameraTarget: [0, 1.6, 2.0],
    fov: 48
  },
  {
    id: 'about',
    label: 'About',
    stationName: 'Computer Terminal',
    order: 2,
    cameraPosition: [-2.85, 1.42, 5.25],
    cameraTarget: [-3.22, 1.35, 3.85],
    fov: 44
  },
  {
    id: 'skills',
    label: 'Skills',
    stationName: 'Orbital Core',
    order: 3,
    cameraPosition: [1.6, 2.2, 2.8],
    cameraTarget: [3.5, 2.1, 0.4],
    fov: 46
  },
  {
    id: 'projects',
    label: 'Projects',
    stationName: 'Holo-Projector',
    order: 4,
    cameraPosition: [-1.2, 1.8, -2.2],
    cameraTarget: [-2.8, 2.4, -8.2],
    fov: 46
  },
  {
    id: 'achievements',
    label: 'Timeline',
    stationName: 'Telemetry Board',
    order: 5,
    cameraPosition: [4.6, 2.2, -3.5],
    cameraTarget: [8.0, 2.4, -3.5],
    fov: 45
  },
  {
    id: 'contact',
    label: 'Contact',
    stationName: 'Comms Console',
    order: 6,
    cameraPosition: [0, 1.45, 3.4],
    cameraTarget: [0, 1.05, 1.5],
    fov: 46
  }
];

export const OVERVIEW_CAMERA = {
  position: [0, 3.4, 0.5] as [number, number, number],
  target: [0, 1.6, -4.0] as [number, number, number],
  fov: 55
};

export const SECTION_MAP: Record<SectionId, SectionConfig> = SECTIONS.reduce(
  (acc, section) => {
    acc[section.id] = section;
    return acc;
  },
  {} as Record<SectionId, SectionConfig>
);

export const SECTION_IDS: SectionId[] = SECTIONS.map((s) => s.id);
