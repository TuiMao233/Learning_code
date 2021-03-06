/*
 * @Author: 毛先生
 * @Date: 2020-08-01 17:19:10
 * @LastEditTime: 2020-12-19 16:45:58
 * @LastEditors: Mr.Mao
 * @Description: 监视者模块
 * @傻瓜都能写出计算机能理解的程序。优秀的程序员写出的是人类能读懂的代码。
 */
class Observe {
  type: string;
  id: string;
  constructor(type: string, execute: (message: string) => any) {
    this.type = type
    this.id = this.Guid()
    if (typeof execute == 'function') {
      this.execute = execute
    }
  }
  private Guid(): string {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  execute(message: string) {
    console.log(`id: ${this.id}, value: ${message}`)
  }
}

export default class Watcher {
  /** 订阅者对象集合 */
  private observes: Record<string, Array<Observe>>;
  /** 消息对象结合 */
  private messages: Record<string, any>;
  /** 是否开启调试模式 */
  private debugging: Boolean;
  constructor(config = { debugging: false }) {
    this.observes = {}
    this.messages = {}
    this.debugging = config.debugging
  }
  /** 发布消息 */
  public publish(type: string, value: any) {
    if (this.debugging) {
      console.log(`观察者发布消息, 共有${this.observes[type] && this.observes[type].length || 0}个订阅者接收消息 ↓`)
      console.log(`消息名称为: `, type, '消息为: ', value)
    }
    // 如果该类型订阅者不存在, 不进行逻辑
    if (!Array.isArray(this.observes[type])) { return; }
    this.observes[type].forEach(_observe => _observe.execute(value))
  }
  /** 订阅消息, 返回订阅者 */
  public subscribe(type: string, execute: (messsage: any) => void): Observe {
    const _observe = new Observe(type, execute)
    // 添加到订阅者列表中
    if (this.observes[type]) {
      this.observes[type].push(_observe)
    } else {
      this.observes[type] = [_observe]
    }
    if (this.debugging) {
      console.log(`订阅者订阅消息, 消息名称为: `, type, '订阅者ID: ', _observe.id)
    }
    return _observe
  }
  /** 取消订阅 */
  public unsubscribe(_observe: Observe) {
    if (this.debugging) {
      console.log('观察者取消该订阅者: ', _observe.id)
    }
    if (!Array.isArray(this.observes[_observe.type])) { return; }
    for (let i = 0; i < this.observes[_observe.type].length; i++) {
      if (this.observes[_observe.type][i].id === _observe.id) {
        this.observes[_observe.type].splice(i, 1)
        // 如果该类型订阅者数组为空，删除数组和消息
        if (!this.observes[_observe.type].length) {
          delete this.observes[_observe.type]
          delete this.messages[_observe.type]
        }
        break;
      }
    }
  }
}

// 创建观察者实例, 开启调试模式
const watcher = new Watcher({ debugging: true })

// 创建多个订阅者
const observe_1 = watcher.subscribe('user_info', user_info => { })
const observe_2 = watcher.subscribe('user_info', user_info => { })
const observe_3 = watcher.subscribe('user_info', user_info => { })
console.log('----------------分割线----------------')

// 发布消息
watcher.publish('user_info', { name: '毛先生', age: 18 })

console.log('----------------分割线----------------')

// 取消一个订阅
watcher.unsubscribe(observe_2)

console.log('----------------分割线----------------')

// 发布新的消息
watcher.publish('user_info', { name: '鄧脂龍', age: 80 })