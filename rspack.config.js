const { defineConfig } = require("@meteorjs/rspack");

module.exports = defineConfig((Meteor) => {
  return {
    module: {
      rules: [
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ["@svgr/webpack"],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
  };
});
