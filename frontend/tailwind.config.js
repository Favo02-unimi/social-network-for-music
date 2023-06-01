/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {},
      animation: {
        fadeout: "fade 0.3s linear reverse",
        fadein: "fade 0.3s linear"
      },
      keyframes: {
        fade: {
          "0%": { display: "block", opacity: "1" },
          "99%": { display: "block", opacity: "0.1" },
          "100%": { display: "hidden", opacity: "0" }
        }
      }
    },
    fontFamily: {
      sans: ["exo2"]
    }
  },
  plugins: []
}
