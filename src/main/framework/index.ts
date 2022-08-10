import { BrowserWindow, ipcMain } from 'electron'
export * from './decorators'

type Construct<T = any> = new (...args: Array<any>) => T
export type ControllerClass = Construct
export type InjectableClass = Construct

export interface WindowOpts {
  name: string
  win: BrowserWindow
}

export interface InjectableOpts {
  name: string
  inject: any
}

export interface Options {
  window: WindowOpts[] | (() => WindowOpts | Promise<WindowOpts>)[] | BrowserWindow | (() => BrowserWindow | Promise<BrowserWindow>)
  controllers: ControllerClass[]
  injects?: InjectableOpts[]
}

export async function init({ window, controllers, injects = [] }: Options) {
  const ExistInjectable = {}
  function factory<T>(constructClass: Construct<T>): T {
    const paramtypes = Reflect.getMetadata('design:paramtypes', constructClass)
    let providers = []
    if (paramtypes) {
      providers = paramtypes.map((provider: Construct<T> | any) => {
        const isCustom = Reflect.getMetadata('custom-inject', provider)
        if (isCustom) {
          const name = Reflect.getMetadata('name', provider)
          const injectInfo = injects.find(item => item.name === name)
          if (!injectInfo)
            throw new Error(`${name} is not provided to inject`)

          return injectInfo.inject
        }
        else {
          const { name } = provider
          const injectable = Reflect.getMetadata('injectable', provider)
          if (!injectable)
            throw new Error(`${name} is not injectable`)
          const item = ExistInjectable[name] || factory(provider)
          ExistInjectable[name] = item
          return item
        }
      })
    }

    // eslint-disable-next-line new-cap
    return new constructClass(...providers)
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
