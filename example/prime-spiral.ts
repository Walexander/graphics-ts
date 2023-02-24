/**
 * Adapted from https://github.com/purescript-contrib/purescript-drawing/blob/master/test/Main.purs
 */
import * as IO from '@effect/io/Effect'
import * as Context from '@effect/data/Context'
import { millis } from '@effect/data/Duration'
import { pipe } from '@fp-ts/core/Function'
import * as O from '@fp-ts/core/Option'

import * as Turtle2d from '../src/Turtle2d'
import * as DrawsTurtles from '../src/Drawable/Turtle2d'
import * as C from '../src/Canvas'
import * as Color from '../src/Color'
import * as Chunk from '@effect/data/Chunk'
import * as Stream from '@effect/stream/Stream'

const intsPlusPrimality = pipe(
  Stream.range(2, Number.MAX_SAFE_INTEGER),
  Stream.mapAccum(Chunk.empty<number>(), sieveChunk),
  Stream.flatten
)
function sieveChunk(primes: Chunk.Chunk<number>, candidate: number) {
  const isPrime = candidate > 1 && Chunk.every(primes, prime => candidate % prime !== 0)
  const value = [candidate, isPrime] as const
  return [isPrime ? primes.append(candidate) : primes, Stream.succeed(value)] as const
}

function main() {
  return pipe(
    Stream.fromEffect(initialize),
    Stream.merge(spiralMaker(21_950)),
    Stream.runLast,
    IO.timed,
    IO.tap(([duration, state]) => pipe(
      state,
      O.flatMap(O.fromNullable),
      IO.fromOption,
      IO.zipLeft(C.setFillStyle('black')),
      IO.tap(({ position: [x, y] }) => C.fillPath(C.arc(x, y, 10, 0, Math.PI * 2))),
      IO.tap(_ =>
        IO.log(`duration: ${duration.millis}ms : ${_.position}}`),
      )
    )),
    C.withContext,
    IO.provideSomeLayer(Turtle2d.fromOrigin),
    IO.provideSomeLayer(DrawsTurtles.Live),
    IO.provideSomeLayer(liveLastPrime),
    IO.provideSomeLayer(liveLatest),
    IO.provideSomeLayer(liveFormatter),
    C.renderTo('canvas4'),
    IO.runPromise
  )
}
const initialize = pipe(
  IO.unit(),
  IO.zipRight(IO.log(`starting prime spiral`)),
  IO.zipRight(C.dimensions),
  IO.tap(({ width, height }) => C.translate(width / 2, height / 2)),
  IO.as(void null)
)
type CellParams = {
  num: number
  isPrime: boolean
  nextSquare: number
}
function spiralMaker(total: number) {
  return pipe(
    intsPlusPrimality,
    Stream.mapAccum(3, (lastOdd, [num, isPrime]) => [
      num == lastOdd ** 2 ? lastOdd + 2 : lastOdd,
      <CellParams>{
        nextSquare: lastOdd ** 2,
        isPrime,
        num
      }
    ]),
    Stream.tap(({ num }) =>
      num > 1e3 && num % 1e2 == 0 || num < 1e3 && num % 2e1 == 0
        ? IO.delay(IO.unit(), millis(16)) : IO.unit()
    ),
    Stream.tap(updateText(total)),
    Stream.map(turtleDraw),
    Stream.mapEffect(fn => IO.serviceWithEffect(Turtle2d.Tag, fn)),
    Stream.take(total),
  )
}

function turtleDraw({ num, isPrime, nextSquare }: CellParams) {
  type R = CanvasRenderingContext2D | Turtle2d.Turtle2d
  return (turtle: Turtle2d.Turtle2d) =>
    pipe(
      IO.collectAllDiscard<R, never, void>([
        C.setLineWidth(isPrime ? 3 : 1),
        C.setStrokeStyle(isPrime ? 'transparent' : Color.toCss(Color.hsla(0, 0, 0, 0.25)))
      ]),
      IO.zipRight(turtle.drawForward(2)),
      IO.tap(({ position: [x, y] }) => isPrime ?
        C.setFillStyle(Color.toCss(Color.hsla(
          Math.atan2(y, x) * 180 / Math.PI,
          0.5, 0.5, 1)
        )) : IO.unit(),
      ),
      IO.zipRight(turtle.turn(turnAmount(num, Math.sqrt(nextSquare)))),
      IO.tap(({ position }) =>
        isPrime ? C.fillPath(C.arc(position[0], position[1], 2, 0, Math.PI * 2)) : IO.unit()
      ),
      IO.zipRight(turtle.drawForward(2))
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

const LastPrime = Context.Tag<HTMLElement>()
const liveLastPrime = IO.toLayer(fromId('prime'), LastPrime)
const LatestNumber = Context.Tag<HTMLElement>()
const liveLatest = IO.toLayer(fromId('latest'), LatestNumber)
const Formatter = Context.Tag<Intl.NumberFormat>()
const liveFormatter = IO.toLayer(IO.succeed(new Intl.NumberFormat()), Formatter)

function updateText(total: number) {
  return ({ num, isPrime }: CellParams) =>
    IO.serviceWithEffect(Formatter, formatter =>
      !isPrime
        ? (num > 1e3 && num % 1e2 == 0) || num <= 1e3 && num % 10 == 0 || num == total
          ? IO.serviceWithEffect(LatestNumber, setText(formatter.format(num)))
          : IO.unit()
        : IO.serviceWithEffect(LastPrime, setText(formatter.format(num)))
    )
}

function fromId(id:string): IO.Effect<never, never, HTMLElement> {
  return pipe(
    IO.sync(() => O.fromNullable(document.getElementById(id))),
    IO.flatMap(IO.fromOption),
    IO.orDie,
  )
}

function setText(text: string) {
  return (el: HTMLElement) => IO.sync(() => {
    el.innerText = text
  })
}
void main()
