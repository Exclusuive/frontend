import { create } from "zustand";
import { Market } from "@/types/market";

interface MarketState {
  market: Market | null;
  setMarket: (market: Market) => void;
  updateMarket: (market: Partial<Market>) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  market: null,
  setMarket: (market) => set({ market }),
  updateMarket: (market: Partial<Market>) =>
    set((state) => ({
      market: { ...state.market, ...market } as Market,
    })),
}));
