import type { IpcResponse } from '@common/types'
import { getCurrentInstance, onUnmounted, toRaw } from 'vue'
const { ipcRenderer } = window

interface IpcInstance {
  send: <T = any>(target: string, ...args: any[]) => Promise<IpcResponse<T>>
  on: (event: string, callback: (...args: any[]) => void) => void
}

export const ipcInstance: IpcInstance = {
  send: async <T = any>(target, ...args) => {
    const payloads: any[] = args.map(e => toRaw(e))
    const response: IpcResponse<T> = await ipcRenderer.invoke(target.toString(), ...payloads)
    /* eslint-disable-next-line no-useless-call */
    if (response.hasOwnProperty.call(response, 'error'))
      throw response

    return response
  },
  on: (event, callback) => {
    ipcRenderer.on(event.toString(), (e, ...args) => {
      callback(...args)
    })

    // Use tryOnUnmounted if use @vueuse https://vueuse.org/shared/tryOnUnmounted/
    if (getCurrentInstance()) {
      onUnmounted(() => {
        ipcRenderer.removeAllListeners(event.toString())
      })
    }
  },
}

export function useIpc() {
  return ipcInstance
}
