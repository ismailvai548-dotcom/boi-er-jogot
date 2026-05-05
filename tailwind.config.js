/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // UI এর জন্য Sans-serif ফন্ট
        sans: ['Inter', 'Noto Sans Bengali', 'sans-serif'],
        // পড়ার জন্য Serif ফন্ট
        serif: ['Lora', 'Noto Serif Bengali', 'serif'],
      },
    },
  },
  plugins: [],
}