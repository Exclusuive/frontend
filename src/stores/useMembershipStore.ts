import { create } from "zustand";
import { Item } from "@/types/collection";
import { Membership } from "@/types/user";

interface MembershipState {
  membership: Membership | null;

  // Membership management
  setMembership: (membership: Membership | null) => void;
  updateMembership: (updates: Partial<Membership>) => void;

  // Item management
  addItem: (item: Item) => void;
  updateItem: (itemAddress: string, updates: Partial<Item>) => void;
  deleteItem: (itemAddress: string) => void;

  // Bulk operations
  addItems: (items: Item[]) => void;
  deleteItems: (itemAddresses: string[]) => void;

  // Utility functions
  getItemByAddress: (itemAddress: string) => Item | undefined;
}

export const useMembershipStore = create<MembershipState>((set, get) => ({
  membership: null,

  // Membership management
  setMembership: (membership) => set({ membership }),

  updateMembership: (updates) =>
    set((state) => ({
      membership: state.membership ? { ...state.membership, ...updates } : null,
    })),

  // Item management
  addItem: (item) =>
    set((state) => ({
      membership: state.membership
        ? { ...state.membership, items: [...state.membership.items, item] }
        : null,
    })),

  updateItem: (itemAddress, updates) =>
    set((state) => ({
      membership: state.membership
        ? {
            ...state.membership,
            items: state.membership.items.map((item) =>
              item.address === itemAddress ? { ...item, ...updates } : item,
            ),
          }
        : null,
    })),

  deleteItem: (itemAddress) =>
    set((state) => ({
      membership: state.membership
        ? {
            ...state.membership,
            items: state.membership.items.filter((item) => item.address !== itemAddress),
          }
        : null,
    })),

  // Bulk operations
  addItems: (items) =>
    set((state) => ({
      membership: state.membership
        ? { ...state.membership, items: [...state.membership.items, ...items] }
        : null,
    })),

  deleteItems: (itemAddresses) =>
    set((state) => ({
      membership: state.membership
        ? {
            ...state.membership,
            items: state.membership.items.filter((item) => !itemAddresses.includes(item.address)),
          }
        : null,
    })),

  // Utility functions
  getItemByAddress: (itemAddress) => {
    const state = get();
    return state.membership?.items.find((item) => item.address === itemAddress);
  },
}));
