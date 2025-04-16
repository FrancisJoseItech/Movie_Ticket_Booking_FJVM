/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    plugins: [require("daisyui")],
    daisyui: {
      themes: ["light", "dark", "cupcake", "synthwave"], // 🌈 Add or remove themes // ✅ Customize if needed
    },
  };
  