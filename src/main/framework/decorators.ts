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
  return (_) => {
    // do nothing
  }
}

export function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata('injectable', true, target)
  }
}

export function Inject(name: string): ParameterDecorator {
  return (target, _, index) => {
    const param = Reflect.getMetadata('design:paramtypes', target)[index]
    Reflect.defineMetadata('custom-inject', true, param)
    Reflect.defineMetadata('name', name, param)
  }
}
