/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
    npmRebuild: false,
    buildDependenciesFromSource: true,
    electronDownload: {
        mirror: 'https://npm.taobao.org/mirrors/electron/'
    },
    files: [
        "node_modules",
        "dist/main/**",
        "dist/render/**"
    ],
    nsis: {
        oneClick: false,
        allowElevation: true,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true
    },
};

module.exports = config;
