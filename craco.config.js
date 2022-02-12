const Dotenv = require("dotenv-webpack");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  webpack: {
    plugins: [new Dotenv({ path: "./.env.production" })],
  },
};
