/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          black: "#191414",
          green: "#1DB954",
          greendark: "#19823E"
        }
      },
      animation: {
        fadeout: "fade 0.3s linear reverse",
        fadein: "fade 0.3s linear",
        spin: "spin 1.5s linear infinite"
      },
      keyframes: {
        fade: {
          "0%": { display: "block", opacity: "1" },
          "99%": { display: "block", opacity: "0.1" },
          "100%": { display: "hidden", opacity: "0" }
        },
        spin: {
          "0%": { transform: "rotate(0)" },
          "100%": { transform: "rotate(360deg)" }
        }
      }
    },
    fontFamily: {
      sans: ["exo2"]
    }
  },
  plugins: []
}
