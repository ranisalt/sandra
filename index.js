const EventEmitter = require('events')
const eachSeries = require('async/eachSeries')
const whilst = require('async/whilst')
const {now} = require('microtime')

class Benchmark extends EventEmitter {
  constructor (title, func, ...args) {
    super()
    this.title = title
    this.func = func
    this.args = args
  }

  run (timeout) {
    return new Promise((resolve, reject) => {
      const {args, func} = this
      const elapsed = []
      let running = true

      whilst(() => running, callback => {
        const start = now()
        func(...args).then(() => {
          elapsed.push(now() - start)
          callback()
        })
      }, err => {
        if (err) {
          reject(err)
        }
        resolve(elapsed)
      })

      setTimeout(() => {
        running = false
      }, timeout)
    })
  }
}

const avg = arr => arr.reduce((sum, value) => sum + value, 0) / arr.length

class Result {
  constructor (title, args) {
    this.title = title
    Object.assign(this, args)
  }

  toString () {
    const ops = `${(1000000 / this.average).toFixed(2)} ops/sec`
    const dev = `±${(this.deviation / this.average).toFixed(2)}%`
    const runs = `${this.runs} runs sampled`
    return `${this.title} x ${ops} ${dev} (${runs})`
  }
}

class Suite extends EventEmitter {
  constructor (title) {
    super()
    this.title = title
    this.benchmarks = []
  }

  push (name, fn, ...args) {
    if (typeof name === 'string') {
      name = new Benchmark(name, fn, ...args)
    }
    this.benchmarks.push(name)
    return this
  }

  run (options) {
    return new Promise((resolve, reject) => {
      options = Object.assign({timeout: 1e3}, options)

      this.emit('start')
      eachSeries(this.benchmarks, (benchmark, callback) => {
        benchmark.run(options.timeout).then(stats => {
          const average = avg(stats)
          const deviation = Math.sqrt(avg(stats.map(value => {
            const diff = average - value
            return diff * diff
          })))

          this.emit('cycle', new Result(`${this.title}#${benchmark.title}`, {
            average, deviation, runs: stats.length
          }))

          callback()
        }).catch(callback)
      }, err => {
        if (err) {
          reject(err)
        }
        this.emit('complete')
        resolve()
      })
    })
  }
}

module.exports = {Benchmark, Suite}
