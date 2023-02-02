/**
 * Adapted from https://github.com/purescript-contrib/purescript-drawing/blob/master/test/Main.purs
 */
import * as IO from '@effect/io/Effect'
import * as RA from '@fp-ts/core/ReadonlyArray'
import * as Duration from '@fp-ts/data/Duration'
import { pipe } from '@fp-ts/core/Function'

import * as Color from '../src/Color'
import * as C from '../src/Canvas'
import * as D from '../src/Drawing'
import * as S from '../src/Shape'

const CANVAS_ONE_ID = 'canvas1'
const CANVAS_TWO_ID = 'canvas2'

const backgroundSquares = pipe(
  RA.range(0, 2),
  RA.flatMap((row) => pipe(
    RA.range(0, 2),
    RA.map((col) =>
      D.fill(S.rect(col * 200, row * 200, 150, 150), D.fillStyle(Color.hsl(0, 1, 0.5)))
    )
  ))
)
/**
 * Example of a clipped canvas from [MDN Web Docs](https://mzl.la/3e0mKKx).
 */
const clippedRect = (clip: S.Shape): C.Render<CanvasRenderingContext2D> => pipe(
  D.many(
    [
      D.fill(S.rect(0, 0, 600, 600), D.fillStyle(Color.hsl(240, 1, 0.5))),
      D.translate(25, 25)(D.many(backgroundSquares))
    ]),
  D.clipped(clip),
  D.render
)
const makeClipped = pipe(
  IO.log(`Starting makeClipped`),
  IO.zipRight(
    pipe(
      IO.loopDiscard(
        <[number, S.Arc]>[0, S.circle(300, 300, 100)],
        ([loops]) => loops < 2,
        nextCircle,
        ([, circle]) =>
          pipe(
            IO.unit(),
            IO.zipRight(C.clearRect(0, 0, 600, 600)),
            IO.zipRight(clippedRect(circle)),
            IO.delay(Duration.millis(50)),
            IO.zipRight(pipe(IO.delay(Duration.millis(16))(IO.unit())))
          )
      )
    )
  )
)
function nextCircle ([loops, circle]: [number, S.Arc]): [number, S.Arc] {
  return [
    loops % 2 == 0
      ? circle.r >= 300
        ? loops + 1
        : loops
      : circle.r <= 100 ? loops + 1 : loops,
    loops % 2 == 0
      ? S.circle(circle.x, circle.y, circle.r + 1)
      : S.circle(circle.x, circle.y, Math.max(circle.r - 1, 0))
  ]
}
export const worker = IO.sync(
  () => new Worker(new URL('./snowflake.worker.ts', import.meta.url), {type: 'module'})
)
const snowflakeWorker = pipe(
  C.elementById(CANVAS_ONE_ID),
  IO.flatMap((a) => IO.tryCatch(
    () => a.transferControlToOffscreen(),
    (error) => new Error(error + '')
  )),
  IO.zip(worker),
  IO.tap(([canvas, worker]) => IO.sync(() => worker.postMessage({ iters: 5, canvas }, [canvas]))),
  IO.tap(_ => IO.log(`finished posting message`)),
  IO.catchAll((e) => IO.logError(`Error getting canvas: ${e.message}`)),
)

void pipe(
  IO.collectAllParDiscard([
    pipe(
      makeClipped,
      C.renderTo(CANVAS_TWO_ID),
      IO.catchAll((e) => IO.logError(`Error finding ${CANVAS_TWO_ID}: ${e.message}`)),
    ),
    snowflakeWorker,
  ]),
  IO.runPromise
)
