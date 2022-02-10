const colors = require('./src/constants/defaultColors')
const plugins = require('./src/plugins')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minWidth: {
      'sidebar': '288px'
    },
    minHeight: {
      '6': '1.5rem'
    },
    fontFamily: {
      'display': ['Inter', 'sans-serif'],
       'body': ['Inter', 'sans-serif'],
    },
    extend: {
      colors
    },
  },
  variants: {
    extend: {},
  },
  plugins: [...Object.keys(plugins).map(name => plugins[name]())],
}
