import { Controller, IpcInvoke, IpcOn } from '../decorators'
import { MyService } from '../Services/MyService'

@Controller()
export class MyController {
  constructor(
    private myService: MyService,
  ) {

  }

  @IpcOn('reply-msg')
  public replyMsg(msg: string) {
    return `${this.myService.getDelayTime()} seconds later, the main process replies to your message: ${msg}`
  }

  @IpcInvoke('send-msg')
  public async handleSendMsg(msg: string): Promise<string> {
    setTimeout(() => {
      this.replyMsg(msg)
    }, this.myService.getDelayTime() * 1000)

    return `The main process received your message: ${msg}`
  }
}
