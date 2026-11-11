#!/usr/bin/env node
/**
 * Makes `npm install` enough for a fresh clone to be buildable in Xcode.
 *
 * The SwiftPM packages React Native generates (ReactNative, Autolinked,
 * React-GeneratedCode) live under `ios/build/`, which is git-ignored. On a
 * fresh checkout they do not exist yet, and Xcode cannot resolve package
 * references until they do. `react-native spm update` creates them (codegen,
 * autolinking and the prebuilt React/Hermes XCFrameworks), so run it once when
 * any of the three is missing.
 *
 * macOS only: on other platforms this is a no-op, and it never fails the npm
 * install — a missing package is reported by Xcode as a normal resolution
 * error, and this script must not break JS-only/Android CI.
 *
 * Skip with SKIP_IOS_SPM_SETUP=1.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..');
const required = [
  'ios/build/xcframeworks/Package.swift',
  'ios/build/generated/autolinking/Package.swift',
  'ios/build/generated/ios/Package.swift',
];

function main() {
  if (process.platform !== 'darwin' || process.env.SKIP_IOS_SPM_SETUP === '1') {
    return;
  }

  if (required.every(p => fs.existsSync(path.join(projectRoot, p)))) {
    return;
  }

  const setupScript = path.join(
    projectRoot,
    'node_modules',
    'react-native',
    'scripts',
    'setup-apple-spm.js',
  );
  if (!fs.existsSync(setupScript)) {
    console.warn(
      '[ios-spm] react-native is not installed yet; skipping the SwiftPM bootstrap.',
    );
    return;
  }

  console.log(
    '[ios-spm] Generated SwiftPM packages are missing — running `react-native spm update` once...',
  );
  const result = spawnSync(process.execPath, [setupScript, 'update'], {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    console.warn(
      '\n[ios-spm] The SwiftPM bootstrap failed. Build the iOS app once with\n' +
        '  npx react-native spm update\n' +
        'after fixing the error above. Android and JS workflows are unaffected.\n',
    );
  }
}

main();
