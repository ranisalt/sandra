import test from 'ava'
import {Benchmark} from './src/'

const noop = async () => {}
const timeout = 1

test('calls setup', async t => {
  t.plan(1)

  const bench = new Benchmark(noop, {
    setup: () => {
      t.pass()
    }, timeout
  })
  await bench.run()
})

test('calls teardown', async t => {
  const bench = new Benchmark(noop, {
    teardown: () => {
      t.pass()
    }, timeout
  })
  await bench.run()
})
