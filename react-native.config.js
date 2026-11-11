module.exports = {
  assets: ['./src/assets/fonts/'],
  dependencies: {
    // JS-only library. It ships a podspec but no iOS sources, so under
    // CocoaPods it produced an empty pod and under SwiftPM it would produce an
    // empty target. Opting iOS out keeps autolinking clean.
    'react-native-render-html': {
      platforms: {
        ios: null,
      },
    },
  },
};
