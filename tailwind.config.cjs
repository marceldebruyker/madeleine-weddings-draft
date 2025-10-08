const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          night: '#05060D',
          midnight: '#0C0F1F',
          raisin: '#171A2E',
          slate: '#222541',
          dusk: '#2F3358',
          blush: '#D6A8C4',
          bloom: '#F4C9E4',
          cream: '#F5F0FA',
          mist: '#9AA4C2'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
        body: ['"Inter"', ...defaultTheme.fontFamily.sans]
      },
      boxShadow: {
        glow: '0 35px 90px -25px rgba(212, 168, 196, 0.35)'
      },
      backgroundImage: {
        'noise-pattern': "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27240%27 height=%27240%27 viewBox=%270 0 240 240%27%3E%3Crect width=%27240%27 height=%27240%27 fill=%2705060D%27/%3E%3Ccircle cx=%278%27 cy=%2790%27 r=%270.8%27 fill=%27%232F3358%27/%3E%3Ccircle cx=%27160%27 cy=%27180%27 r=%270.9%27 fill=%27%23D6A8C4%27 opacity=%270.35%27/%3E%3Ccircle cx=%2790%27 cy=%2760%27 r=%271.1%27 fill=%27%23171A2E%27 opacity=%270.55%27/%3E%3C/svg%3E')"
      }
    }
  },
  plugins: []
};
