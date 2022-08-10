import { Injectable } from '../framework'

@Injectable('MyService')
export class MyService {
  constructor() {
    // do nothing
  }

  public getDelayTime(): number {
    return 2
  }
}
