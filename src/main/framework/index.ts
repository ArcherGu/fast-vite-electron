import { BrowserWindow, ipcMain } from 'electron'
import { INJECTABLE, INJECT_NAME, INJECT_TYPE, IPC_INVOKE, IPC_ON, PARAMTYPES_METADATA } from './constants'
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
  // init windows
  let windows: WindowOpts[] = []
  if (Array.isArray(window)) {
    for (const win of window)
      windows.push(typeof win === 'function' ? (await win()) : win)
  }
  else {
    windows = [typeof window === 'function' ? ({ name: 'main', win: (await window()) }) : ({ name: 'main', win: window })]
  }

  const existInjectableClass = {}
  /**
   * factory controller/injectable
   */
  function factory<T>(constructClass: Construct<T>): T {
    const paramtypes: any[] = Reflect.getMetadata(PARAMTYPES_METADATA, constructClass)
    let providers = []
    if (paramtypes) {
      providers = paramtypes.map((provider: Construct<T> | any, index) => {
        const injectType = Reflect.getMetadata(INJECTABLE, provider)
        if (injectType === INJECT_TYPE.CLASS) {
          const { name } = provider
          const item = existInjectableClass[name] || factory(provider)
          existInjectableClass[name] = item
          return item
        }
        else if (injectType === INJECT_TYPE.CUSTOM) {
          const name = Reflect.getMetadata(INJECT_NAME, provider)
          const injectInfo = injects.find(item => item.name === name)
          if (!injectInfo)
            throw new Error(`${name} is not provided to inject`)

          return injectInfo.inject
        }
        else if (injectType === INJECT_TYPE.WINDOW) {
          const name = Reflect.getMetadata(INJECT_NAME, provider)
          const winOpt = windows.find(item => item.name === name)

          if (!winOpt)
            throw new Error(`${name} is not provided to inject`)

          return winOpt.win
        }
        else {
          throw new Error(`${constructClass.name}'s parameter [${index}] is not injectable`)
        }
      })
    }

    // eslint-disable-next-line new-cap
    return new constructClass(...providers)
  }

  // init controllers
  for (const ControllerClass of controllers) {
    const controller = factory(ControllerClass)
    const proto = ControllerClass.prototype
    const funcs = Object.getOwnPropertyNames(proto).filter(
      item => typeof controller[item] === 'function' && item !== 'constructor',
    )

    funcs.forEach((funcName) => {
      let event: string | null = null
      event = Reflect.getMetadata(IPC_INVOKE, proto, funcName)
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
        event = Reflect.getMetadata(IPC_ON, proto, funcName)
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
