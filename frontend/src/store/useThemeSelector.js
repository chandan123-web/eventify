// import { create } from "zustand";

// export const useThemeStore = create((set) => ({
//   theme: localStorage.getItem("streamify-theme") || "coffee",
//   setTheme: (theme) => {
//     localStorage.setItem("streamify-theme", theme);
//     set({ theme });
//   },
// }));


import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("streamify-theme") || "coffee",

  setTheme: (theme) => {
    localStorage.setItem("streamify-theme", theme);
    document.documentElement.setAttribute("data-theme", theme); // Apply theme instantly
    set({ theme });
  },

  loadTheme: () => {
    const storedTheme = localStorage.getItem("streamify-theme");
    if (storedTheme) {
      document.documentElement.setAttribute("data-theme", storedTheme);
      set({ theme: storedTheme });
    }
  },
}));
