import type { ElectronApplication } from 'playwright'
import { _electron as electron } from 'playwright'
import { afterAll, beforeAll, expect, it } from 'vitest'

let electronApp: ElectronApplication

beforeAll(async () => {
  electronApp = await electron.launch({
    args: ['./dist/main/index.js'],
    executablePath: './dist/electron/win-unpacked/fast-vite-electron.exe',
  })
})

afterAll(async () => {
  await electronApp.close()
})

it('main window state', async () => {
  const windowState: { isVisible: boolean, isDevToolsOpened: boolean, isCrashed: boolean }
        = await electronApp.evaluate(({ BrowserWindow }) => {
          const mainWindow = BrowserWindow.getAllWindows()[0]

          const getState = () => ({
            isVisible: mainWindow.isVisible(),
            isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
            isCrashed: mainWindow.webContents.isCrashed(),
          })

          return new Promise((resolve) => {
            if (mainWindow.isVisible())
              resolve(getState())
            else
              mainWindow.once('ready-to-show', () => setTimeout(() => resolve(getState()), 0))
          })
        })

  expect(windowState.isCrashed, 'App was crashed').toBeFalsy()
  expect(windowState.isVisible, 'Main window was not visible').toBeTruthy()
  expect(windowState.isDevToolsOpened, 'DevTools was opened').toBeFalsy()
})
