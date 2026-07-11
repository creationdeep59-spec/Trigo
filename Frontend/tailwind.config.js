/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171716",
        base: "#FFFCF7",
        chili: {
          DEFAULT: "#FF4B3E",
          dark: "#E23A2E",
          light: "#FFE8E5",
        },
        basil: {
          DEFAULT: "#2F8F5B",
          light: "#E4F4EB",
        },
        turmeric: {
          DEFAULT: "#FFB100",
          light: "#FFF3D6",
        },
        muted: "#6B675F",
        card: "#F6F2E9",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.6)", opacity: "0.4" },
        },
        scooter: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(100% - 2rem))" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
        scooter: "scooter 3s ease-in-out infinite alternate",
        riseIn: "riseIn 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
