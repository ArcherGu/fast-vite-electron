<p align="center">
    <img width="400" src="https://github.com/ArcherGu/fast-vite-electron/blob/main/logo.png" alt="logo">
</p>

# ⚡Vite + Electron & Esbuild Template

This template is used to build vite + electron projects.

**NOTE:** Main process is built with esbuild. After some modifications, it currently supports [`emitDecoratorMetadata`](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata).

## Motivation

In the past, I've been building desktop clients with [vue](https://v3.vuejs.org/) + [vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder), and they work very well. But as the project volume grows, webpack-based build patterns become slower and slower.

The advent of [vite](https://vitejs.dev/) and [esbuild](https://esbuild.github.io/) greatly improved the development experience and made me feel lightning fast ⚡.

 It took me a little time to extract this template and thank you for using it.

## How to use

- Click the [Use this template](https://github.com/ArcherGu/fast-vite-electron/generate) button (you must be logged in) or just clone this repo.
- In the project folder: 
  ```bash
  # install dependencies
  yarn # npm install

  # run in developer mode
  yarn dev # npm run dev

  # build
  yarn build # npm run build
  ```

## Note for PNPM

In order to use with `pnpm`, you'll need to adjust your `.npmrc` to use any one the following approaches in order for your dependencies to be bundled correctly (ref: [#6389](https://github.com/electron-userland/electron-builder/issues/6289#issuecomment-1042620422)):
```
node-linker=hoisted
```
```
public-hoist-pattern=*
```
```
shamefully-hoist=true
```

## Relative

My blog post:

- [极速 DX Vite + Electron + esbuild](https://archergu.me/posts/vite-electron-esbuild)
- [用装饰器给 Electron 提供一个基础 API 框架](https://archergu.me/posts/electron-decorators)
