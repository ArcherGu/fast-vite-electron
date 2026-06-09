/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  directories: {
    output: 'dist/electron',
  },
  publish: null,
  npmRebuild: false,
  ...(process.env.CI
    ? {
        linux: {
          target: ['dir'],
        },
      }
    : {}),
  mac: {
    identity: null,
    notarize: false,
  },
  dmg: {
    sign: false,
  },
  files: [
    'dist/main/**/*',
    'dist/preload/**/*',
    'dist/render/**/*',
  ],
}

module.exports = config
