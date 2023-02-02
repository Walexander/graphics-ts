import * as IO from '@effect/io/Effect'
import * as Layer from '@effect/io/Layer'
import * as RA from '@fp-ts/core/ReadonlyArray'
import * as Duration from '@fp-ts/data/Duration'
import * as O from '@fp-ts/core/Option'
import { pipe } from '@fp-ts/core/Function'

import * as Color from '../src/Color'
import * as C from '../src/Canvas'
import * as D from '../src/Drawing'
import * as S from '../src/Shape'
import * as Either from '@fp-ts/core/Either'
const SCALE = 0.375

const closedPath = S.closed(RA.Foldable)

const colors: ReadonlyArray<Color.Color> = [
  Color.hsla(60, 0.6, 0.5, 1),
  Color.hsla(55, 0.65, 0.55, 1),
  Color.hsla(30, 1, 0.55, 1),
  Color.hsla(345, 0.62, 0.45, 1),
  Color.hsla(305, 0.7, 0.28, 1),
  Color.hsla(268, 1, 0.18, 1),
  Color.hsla(240, 1, 0.01, 1)
]

const pentagon: S.Path = pipe(
  RA.range(0, 5),
  RA.map((n) => {
    const theta = (Math.PI / 2.5) * n
    return S.point(Math.sin(theta), Math.cos(theta))
  }),
  closedPath
)
const makeDrawing = (n: number): D.Drawing => {
  return n > 0 ? makeNext(n) : D.monoidDrawing.empty

  function makeNext(n: number) {
    return pipe(
      makeDrawing(n-1),
      D.scale(SCALE, SCALE),
      pentaganolInception(colors[n % colors.length]),
      D.monoidDrawing.combineAll
    )
  }

  function pentaganolInception(color: Color.Color): (child: D.Drawing) => D.Drawing[] {
    return (child: D.Drawing) =>
      pipe(
        RA.range(0, 4),
        RA.map((j) =>
          pipe(child, D.translate(0, Math.cos(Math.PI / 5) * (1 + SCALE)), D.rotate((Math.PI / 2.5) * (j + 0.5)))
        ),
        RA.prepend(D.fill(pentagon, D.fillStyle(color)))
      )
  }

}

const snowflake = (iterations: number) => pipe(
  D.monoidShadow.combine(D.shadowColor(Color.black), D.shadowBlur(10)),
  (o) => pipe(
    makeDrawing(iterations),
    D.scale(150, 150),
    D.translate(300, 300),
    D.withShadow(o)
  ),
  D.render,
  IO.timed,
  IO.tap(([duration]) => IO.logInfo(`snowflake(${iterations}) took ${duration.millis}ms`)),
)

export const makeFlakes = (total: number) =>
  pipe(
    IO.loopDiscard(
      1,
      (z) => z <= total,
      (z) => z + 1,
      (z) => pipe(
        snowflake(z),
        IO.zipLeft(
          pipe(
            IO.unit(),
            IO.delay(Duration.seconds(1 / z))
          )
        )
      )
    )
  )

export const runFlakes = (canvas: CanvasRenderingContext2D, iters: number) => pipe(
  IO.provideLayer(makeFlakes(iters), Layer.succeed(C.Tag, canvas)),
  IO.runPromise,
)
const offscreen = <A>(f: C.Render<A>) => pipe(
  IO.sync(() => new OffscreenCanvas(600, 600)),
  IO.map((canvas) =>
    Either.liftPredicate(
      (u: unknown): u is CanvasRenderingContext2D => u != null,
      () => `Cannot get canvas context`
    )(canvas.getContext('2d'))
  ),
  IO.absolve,
  IO.flatMap((a) => C.renderToCanvas(a)(f))
)

export const offscreenFlake = pipe(
  makeFlakes(3),
  offscreen,
  IO.timed,
  IO.tap(([d]) => IO.log(`Finished offscreen in ${d.millis}ms`)),
  IO.catchAll((e) => IO.logError(`OffscreenCanvas failed: ${e}`)),
)

