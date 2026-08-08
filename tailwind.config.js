/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#211C1B",
        cream: "#F5F0EA",
        paper: "#FFFDF9",
        coral: "#FF7955",
        periwinkle: "#82AAF5",
        lime: "#9BE06B",
        yellow: "#F6C744",
        lavender: "#C9B7E8",
        "text-dark": "#171514",
        "text-muted": "#716A64",
        border: "#211C1B",
        background: "#F5F0EA",
        foreground: "#171514",
        primary: {
          DEFAULT: "#211C1B",
          foreground: "#FFFDF9",
        },
        secondary: {
          DEFAULT: "#FFFDF9",
          foreground: "#211C1B",
        },
        muted: {
          DEFAULT: "#F5F0EA",
          foreground: "#716A64",
        },
        accent: {
          DEFAULT: "#FF7955",
          foreground: "#FFFDF9",
        }
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      boxShadow: {
        "editorial": "4px 5px 0 #211C1B",
        "editorial-sm": "2px 3px 0 #211C1B",
        "editorial-hover": "6px 8px 0 #211C1B",
        "editorial-active": "1px 1px 0 #211C1B",
      },
      borderWidth: {
        "3": "3px",
      }
    },
  },
  plugins: [],
}
