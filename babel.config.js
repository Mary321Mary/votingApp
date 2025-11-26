module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          "@": "./src",
          utils: "./src/utils",
          components: "./src/components",
          styles: "./src/styles",
          i18n: "./src/i18n",
          assets: "./src/assets",
        },
      },
    ],
  ],
};
