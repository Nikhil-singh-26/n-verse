import { useSyncExternalStore } from "react";
import * as THREE from "three";
import { BuildingConfig, BuildingId } from "@/types/village";
import { BUILDINGS_DATA } from "@/data/buildingsData";

interface VillageState {
  doorsOpen: Record<BuildingId, boolean>;
  activeBuilding: BuildingConfig | null;
}

const INTERACTION_ENTER_RADIUS = 3.2;
const INTERACTION_LEAVE_RADIUS = 4.0;

class VillageStoreManager {
  private state: VillageState = {
    doorsOpen: {
      about: false,
      skills: false,
      projects: false,
      experience: false,
      education: false,
      contact: false,
    },
    activeBuilding: null,
  };

  private listeners = new Set<() => void>();
  private playerPos = new THREE.Vector3(0, 0, 0);

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.handleKeyDown);
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return;
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    if (e.code === "KeyE") {
      const active = this.state.activeBuilding;
      if (active) {
        this.toggleDoor(active.id);
      }
    }
  };

  public getSnapshot = (): VillageState => {
    return this.state;
  };

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private emitChange() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public toggleDoor = (buildingId: BuildingId) => {
    this.state = {
      ...this.state,
      doorsOpen: {
        ...this.state.doorsOpen,
        [buildingId]: !this.state.doorsOpen[buildingId],
      },
    };
    this.emitChange();
  };

  public setDoorOpen = (buildingId: BuildingId, open: boolean) => {
    if (this.state.doorsOpen[buildingId] === open) return;
    this.state = {
      ...this.state,
      doorsOpen: {
        ...this.state.doorsOpen,
        [buildingId]: open,
      },
    };
    this.emitChange();
  };

  public updatePlayerPosition = (x: number, y: number, z: number) => {
    this.playerPos.set(x, y, z);

    let nearest: BuildingConfig | null = null;
    let minDistance = Infinity;

    for (const building of BUILDINGS_DATA) {
      const [ex, , ez] = building.entrancePosition;
      const dx = x - ex;
      const dz = z - ez;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < minDistance) {
        minDistance = dist;
        nearest = building;
      }
    }

    const currentActive = this.state.activeBuilding;
    let stateChanged = false;

    if (currentActive) {
      const [ex, , ez] = currentActive.entrancePosition;
      const currentDist = Math.sqrt((x - ex) ** 2 + (z - ez) ** 2);

      // Player stepped away past leave radius
      if (currentDist > INTERACTION_LEAVE_RADIUS) {
        let updatedDoors = this.state.doorsOpen;
        // If the door was open, automatically close it
        if (this.state.doorsOpen[currentActive.id]) {
          updatedDoors = {
            ...this.state.doorsOpen,
            [currentActive.id]: false,
          };
        }

        this.state = {
          ...this.state,
          doorsOpen: updatedDoors,
          activeBuilding: null,
        };
        stateChanged = true;
      }
    } else {
      // Check if entering nearest building radius
      if (nearest && minDistance <= INTERACTION_ENTER_RADIUS) {
        this.state = {
          ...this.state,
          activeBuilding: nearest,
        };
        stateChanged = true;
      }
    }

    if (stateChanged) {
      this.emitChange();
    }
  };
}

export const villageStore = new VillageStoreManager();

export function useVillage() {
  const state = useSyncExternalStore(
    villageStore.subscribe,
    villageStore.getSnapshot,
    villageStore.getSnapshot
  );

  return {
    doorsOpen: state.doorsOpen,
    activeBuilding: state.activeBuilding,
    toggleDoor: villageStore.toggleDoor,
    setDoorOpen: villageStore.setDoorOpen,
    updatePlayerPosition: villageStore.updatePlayerPosition,
  };
}
