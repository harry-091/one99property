/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#13293d",
        brand: "#b9381f",
        sand: "#f6efe8",
        sage: "#dbe9df"
      },
      boxShadow: {
        soft: "0 20px 45px rgba(19, 41, 61, 0.08)"
      }
    }
  },
  plugins: []
};

