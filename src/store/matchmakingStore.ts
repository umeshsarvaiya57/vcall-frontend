import { create } from 'zustand';

interface MatchmakingState {
  isSearching: boolean;
  isMatched: boolean;
  partnerConnected: boolean;
  setSearching: (isSearching: boolean) => void;
  setMatched: (isMatched: boolean) => void;
  setPartnerConnected: (partnerConnected: boolean) => void;
  resetMatchmaking: () => void;
}

export const useMatchmakingStore = create<MatchmakingState>((set) => ({
  isSearching: false,
  isMatched: false,
  partnerConnected: false,

  setSearching: (isSearching) => set({ isSearching }),
  setMatched: (isMatched) => set({ isMatched }),
  setPartnerConnected: (partnerConnected) => set({ partnerConnected }),
  resetMatchmaking: () => set({
    isSearching: false,
    isMatched: false,
    partnerConnected: false,
  }),
}));
