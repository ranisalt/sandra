import EventEmitter from 'events'
import microtime from 'microtime'

export default class Benchmark extends EventEmitter {
  constructor(title, func, ...args) {
    super()
    this.title = title
    this.func = func
    this.args = args
  }

  async run(timeout) {
    const elapsed = []
    let running = true

    setTimeout(() => {
      running = false
    }, timeout)

    while (running) {
      const start = microtime.now()
      await this.func(...this.args)
      elapsed.push(microtime.now() - start)
    }

    return elapsed
  }
}
