import * as IO from '@effect/io/Effect'
import * as Layer from '@effect/io/Layer'
import * as RA from '@fp-ts/core/ReadonlyArray'
import * as Duration from '@fp-ts/data/Duration'
import { pipe } from '@fp-ts/core/Function'

import * as Color from '../src/Color'
import * as C from '../src/Canvas'
import * as D from '../src/Drawing'
import * as S from '../src/Shape'
const SCALE = 0.375
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
  RA.map((n) => pipe((Math.PI / 2.5) * n, (theta) => S.point(Math.sin(theta), Math.cos(theta)))),
  S.closed(RA.Foldable)
)

// this is exported to our main thread and will return either
// an Effect that either uses a Worker or runs on the main thread
export const snowFlakes = (canvasId: string, iters: number) =>
  navigator.userAgent.indexOf('Chrome') > 0 // 🙁 requires module workers and OffscreenCanvas
    ? snowflakeWorker(canvasId, iters)
    : pipe(makeFlakes(iters), C.renderTo(canvasId))

// this is exported for rendering within a service worker
export const runFlakes = (canvas: CanvasRenderingContext2D, iters: number) =>
  pipe(IO.provideLayer(makeFlakes(iters), Layer.succeed(C.Tag, canvas)), IO.runPromise)

// this is our main rendering loop.
// it iteratively draws a new `snowflake(1..total)` every `1/iteration` seconds
function makeFlakes(total: number) {
  return IO.loopDiscard(
    1,
    (z) => z <= total,
    (z) => z + 1,
    (z) =>
      pipe(
        // generate our snowflake drawing for the new iteration
        snowflake(z),
        D.scale(150, 150),
        D.translate(300, 300),
        D.withShadow(D.monoidShadow.combine(D.shadowColor(Color.black), D.shadowBlur(10))),
        // render the `Drawing` - this is effectual
        D.render,
        // get the resulting effect's duration
        IO.timed,
        IO.tap(([duration]) => IO.logInfo(`snowflake(${z}) took ${duration.millis}ms`)),
        // a little delay
        IO.zipLeft(
          // this will pause *after* we draw
          pipe(IO.unit(), IO.delay(Duration.seconds(1 / z)))
        )
      )
  )

}

// this function recursively creates a new drawing, scales it to 0.375
// and makes 5 more copies, each placed on the edge of a unit pentagon,
// which is then prepended to the Drawing
//
function snowflake(n: number): D.Drawing {
  return n <= 0 ? D.monoidDrawing.empty : pipe(
    snowflake(n - 1),
    D.scale(SCALE, SCALE),
    makeMore,
    RA.prepend(D.fill(pentagon, D.fillStyle(colors[n % colors.length]))),
    D.monoidDrawing.combineAll
  )
}
function makeMore(child: D.Drawing): D.Drawing[] {
  return pipe(
    RA.range(0, 4),
    RA.map((j) =>
      pipe(
        child,
        D.translate(0, Math.cos(Math.PI / 5) * (1 + SCALE)),
        D.rotate((Math.PI / 2.5) * (j + 0.5))
      )
    )
  )
}
function makeWorker() {
  return pipe(
    IO.attempt(
      () =>
        new Worker(new URL('./snowflake.worker.ts?worker&inline', import.meta.url), {
          type: 'module'
        })
    ),
    IO.tapError((_) => IO.logError(`ERROR opening worker`)),
    IO.orDie
  )
}
function snowflakeWorker(canvasId: string, iters: number) {
  return pipe(
    C.elementById(canvasId),
    IO.flatMap((a) =>
      IO.tryCatch(
        () => a.transferControlToOffscreen(),
        (error) => new Error(error + '')
      )
    ),
    IO.zip(makeWorker()),
    IO.tap(([canvas, worker]) => IO.sync(() => worker.postMessage({ iters, canvas }, [canvas]))),
    IO.catchAll((e) => IO.logError(`Error getting canvas: ${e.message}`))
  )
}
