import { app } from 'electron'
import { createEinf } from 'einf'
import { AppController } from './app.controller'
import { createWindow } from './main.window'

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
}

async function bootstrap() {
  try {
    await electronAppInit()

    await createEinf({
      window: createWindow,
      controllers: [AppController],
      injects: [{
        name: 'IS_DEV',
        inject: !app.isPackaged,
      }],
    })
  }
  catch (error) {
    console.error(error)
    app.quit()
  }
}

bootstrap()
