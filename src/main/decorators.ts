export function IpcInvoke(event: string): MethodDecorator {
  return (target: any, propertyName: string) => {
    Reflect.defineMetadata('ipc-invoke', event, target, propertyName)
  }
}

export function IpcOn(event: string): MethodDecorator {
  return (target: any, propertyName: string) => {
    Reflect.defineMetadata('ipc-on', event, target, propertyName)
  }
}

export function Controller(): ClassDecorator {
  return (_: object) => {
    // do nothing
  }
}

export function Injectable(name: string): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata('name', name, target)
  }
}
