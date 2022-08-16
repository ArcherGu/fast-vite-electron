import { Injectable } from 'einf'

@Injectable()
export class AppService {
  public getDelayTime(): number {
    return 2
  }
}
