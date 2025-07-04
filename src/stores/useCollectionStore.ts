import { create } from "zustand";
import { Collection } from "@/types/collection";
import { Mission } from "@/types/mission";

interface CollectionState {
  collection: Collection | null;
  setCollection: (collection: Collection) => void;
  addMission: (mission: Mission) => void;
  updateMission: (mission: Mission) => void;
  deleteMission: (missionId: string) => void;
  toggleMissionStatus: (missionId: string) => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  collection: null,
  setCollection: (collection) => set({ collection }),
  addMission: (mission) =>
    set((state) => ({
      collection: state.collection
        ? { ...state.collection, missions: [...(state.collection.missions || []), mission] }
        : null,
    })),
  updateMission: (mission) =>
    set((state) => ({
      collection: state.collection
        ? {
            ...state.collection,
            missions: (state.collection.missions || []).map((m) =>
              m.id === mission.id ? mission : m,
            ),
          }
        : null,
    })),
  deleteMission: (missionId) =>
    set((state) => ({
      collection: state.collection
        ? {
            ...state.collection,
            missions: (state.collection.missions || []).filter((m) => m.id !== missionId),
          }
        : null,
    })),
  toggleMissionStatus: (missionId) =>
    set((state) => ({
      collection: state.collection
        ? {
            ...state.collection,
            missions: (state.collection.missions || []).map((m) =>
              m.id === missionId
                ? {
                    ...m,
                    status:
                      m.status === "active"
                        ? "inactive"
                        : m.status === "inactive"
                          ? "active"
                          : m.status,
                  }
                : m,
            ),
          }
        : null,
    })),
}));
