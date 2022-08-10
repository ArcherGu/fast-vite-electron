import { BrowserWindow, ipcMain } from 'electron'
export * from './decorators'

type Controller<T = any> = new (...args: Array<any>) => T

export interface WindowOpts {
  name: string
  win: BrowserWindow
}

export interface Options {
  window: WindowOpts[] | (() => WindowOpts | Promise<WindowOpts>)[] | BrowserWindow | (() => BrowserWindow | Promise<BrowserWindow>)
  controllers: Controller[]
}

export async function init({ window, controllers }: Options) {
  const ExistInjectable = {}
  function factory<T>(controller: Controller<T>): T {
    const paramtypes = Reflect.getMetadata('design:paramtypes', controller)
    const providers = paramtypes.map((provider: Controller<T>) => {
      const name = Reflect.getMetadata('name', provider)
      const item = ExistInjectable[name] || factory(provider)
      ExistInjectable[name] = item
      return item
    })
    // eslint-disable-next-line new-cap
    return new controller(...providers)
  }

  let windows: WindowOpts[] = []
  if (Array.isArray(window)) {
    for (const win of window)
      windows.push(typeof win === 'function' ? (await win()) : win)
  }
  else {
    windows = [typeof window === 'function' ? ({ name: 'main', win: (await window()) }) : ({ name: 'main', win: window })]
  }

  for (const ControllerClass of controllers) {
    const controller = factory(ControllerClass)
    const proto = ControllerClass.prototype
    const funcs = Object.getOwnPropertyNames(proto).filter(
      item => typeof controller[item] === 'function' && item !== 'constructor',
    )

    funcs.forEach((funcName) => {
      let event: string | null = null
      event = Reflect.getMetadata('ipc-invoke', proto, funcName)
      if (event) {
        ipcMain.handle(event, async (e, ...args) => {
          try {
            // eslint-disable-next-line no-useless-call
            const result = await controller[funcName].call(controller, ...args)

            return {
              data: result,
            }
          }
          catch (error) {
            // eslint-disable-next-line no-console
            console.log(error)
            return {
              error,
            }
          }
        })
      }
      else {
        event = Reflect.getMetadata('ipc-on', proto, funcName)
        if (!event)
          return

        const func = controller[funcName]
        const { webContents } = windows[0].win
        controller[funcName] = async (...args: any[]) => {
          const result = await func.call(controller, ...args)
          webContents.send(event, result)
          return result
        }
      }
    })
  }
}
