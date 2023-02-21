/**
 * Adapted from https://github.com/purescript-contrib/purescript-drawing/blob/master/test/Main.purs
 */
import * as IO from '@effect/io/Effect'
import { pipe } from '@fp-ts/core/Function'

import * as Turtle2d from '../src/Turtle2d'
import * as DrawsTurtles from '../src/Drawable/Turtle2d'
import * as C from '../src/Canvas'
import * as Color from '../src/Color'
import * as Chunk from '@effect/data/Chunk'
import * as Stream from '@effect/stream/Stream'

const intsPlusPrimality = pipe(
  Stream.range(1, Number.MAX_SAFE_INTEGER),
  Stream.mapAccum(Chunk.empty<number>(), sieveChunk),
  Stream.flatten
)
function sieveChunk(primes: Chunk.Chunk<number>, candidate: number) {
  const isPrime = candidate > 1 && Chunk.every(primes, (prime) => candidate % prime !== 0);
  const value = [candidate, isPrime] as const
  return [ isPrime ? primes.append(candidate) : primes,
    Stream.succeed(value)
  ] as const
}

export const main = pipe(
  Stream.fromEffect(pipe(
    IO.unit(),
    IO.zipRight(IO.log(`starting prime spiral`)),
    IO.zipRight(C.dimensions),
    IO.tap(({width, height}) => C.translate(width / 2, height / 2)),
    IO.zipLeft(C.rotate(Math.PI)),
    IO.zip(C.scale(1.0, 1.0)),
    IO.zip(C.setLineJoin('round'))
  )),
  Stream.merge(spiralMaker(100_00)),
  Stream.runDrain,
  IO.timed,
  IO.tap(([duration]) => IO.log(`duration: ${duration.millis}ms`)),
  IO.provideSomeLayer(Turtle2d.fromOrigin),
  IO.provideSomeLayer(DrawsTurtles.Live),
  C.renderTo('canvas4'),
  IO.runPromise
)
function spiralMaker(total: number) {
  type CellParams = {
    num: number
    isPrime: boolean
    nextSquare: number
  }
  return pipe(
    intsPlusPrimality,
    Stream.mapAccum(1, (lastOdd, [num, isPrime]) => [
      num == lastOdd ** 2 ? lastOdd + 2 : lastOdd,
      <CellParams>{
        nextSquare: lastOdd ** 2,
        isPrime,
        num
      }
    ]),
    Stream.tap(({ num, isPrime, nextSquare }) =>
      IO.serviceWithEffect(Turtle2d.Tag, turtle =>
        pipe(
          IO.unit(),
          IO.zipRight(C.setLineWidth(isPrime ? 5 : 1)),
          IO.zipRight(
            isPrime
              ? C.setStrokeStyle('red')
              : C.setStrokeStyle(Color.toCss(Color.hsla(0, 0, 0, 0.2)))
          ),
          IO.zipRight(turtle.drawForward(3)),
          IO.zipRight(turtle.turn(turnAmount(num, Math.sqrt(nextSquare)))),
          IO.zipRight(turtle.drawForward(3))
        )
      )
    ),
    Stream.take(total),
  )
  function turnAmount(candidate: number, oddRoot: number) {
    const lastOdd = oddRoot - 2
    const nextSq = oddRoot ** 2
    const stride = oddRoot - 1
    const index = candidate - lastOdd ** 2
    const _r =
      candidate == 2 ||
        lastOdd ** 2 + 1 == candidate ||
        (candidate != nextSq && index % stride == 0)
    return _r ? Math.PI / 2 : 0
  }
}
