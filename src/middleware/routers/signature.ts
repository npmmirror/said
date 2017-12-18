import { ApplicationRequestHandler, Express } from 'express-serve-static-core'


/**
 * 这里大概实现一个简版的 filter，本质上就是创建中间件
 * 用户自己生成装饰器，token 表示 url 前缀，然后在使用这些装饰器的时候自动补上前缀，从而导致命中中间件
 */


/**
 * 所有 filters，属性名是动态生成的 symbolKey，值是对应的方法
 */
export const allSignature: object = {}

export class Filter {
  public token: string
  public use: ApplicationRequestHandler<Express>
  constructor(token: string, use: ApplicationRequestHandler<Express>) {
    this.token = token
    this.use = use
  }
}

/**
 * 给 filter 签名生成自己的装饰器
 * @param filter
 */
export const signatureWithOption = <T>(
  token: string,
  use?: ApplicationRequestHandler<Express>) => {
  const symbolKey = Symbol()
  allSignature[symbolKey] = new Filter(token, use)
  return (option: T) => {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
      Reflect.defineMetadata(symbolKey, option, target, propertyKey)
    }
  }
}

/**
 * 给 filter 签名生成自己的装饰器
 * @param filter
 */
export const signature = (
  token: string,
  defaultValue: any,
  use?: ApplicationRequestHandler<Express>) => {
  const symbolKey = Symbol()
  allSignature[symbolKey] = { token, use }
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
    Reflect.defineMetadata(symbolKey, defaultValue, target, propertyKey)
  }
}
