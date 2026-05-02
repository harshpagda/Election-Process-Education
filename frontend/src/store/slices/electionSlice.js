import { create } from "zustand";

export const useElectionStore = create((set) => ({
  elections: [],
  selectedElection: null,
  timelines: [],
  isLoading: false,
  error: null,
  filters: {
    type: null,
    state: null,
    status: null,
  },

  setElections: (elections) => set({ elections }),
  setSelectedElection: (election) => set({ selectedElection: election }),
  setTimelines: (timelines) => set({ timelines }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  fetchElections: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      // API call will be made from the component
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchElectionDetails: async (electionId) => {
    set({ isLoading: true, error: null });
    try {
      // API call will be made from the component
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
