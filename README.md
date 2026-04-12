<p align="center">
    <img width="400" src="https://github.com/ArcherGu/fast-vite-electron/blob/main/logo.png" alt="logo">
</p>

# ⚡Vite + Electron & Doubleshot Template

This template is used to build vite + electron projects. Build with [Doubleshot](https://github.com/Doubleshotjs/doubleshot), crazy fast!

🎉 [Doubleshot](https://github.com/Doubleshotjs/doubleshot) is a whole new set of tools to help you quickly build and start a node backend or electron main process.

This template is based on a small framework [einf](https://github.com/ArcherGu/einf) that I wrote myself, which may not be complete, if you want to apply to production, you can use the templates with integrated nest.js:

- [Vue.js template](https://github.com/ArcherGu/fast-vite-nestjs-electron)
- [React template](https://github.com/ArcherGu/vite-react-nestjs-electron)
- [Svelte.js template](https://github.com/ArcherGu/vite-svelte-nestjs-electron)

## Features

- 🔨 [vite-plugin-doubleshot](https://github.com/archergu/doubleshot/tree/main/packages/plugin-vite#readme) to run/build electron main process.
  <br>

- 😎 Controllers/Services ipc communication, powered by Typescript [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).
  <br>

- ⚡ Rendering process is powered by [Vite](https://vite.io/).
  <br>

- ⏩ Quick start and build, powered by [tsdown](https://tsdown.dev/) and [electron-builder](https://www.electron.build/) integrated in [@doubleshot/builder](https://github.com/Doubleshotjs/doubleshot/tree/main/packages/builder)

## Motivation

In the past, I've been building desktop clients with [vue](https://v3.vuejs.org/) + [vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder), and they work very well. But as the project volume grows, webpack-based build patterns become slower and slower.

The advent of [vite](https://vitejs.dev/) and [tsdown](https://tsdown.dev/) greatly improved the development experience and kept the build pipeline lightning fast ⚡.

It took me a little time to extract this template and thank you for using it.

## How to use

- Click the [Use this template](https://github.com/ArcherGu/fast-vite-electron/generate) button (you must be logged in) or just clone this repo.
- In the project folder:

  ```bash
  # install dependencies
  pnpm install

  # run in developer mode
  pnpm dev

  # build
  pnpm build
  ```

## Note for PNPM

This project requires `pnpm` as the package manager. In order to use with `pnpm`, you'll need to adjust your `.npmrc` to use any one the following approaches in order for your dependencies to be bundled correctly (ref: [#6389](https://github.com/electron-userland/electron-builder/issues/6289#issuecomment-1042620422)):

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
