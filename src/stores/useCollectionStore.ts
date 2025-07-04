import { create } from "zustand";
import { Collection } from "@/types/collection";

interface CollectionState {
  collection: Collection | null;
  setCollection: (collection: Collection) => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  collection: null,
  setCollection: (collection: Collection) => set({ collection }),
}));
