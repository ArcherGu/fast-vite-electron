import { beforeEach, expect, it, vi } from 'vitest'
import { BrowserWindow } from 'electron'
import { restoreOrCreateWindow } from '../main.window'

vi.mock('electron', () => {
  const bw = vi.fn();

  (bw as any).getAllWindows = vi.fn(() => bw.mock.instances)
  bw.prototype.loadURL = vi.fn()
  bw.prototype.on = vi.fn()
  bw.prototype.destroy = vi.fn()
  bw.prototype.isDestroyed = vi.fn()
  bw.prototype.isMinimized = vi.fn()
  bw.prototype.focus = vi.fn()
  bw.prototype.restore = vi.fn()
  bw.prototype.maximize = vi.fn()
  bw.prototype.removeMenu = vi.fn()

  return {
    BrowserWindow: bw,
    app: {
      isPackaged: true,
      getAppPath: vi.fn(() => 'path'),
    },
  }
})

vi.mock('../bootstrap', () => ({
  bootstrap: vi.fn(),
  destroy: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

it('should create new window', async () => {
  const { mock } = vi.mocked(BrowserWindow)
  expect(mock.instances).toHaveLength(0)

  await restoreOrCreateWindow()
  expect(mock.instances).toHaveLength(1)
  expect(mock.instances[0].loadURL).toHaveBeenCalledOnce()
  expect(mock.instances[0].loadURL).toHaveBeenCalledWith(expect.stringMatching(/index\.html$/))
})

it('should restore existing window', async () => {
  const { mock } = vi.mocked(BrowserWindow)

  // Create Window and minimize it
  await restoreOrCreateWindow()
  expect(mock.instances).toHaveLength(1)
  const appWindow = vi.mocked(mock.instances[0])
  appWindow.isMinimized.mockReturnValueOnce(true)

  await restoreOrCreateWindow()
  expect(mock.instances).toHaveLength(1)
  expect(appWindow.restore).toHaveBeenCalledOnce()
})

it('should create new window if previous was destroyed', async () => {
  const { mock } = vi.mocked(BrowserWindow)

  // Create Window and destroy it
  await restoreOrCreateWindow()
  expect(mock.instances).toHaveLength(1)
  const appWindow = vi.mocked(mock.instances[0])
  appWindow.isDestroyed.mockReturnValueOnce(true)

  await restoreOrCreateWindow()
  expect(mock.instances).toHaveLength(2)
})
