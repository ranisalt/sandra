const _assert = require('assert')
const {Benchmark} = require('./')

const timeout = 10

// needed +1 to fix skewed timer loop
const sleep = delay => () => new Promise(resolve => setTimeout(resolve, delay + 1))

describe('Benchmark', () => {
  const assert = _assert.strict || _assert

  it('run the function for given time', () => {
    const bench = new Benchmark('it', sleep(timeout * 2))
    return bench.run(timeout).then(stats => {
      assert.equal(1, stats.length)
      assert.ok(stats[0] >= (timeout * 2000))
    })
  })

  it('call the passed function', () => {
    let called = false
    const bench = new Benchmark('it', async sleep => {
      called = true
      await sleep()
    }, sleep(timeout))
    return bench.run(timeout).then(() => {
      assert.ok(called)
    })
  })

  it('return elapsed time array', () => {
    const bench = new Benchmark('it', sleep(1))
    return bench.run(timeout).then(stats => {
      assert.ok(Array.isArray(stats))
      assert.ok(typeof stats[0] === 'number')
    })
  })

  it('pass args to called function', () => {
    let called = 0
    const bench = new Benchmark('it', async (num, sleep) => {
      called = num
      await sleep()
    }, 42, sleep(timeout))
    return bench.run(timeout).then(() => {
      assert.equal(42, called)
    })
  })
})
