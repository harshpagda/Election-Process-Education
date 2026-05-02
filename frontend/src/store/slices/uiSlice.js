import { create } from "zustand";

export const useUIStore = create((set) => ({
  theme: localStorage.getItem("theme") || "light",
  language: localStorage.getItem("language") || "en",
  sidebarOpen: false,
  modal: {
    isOpen: false,
    title: "",
    content: "",
  },
  toast: {
    isOpen: false,
    message: "",
    type: "info",
  },

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },

  setLanguage: (language) => {
    localStorage.setItem("language", language);
    set({ language });
  },

  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),

  openModal: (title, content) =>
    set({
      modal: { isOpen: true, title, content },
    }),

  closeModal: () =>
    set({
      modal: { isOpen: false, title: "", content: "" },
    }),

  showToast: (message, type = "info") =>
    set({
      toast: { isOpen: true, message, type },
    }),

  closeToast: () =>
    set({
      toast: { isOpen: false, message: "", type: "info" },
    }),
}));
