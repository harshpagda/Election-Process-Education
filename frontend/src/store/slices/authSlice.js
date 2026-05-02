import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // API call will be made from the component
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
    localStorage.removeItem("token");
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // API call will be made from the component
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  restoreSession: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      });
    }
  },
}));
