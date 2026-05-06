export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        hope: {
          50:'#f0f7ff',100:'#e0efff',200:'#b9dcfe',300:'#7cc1fd',
          400:'#36a3f9',500:'#0c87eb',600:'#0069c9',700:'#0154a3',
          800:'#064886',900:'#0b3c6f',950:'#07254a',
        },
      },
      fontFamily: {
        display:['"DM Serif Display"','Georgia','serif'],
        body:['"DM Sans"','system-ui','sans-serif'],
      },
    },
  },
  plugins: [],
}
