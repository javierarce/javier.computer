module.exports = {
  plugins: ["@shopify/prettier-plugin-liquid"],
  overrides: [
    {
      files: ["*.liquid", "**/*.liquid", "*.html", "**/*.html"],
      options: {
        parser: "liquid-html",
      },
    },
  ],
};
