#!/usr/bin/env node
/**
 * Generates `GeneratedDotEnv.m` for react-native-config.
 *
 * react-native-config used to run `BuildDotenvConfig.rb` from a CocoaPods
 * `script_phase`, i.e. on every Xcode build, immediately before the pod's
 * sources were compiled. Swift Package Manager has no per-target script
 * phases, so the file has to exist before the package graph is compiled.
 *
 * This script reproduces the upstream Ruby behaviour (same file, same
 * `DOT_ENV` / `RNC_DOT_ENV_FOUND` / `RNC_DOT_ENV_PATH` defines, same
 * `.env`/`ENVFILE` resolution order) and is wired to `postinstall` and
 * `preios`. A missing .env is not an error: the app builds and `Config` is
 * empty at runtime, exactly like the CocoaPods build did.
 *
 * Usage: node scripts/generate-ios-config.js
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const packageRoot = path.join(projectRoot, 'node_modules', 'react-native-config');
const outputPath = path.join(
  packageRoot,
  'ios',
  'ReactNativeConfig',
  'GeneratedDotEnv.m',
);

const ENTRY_PATTERN =
  /^(?:export\s+|)(?<key>[A-Za-z0-9_]+)\s*=\s*((?<quote>["'])?(?<val>.*?[^\\])\k<quote>?|)$/;

function parseDotEnv(contents) {
  const result = {};
  for (const line of contents.split('\n')) {
    if (line.trim() === '' || /^\s*#/.test(line)) {
      continue;
    }
    const match = ENTRY_PATTERN.exec(line);
    if (match == null) {
      throw new Error(
        `Invalid entry in .env file: ${JSON.stringify(line)}. ` +
          'Expected KEY=value, one per line.',
      );
    }
    // Values may contain quotes; escape them for the ObjC string literal, as
    // upstream's ReadDotEnv.rb does.
    result[match.groups.key] = match.groups.val.replace(/"/g, '\\"');
  }
  return result;
}

function selectEnvFile() {
  // `/tmp/envfile` is react-native-config's per-build override (written by
  // some CI setups); it takes precedence, then ENVFILE, then `.env`.
  try {
    const fromTmp = fs.readFileSync('/tmp/envfile', 'utf8').trim();
    if (fromTmp.length > 0) {
      return fromTmp;
    }
  } catch {
    // no override
  }

  const requested = process.env.ENVFILE;
  if (requested == null || requested.trim() === '') {
    return '.env';
  }
  const name = requested.trim();
  if (/\$[({]?[A-Za-z_]/.test(name)) {
    // Xcode expands build settings; a plain shell/npm run cannot.
    console.warn(
      `[ios-config] ENVFILE="${name}" contains an unexpanded build setting. ` +
        'Run through Xcode with an .xcode.env that exports it, or pass a concrete file name.',
    );
  }
  return name;
}

function main() {
  if (!fs.existsSync(path.join(packageRoot, 'package.json'))) {
    console.error(
      `[ios-config] react-native-config is not installed at ${packageRoot}; ` +
        'run npm install first.',
    );
    process.exitCode = 1;
    return;
  }

  const requested = selectEnvFile();
  const candidates = Array.from(
    new Set([
      path.resolve(projectRoot, requested),
      requested,
      path.resolve(projectRoot, '.env'),
      '.env',
    ]),
  );

  const resolved = candidates.find(candidate => fs.existsSync(candidate));
  let dotenv = {};
  let found = 0;
  let resolvedPath = '';

  if (resolved != null) {
    dotenv = parseDotEnv(fs.readFileSync(resolved, 'utf8'));
    found = 1;
    resolvedPath = resolved;
    if (requested !== '.env' && !candidates.slice(0, 2).includes(resolved)) {
      console.warn(
        `[ios-config] ENVFILE="${requested}" was not found; falling back to ${resolved}.`,
      );
    }
  } else {
    console.warn(
      '[ios-config] No .env file found (tried: ' +
        candidates.join(', ') +
        '). Config will be empty at runtime.',
    );
  }

  const entries = Object.entries(dotenv)
    .map(([key, value]) => `@"${key}":@"${value}"`)
    .join(',');

  const contents = `  #define DOT_ENV @{ ${entries} };
  #define RNC_DOT_ENV_FOUND ${found}
  #define RNC_DOT_ENV_PATH @"${resolvedPath.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, contents, 'utf8');
  console.log(
    `[ios-config] Wrote ${path.relative(projectRoot, outputPath)} ` +
      `(${Object.keys(dotenv).length} keys from ${resolvedPath || 'no .env'}).`,
  );
}

main();
