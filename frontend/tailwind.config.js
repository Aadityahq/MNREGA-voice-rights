/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'india-saffron': '#FF9933',
        'india-white': '#FFFFFF',
        'india-green': '#138808',
        'india-blue': '#000080',
        'ashoka-blue': '#000080',
        'govt-gold': '#FFD700',
      },
      fontFamily: {
        'govt': ['Tiro Devanagari Hindi', 'serif'],
        'sans': ['Inter', 'Noto Sans', 'sans-serif']
      },
      backgroundImage: {
        'india-flag': 'linear-gradient(to bottom, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)',
        'govt-gradient': 'linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
      },
      borderWidth: {
        3: '3px', // add this to fix `border-3`
      }
    },
  },
  plugins: [],
};
