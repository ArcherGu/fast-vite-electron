import { Controller, IpcHandle, IpcSend } from 'einf'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
  ) { }

  @IpcSend('reply-msg')
  public replyMsg(msg: string) {
    return `${this.appService.getDelayTime()} seconds later, the main process replies to your message: ${msg}`
  }

  @IpcHandle('send-msg')
  public async handleSendMsg(msg: string): Promise<string> {
    setTimeout(() => {
      this.replyMsg(msg)
    }, this.appService.getDelayTime() * 1000)

    return `The main process received your message: ${msg}`
  }
}
