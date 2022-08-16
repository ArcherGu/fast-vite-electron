import { BrowserWindow, ipcMain } from 'electron'
import { DEFAULT_WIN_NAME, INJECTABLE, INJECT_NAME, INJECT_TYPE, IPC_INVOKE, IPC_ON, IPC_WIN_NAME, PARAMTYPES_METADATA } from './constants'
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
    windows = [typeof window === 'function' ? ({ name: DEFAULT_WIN_NAME, win: (await window()) }) : ({ name: DEFAULT_WIN_NAME, win: window })]
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
        ipcMain.handle(event, async (_, ...args) => {
          try {
            // eslint-disable-next-line prefer-spread
            const result = await controller[funcName].apply(controller, args)

            return {
              data: result,
            }
          }
          catch (error) {
            // eslint-disable-next-line no-console
            console.log(error)
            return {
              data: undefined,
              error,
            }
          }
        })
      }
      else {
        event = Reflect.getMetadata(IPC_ON, proto, funcName)
        if (!event)
          return

        const winName = Reflect.getMetadata(IPC_WIN_NAME, proto, funcName)
        const winInfo = windows.find(item => item.name === winName)
        if (winInfo) {
          const { webContents } = winInfo.win
          const func = controller[funcName]

          controller[funcName] = async (...args: any[]) => {
            const result = await func.apply(controller, args)
            webContents.send(event, result)
            return result
          }
        }
        else {
          // eslint-disable-next-line no-console
          console.log(`\x1B[33m WARNING: Can not find window [${winName}] to emit event [${event}] \x1B[0m`)
        }
      }
    })
  }
}
