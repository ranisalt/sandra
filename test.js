import test from 'ava'
import {Benchmark} from './src/'

const timeout = 10

// fuck this is ugly but works as a charm
const sleep = delay => () => new Promise(resolve => setTimeout(resolve, delay))

test('run the function for given time', async t => {
  const bench = new Benchmark('test', sleep(timeout * 2))
  const stats = await bench.run(timeout)
  t.is(stats.length, 1)
  t.true(stats[0] >= (timeout * 2000))
})

test('call the passed function', async t => {
  let called = false
  const bench = new Benchmark('test', async sleep => {
    called = true
    await sleep()
  }, sleep(timeout))
  await bench.run(timeout)
  t.true(called)
})

test('return elapsed time array', async t => {
  const bench = new Benchmark('test', sleep(1))
  const stats = await bench.run(timeout)
  t.true(Array.isArray(stats))
  t.true(typeof stats[0] === 'number')
})

test('pass args to called function', async t => {
  let called = 0
  const bench = new Benchmark('test', async (num, sleep) => {
    called = num
    await sleep()
  }, 42, sleep(timeout))
  await bench.run(timeout)
  t.is(called, 42)
})
