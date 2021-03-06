# sandra

[![Greenkeeper badge](https://badges.greenkeeper.io/ranisalt/sandra.svg)](https://greenkeeper.io/)
[![NPM package][npm-image]][npm-url] [![Build status][travis-image]][travis-url] [![Coverage status][coverage-image]][coverage-url] [![Code Quality][codequality-image]][codequality-url] [![Dependencies][david-dm-image]][david-dm-url]

Sandra is a simple, promise-only, low overhead benchmarking library for ES2015.
It only contains benchmark and suite classes, both of which have a single
method `run`.

The name refers to [a popular Brazilian song](https://youtu.be/xL6ZHzTvm3g) by
Sidney Magal.

# API
As aforementioned, you have two classes at your disposal:

```js
import {Benchmark, Suite} from 'sandra'

(async () => {
  // basic operation
  const bench1 = new Benchmark('test', async () => {
    await longRunningOp()
  })

  // you can pass arguments to the benchmarked function
  const bench2 = new Benchmark('universe', async answer => {
    await longRunningOp(answer)
  }, 42)

  // don't forget you can instead refer to the function. avoid extra calls!
  const bench3 = new Benchmark('another test', longRunningOp, 42)

  // run a benchmark directly specifying the timeout to run (in ms)
  const result = await bench1.run(2000)
  // result contains an array of elapsed times, you do the maths
  console.log(result)

  // you can create a suite to run multiple benchmarks
  const suite = new Suite('nice suite')
  suite.push(bench2)
  suite.push(bench3)

  // it's possible to pass benchmark arguments to .push(), std::forward-like
  suite.push('nice one', longRunningOp, 42)

  // hook a callback to the 'cycle' event to get the results:
  suite.on('cycle', event => {
    // event contains 'average', 'deviation' and 'runs' fields too
    console.log(event.toString())
  })
  // there's also 'start', 'error' and 'complete' events

  // to run, call .run() passing an option object (currently, only timeout)
  await suite.run()
})()
```

You are ready to rock!

# Example
You can check [node-argon2 benchmarks](https://github.com/ranisalt/node-argon2/blob/d138f7d33955c571ee5c5eb7d4b81032be0f05fd/benchmark.js)
for a real example on how to use.

# License
Work licensed under the [MIT License](LICENSE).

[npm-image]: https://img.shields.io/npm/v/sandra.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/sandra
[travis-image]: https://img.shields.io/travis/ranisalt/sandra/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/ranisalt/sandra
[coverage-image]: https://img.shields.io/coveralls/ranisalt/sandra/master.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/ranisalt/sandra
[codequality-image]: https://img.shields.io/codacy/badc13b2129948a1bf812700636c4f3a/master.svg?style=flat-square
[codequality-url]: https://www.codacy.com/app/ranisalt/sandra
[david-dm-image]: https://img.shields.io/david/ranisalt/sandra.svg?style=flat-square
[david-dm-url]: https://david-dm.org/ranisalt/sandra
