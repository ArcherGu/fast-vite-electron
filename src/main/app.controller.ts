import { Controller, IpcHandle, IpcSend } from 'einf'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
  ) { }

  @IpcSend('reply-msg')
  public replyMsg(msg: string) {
    return msg
  }

  @IpcHandle('msg')
  public handleSendMsg(msg: string) {
    this.replyMsg('this is msg from webContents.send')

    return `The main process received your message: ${msg} at time: ${this.appService.getTime()}`
  }
}
