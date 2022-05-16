import { join } from 'path'
import { BrowserWindow, app } from 'electron'
import { bootstrap, destroy } from './bootstrap'

const isDev = !app.isPackaged

export async function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
      devTools: isDev,
    },
    autoHideMenuBar: !isDev,
  })

  win.maximize()

  await bootstrap(win.webContents)

  const URL = isDev
    ? process.env.DEV_SERVER_URL
    : `file://${join(app.getAppPath(), 'dist/render/index.html')}`

  win.loadURL(URL)

  if (isDev)
    win.webContents.openDevTools()

  else
    win.removeMenu()

  win.on('closed', () => {
    destroy()
    win.destroy()
  })

  return win
}

export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())

  if (window === undefined)
    window = await createWindow()

  if (window.isMinimized())
    window.restore()

  window.focus()
}
