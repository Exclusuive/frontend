import { create } from "zustand";
import { Collection, CollectionItem, Listing, Market } from "@/types/collection";
import { Mission } from "@/types/mission";

interface CollectionState {
  collection: Collection | null;
  setCollection: (collection: Collection) => void;
  addItemToCollection: (item: CollectionItem) => void;
  addMarketToCollection: (market: Market) => void;
  addLayerToCollection: (layer: string) => void;
  addListingToCollection: (listing: Listing) => void;
  addProductToCollection: (listing: Listing) => void;
  equipItemToMembership: (item: CollectionItem) => void;
  addMission: (mission: Mission) => void;
  updateMission: (mission: Mission) => void;
  deleteMission: (missionId: string) => void;
  toggleMissionStatus: (missionId: string) => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  collection: null,
  setCollection: (collection) => set({ collection }),
  addItemToCollection: (item) =>
    set((state) => ({
      collection: state.collection
        ? { ...state.collection, items: [...(state.collection.items || []), item] }
        : null,
    })),
  addMarketToCollection: (market) =>
    set((state) => ({
      collection: state.collection
        ? { ...state.collection, markets: [...(state.collection.markets || []), market] }
        : null,
    })),
  addLayerToCollection: (layer) =>
    set((state) => ({
      collection: state.collection
        ? { ...state.collection, layers: [...(state.collection.layers || []), layer] }
        : null,
    })),
  addListingToCollection: (listing) =>
    set((state) => ({
      collection: state.collection
        ? {
            ...state.collection,
            markets: (state.collection.markets || []).map((m) =>
              m.market_id === listing.market_id
                ? { ...m, listings: [...(m.listings || []), listing] }
                : m,
            ),
          }
        : null,
    })),
  addProductToCollection: (listing) =>
    set((state) => ({
      collection: state.collection
        ? {
            ...state.collection,
            markets: (state.collection.markets || []).map((m) =>
              m.market_id === listing.market_id
                ? {
                    ...m,
                    listings: (m.listings || []).map((l) =>
                      l.listing_number === listing.listing_number ? listing : l,
                    ),
                  }
                : m,
            ),
          }
        : null,
    })),
  equipItemToMembership: (item) =>
    set((state) => ({
      collection: state.collection
        ? {
            ...state.collection,

            selected_membership: state.collection.selected_membership
              ? {
                  ...state.collection.selected_membership,
                  equipped_items: [
                    ...(state.collection.selected_membership.equipped_items || []),
                    item,
                  ],
                }
              : undefined,
          }
        : null,
    })),
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
