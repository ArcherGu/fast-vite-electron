import { Injectable } from './framework'

@Injectable()
export class AppService {
  public getDelayTime(): number {
    return 2
  }
}
