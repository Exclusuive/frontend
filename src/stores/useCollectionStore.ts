import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Collection } from "@/types/collection";

interface CollectionState {
  collection: Collection | null;
  setCollection: (collection: Collection) => void;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set) => ({
      collection: null,
      setCollection: (collection: Collection) => {
        set({ collection });
      },
    }),
    {
      name: "collection-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
