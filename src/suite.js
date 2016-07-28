import EventEmitter from 'events'
import Benchmark from './benchmark'

const avg = arr => arr.reduce((sum, value) => sum + value, 0) / arr.length

class Result {
  constructor(title, args) {
    this.title = title
    Object.assign(this, args)
  }

  toString() {
    const ops = `${(1000000 / this.average).toFixed(2)} ops/sec`
    const dev = `±${(this.deviation / this.average).toFixed(2)}%`
    const runs = `${this.runs} runs sampled`
    return `${this.title} x ${ops} ${dev} (${runs})`
  }
}

export default class Suite extends EventEmitter {
  constructor(title) {
    super()
    this.title = title
    this.benchmarks = []
  }

  push(name, fn, ...args) {
    if (typeof name === 'string') {
      name = new Benchmark(name, fn, ...args)
    }
    this.benchmarks.push(name)
    return this
  }

  async run(options) {
    options = Object.assign({timeout: 1e3}, options)

    this.emit('start')
    for (const benchmark of this.benchmarks) {
      try {
        const stats = await benchmark.run(options.timeout)

        const average = avg(stats)
        const deviation = Math.sqrt(avg(stats.map(value => {
          const diff = average - value
          return diff * diff
        })))

        this.emit('cycle', new Result(`${this.title}#${benchmark.title}`, {
          average, deviation, runs: stats.length
        }))
      } catch (err) {
        this.emit('error', err)
      }
    }
    this.emit('complete')
  }
}
