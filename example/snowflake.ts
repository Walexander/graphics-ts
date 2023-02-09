import * as IO from '@effect/io/Effect'
import * as Layer from '@effect/io/Layer'
import * as RA from '@fp-ts/core/ReadonlyArray'
import * as Duration from '@fp-ts/data/Duration'
import { pipe } from '@fp-ts/core/Function'
import { Live as DrawsShapesLive, withDelay } from '../src/Drawable/Shape'
import { Live as DrawsDrawingsLive } from '../src/Drawable/Drawing'
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
// this is exported to our main thread and will return
// an Effect that either uses a Worker or runs on the main thread
export function snowFlakes(canvasId: string, iters: number) {
  return navigator.userAgent.indexOf('Chrome') >= 0 // 🙁 requires module workers and OffscreenCanvas
    ? snowflakeWorker(canvasId, iters)
    : snowflakeMain(canvasId, iters)
}

// this is exported for rendering within a service worker
export function runFlakes(canvas: CanvasRenderingContext2D, iters: number) {
  return pipe(
    makeFlakes(iters),
    IO.provideSomeLayer(Layer.succeed(C.Tag, canvas)),
    IO.provideSomeLayer(DrawsDrawingsLive),
    IO.provideSomeLayer(DrawsShapesLive),
    IO.runPromise
  )
}

// this is our main rendering loop.
// it iteratively draws a new `snowflake(1..total)` every `1/iteration` seconds
function makeFlakes(total: number) {
  return pipe(
    IO.loopDiscard(
      2,
      (z) => z <= total,
      (z) => z + 1,
      (z) => drawFlakes(z)
    ),
  )

}
// draw the flakes at `z` iteration
function drawFlakes(z: number) {
  return pipe(
    // generate our snowflake drawing for the new iteration
    snowflake(z),
    // its built from a `unit` pentagon so scale it up
    D.scale(150, 150),
    // we cheat here -- this is the middle of our 600x600 canvas
    D.translate(300, 300),
    // little shadow ... looks nice
    D.withShadow(D.monoidShadow.combine(D.shadowColor(Color.black), D.shadowBlur(10))),
    // render the whole `Drawing` - this is effectual
    D.render,
    // get the resulting effect's duration
    IO.timed,
    IO.tap(([duration]) => IO.logInfo(`snowflake(${z}) took ${duration.millis}ms`)),
    // a little delay
    IO.zipLeft(
      // pause *after* this unit effect, ie after we draw,
      pipe(IO.unit(), IO.delay(Duration.seconds(1 / z)))
    )
  )
}

// this function recursively creates a new drawing,
// makes 5 more copies, each scaled down 0.375 and
// placed on the edge of a unit pentagon,
// which is then prepended to the Drawing
//
function snowflake(n: number): D.Drawing {
  return n <= 0 ? D.monoidDrawing.empty : pipe(
    snowflake(n - 1),
    D.scale(SCALE, SCALE),
    _ => makeMore(_, 5),
    RA.prepend(D.fill(pentagon, D.fillStyle(colors[n % colors.length]))),
    D.monoidDrawing.combineAll
  )
}

// this will make 5 copies of a drawing and place each
// equally around a circle
function makeMore(child: D.Drawing, size = 5): D.Drawing[] {
  return pipe(
    RA.range(0, size - 1),
    RA.map((j) =>
      pipe(
        child,
        D.translate(0, Math.cos(Math.PI / size) * (1 + SCALE)),
        D.rotate((Math.PI / (size / 2)) * (j + 0.5))
      )
    )
  )
}

// On the main thread we delay all calls to `draw` our shapes,
// yielding CPU and providing an animated effect
function snowflakeMain(id: string, iters: number) {
  return pipe(
    makeFlakes(iters),
    C.renderTo(id),
    IO.provideSomeLayer(DrawsDrawingsLive),
    withDelay(Duration.millis(1)),
    IO.provideLayer(DrawsShapesLive)
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
