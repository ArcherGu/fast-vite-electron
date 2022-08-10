import 'reflect-metadata'
import { app } from 'electron'
import { MyController } from './Controllers'
import { init } from './framework'
import { createWindow } from './mainWindow'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

async function electronAppInit() {
  const isDev = !app.isPackaged
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
      app.exit()
  })

  if (isDev) {
    if (process.platform === 'win32') {
      process.on('message', (data) => {
        if (data === 'graceful-exit')
          app.exit()
      })
    }
    else {
      process.on('SIGTERM', () => {
        app.exit()
      })
    }
  }

  await app.whenReady()
}

async function bootstrap() {
  try {
    await electronAppInit()

    await init({
      window: createWindow,
      controllers: [MyController],
    })
  }
  catch (error) {
    console.error(error)
    app.quit()
  }
}

bootstrap()
