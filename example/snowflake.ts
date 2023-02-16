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
const SCALE = 375 / 1000 //0.35
const colors: ReadonlyArray<Color.Color> = [
  Color.hsla(60, 0.6, 0.5, 1),
  Color.hsla(55, 0.65, 0.55, 1),
  Color.hsla(30, 1, 0.55, 1),
  Color.hsla(345, 0.62, 0.45, 1),
  Color.hsla(305, 0.7, 0.28, 1),
  Color.hsla(268, 1, 0.18, 1),
  Color.hsla(240, 1, 0.01, 1)
]
const polygon = (sides: number): S.Path => pipe(
  RA.range(0, sides - 1),
  RA.map((n) => pipe((Math.PI / (sides / 2)) * n, (theta) => S.point(Math.sin(theta), Math.cos(theta)))),
  S.closed(RA.Foldable)
)
// this is exported to our main thread and will return
// an Effect that either uses a Worker or runs on the main thread
export function snowFlakes(canvasId: string, iters: number) {
  return snowflakeMain(canvasId, iters)
  // return navigator.userAgent.indexOf('Chrome') >= 0 // 🙁 requires module workers and OffscreenCanvas
  //   ? snowflakeWorker(canvasId, iters)
  //   : snowflakeMain(canvasId, iters)
}

// this is exported for rendering within a service worker
export function runFlakes(canvas: CanvasRenderingContext2D, iters: number) {
  return pipe(
    makeFlakes(iters),
    IO.provideSomeLayer(Layer.succeed(C.Tag, canvas)),
    IO.provideSomeLayer(DrawsDrawingsLive),
    withDelay(Duration.millis(1)),
    IO.provideSomeLayer(DrawsShapesLive),
    C.renderToCanvas(canvas),
    IO.runPromise
  )
}

// this is our main rendering loop.
// it iteratively draws a new `snowflake(1..total)` every `1/iteration` seconds
function makeFlakes(total: number) {
  return pipe(
    IO.loopDiscard(
      1,
      (z) => z <= total,
      (z) => z + 1,
      (z) => drawFlakes(z, 5)
    ),
  )

}
// draw the flakes at `z` iteration
function drawFlakes(z: number, sides = 5) {
  return pipe(
    C.dimensions,
    IO.flatMap(({width, height}) => pipe(
      // generate a snowflake drawing for this iteration
      snowflake(z, sides),
      // scale the whole drawing by 1/4 our width and place
      // it in the middle of the canvas
      D.scale(width / 4, height / 4),
      D.translate(width / 2, height / 2),
      // nice looking shadow
      D.withShadow(D.monoidShadow.combine(D.shadowColor(Color.black), D.shadowBlur(10))),
      (drawing) => pipe(
        // fade the current canvas
        C.setFillStyle(`hsla(0deg 0% 100%/0.5)`),
        IO.zipRight(C.fillRect(0, 0, width, height)),
        // render the drawing
        IO.zipRight(D.draw(drawing)),
      ),
      // get the resulting effect's duration
      IO.timed,
      IO.tap(([duration]) => IO.logInfo(`snowflake(${z}) took ${duration.millis}ms`)),
      // a little delay
      IO.zipLeft(
        // pause *after* this unit effect, ie after we draw,
        pipe(IO.unit(), IO.delay(Duration.seconds(1 / z)))
      )
    ))
  )
}

// this function recursively creates a new drawing,
// makes 5 more copies, each scaled down 0.375 and
// placed on the edge of a unit pentagon,
// which is then prepended to the Drawing
//
function snowflake(n: number, sides: number): D.Drawing {
  return n <= 0 ? D.monoidDrawing.empty : pipe(
    snowflake(n - 1, sides),
    D.scale(SCALE, SCALE),
    _ => makeMore(_, sides),
    RA.prepend(D.fill(polygon(sides), D.fillStyle(colors[n % colors.length]))),
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
    IO.provideSomeLayer(DrawsDrawingsLive),
    withDelay(Duration.millis(1)),
    IO.provideSomeLayer(DrawsShapesLive),
    C.renderTo(id),
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
