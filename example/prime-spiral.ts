import * as IO from '@effect/io/Effect'
import * as Context from '@effect/data/Context'
import { millis } from '@effect/data/Duration'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'

import * as Turtle2d from '../src/Turtle2d'
import * as DrawsTurtles from '../src/Drawable/Turtle2d'
import * as C from '../src/Canvas'
import * as Shape from '../src/Shape'
import * as D from '../src/Drawing'
import * as Color from '../src/Color'
import * as Chunk from '@effect/data/Chunk'
import * as Stream from '@effect/stream/Stream'

import { toggleButton, RestartButton, liveRestartButton, loopCircle } from './utils'

export function main() {
  return IO.runPromise(primeSpiral(771))
}
export const spinIt =  pipe(
  IO.unit(),
  IO.zipRight(C.dimensions),
  IO.flatMap(({ width, height }) =>
    pipe(
      IO.unit(),
      IO.zipRight(C.getImageData(0, 0, width, height)),
      IO.flatMap(imageData => IO.tryPromise(() => createImageBitmap(imageData))),
      IO.map(_ => pipe(
        D.image(_, Shape.point(width / -2, height / -2)),
      )),
      IO.tap(drawing =>
        loopCircle(angle =>
          C.withContext(
            pipe(
              C.clearRect(0, 0, width, height),
              IO.zipRight(C.translate(width / 2, height / 2)),
              IO.zipRight(C.rotate(-angle / 4)),
              IO.zipRight(D.render(drawing)),
              IO.zipRight(IO.delay(IO.unit(), millis(16)))
            )
          )
        )
      )
    )
  )
)

const initialize = pipe(
  IO.unit(),
  IO.zipRight(C.dimensions),
  IO.tap(({ width, height }) => pipe(
    IO.unit(),
    IO.zipRight(C.clearRect(0, 0, width, height)),
    IO.zipRight(C.translate(width / 2, height / 2)),
  )),
  IO.zipRight(C.scale(3.5, 3.5)),
  IO.zipRight(IO.serviceWithEffect(RestartButton, toggleButton(main))),
  IO.as(null)
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
    Stream.tap(({ isPrime }) =>
      isPrime ? IO.delay(IO.unit(), millis(16)) : IO.unit()
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
        C.setStrokeStyle(isPrime ? 'transparent' : Color.toCss(Color.hsla(0, 0, 0, 0.25))),
      ]),
      IO.zipRight(turtle.drawForward(3)),
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
      IO.zipRight(turtle.drawForward(3))
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


const primeSpiral =  (total: number) => pipe(
  Stream.fromEffect(initialize),
  Stream.merge(spiralMaker(total)),
  Stream.runLast,
  IO.flatMap(state =>
    pipe(
      state,
      O.flatMap(_ => O.fromNullable(_)),
      IO.fromOption,
      IO.tap(_ => D.render(fillEnd(_))),
    )
  ),
  C.withContext,
  IO.timed,
  IO.tap(([ duration, ]) => IO.log(`duration: ${duration.millis}ms `)),
  IO.zipRight(IO.delay(spinIt, millis(3e3))),
  IO.zipRight(IO.serviceWithEffect(RestartButton, toggleButton(main))),
  IO.provideSomeLayer(Turtle2d.fromOrigin),
  IO.provideSomeLayer(DrawsTurtles.Live),
  IO.provideSomeLayer(liveLastPrime),
  IO.provideSomeLayer(liveLatest),
  IO.provideSomeLayer(liveFormatter),
  IO.provideSomeLayer(liveRestartButton),
  C.renderTo('canvas4'),
)
function fillEnd({position: [x, y]}: Turtle2d.TurtleState) {
  return D.fill(Shape.circle(x, y, 4), D.fillStyle(Color.hsla(0, 0.5, 0, 0.5)))
}

