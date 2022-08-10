import { Injectable } from './framework'

@Injectable('AppService')
export class AppService {
  constructor() {
    // do nothing
  }

  public getDelayTime(): number {
    return 2
  }
}
