import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import HelloWorld from '../components/HelloWorld.vue'

vi.mock('../api', () => ({
  sendMsgToMainProcess: vi.fn(),
}))

vi.mock('../plugins/ipc', () => ({
  useIpc: vi.fn(() => ({
    on: vi.fn(),
  })),
}))

/**
 * @vitest-environment happy-dom
 */
it('helloWorld component', async () => {
  expect(HelloWorld).toBeTruthy()
  const wrapper = mount(HelloWorld)

  const msgInput = wrapper.get<HTMLInputElement>('input')

  const msg = 'msg from unit test'
  await msgInput.setValue(msg)
  expect(msgInput.element.value).toBe(msg)
})
