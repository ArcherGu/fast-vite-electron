import { Injectable } from 'einf'

@Injectable()
export class AppService {
  public getTime(): number {
    return new Date().getTime()
  }
}
