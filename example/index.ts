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
import { snowFlakes } from './snowflake'

const CANVAS_ONE_ID = 'canvas1'
const CANVAS_TWO_ID = 'canvas2'

/**
 * Example of a clipped canvas from [MDN Web Docs](https://mzl.la/3e0mKKx).
 * and a simple animation loop of the clipped region
 */
const clippingDemo = pipe(
  IO.log(`Starting clipping demonstration`),
  IO.zipRight(
    IO.loopDiscard(
      <[number, S.Arc]>[0, S.circle(300, 300, 100)],
      ([loops]) => loops < 2,
      nextCircle,
      ([, circle]) =>
        pipe(
          IO.unit(),
          IO.zipRight(C.clearRect(0, 0, 600, 600)),
          IO.zipRight(clippedRect(circle)),
          IO.zipRight(pipe(IO.delay(Duration.millis(16))(IO.unit())))
        )
    )
  ),
  IO.zipLeft(IO.log(`Finished clipping demonstration`))
)
// The `clippingDemo` in parallel with our `snowflake` animation Effect
const canvasDemo =
  IO.collectAllParDiscard([
    pipe(
      clippingDemo,
      // Provide our clipping demo with an actual canvas
      C.renderTo(CANVAS_TWO_ID),
      // log any errors retrieving the canvas
      IO.catchAll((e) => IO.logError(`Error finding ${CANVAS_TWO_ID}: ${e.message}`))
    ),
    snowFlakes(CANVAS_ONE_ID, 6)
  ])
void IO.runPromise(canvasDemo)

function clippedRect(clip: S.Shape) {
  return pipe(
    D.many([
      D.fill(S.rect(0, 0, 600, 600), D.fillStyle(Color.hsl(240, 1, 0.5))),
      D.translate(25, 25)(D.many(backgroundSquares()))
    ]),
    D.clipped(clip),
    D.render
  )
}
function nextCircle([loops, circle]: [number, S.Arc]): [number, S.Arc] {
  return [
    loops % 2 == 0 ? (circle.r >= 300 ? loops + 1 : loops) : circle.r <= 100 ? loops + 1 : loops,
    loops % 2 == 0
      ? S.circle(circle.x, circle.y, circle.r + 1)
      : S.circle(circle.x, circle.y, Math.max(circle.r - 1, 0))
  ]
}
function backgroundSquares() {
  return pipe(
    RA.range(0, 2),
    RA.flatMap((row) =>
      pipe(
        RA.range(0, 2),
        RA.map((col) => D.fill(S.rect(col * 200, row * 200, 150, 150), D.fillStyle(Color.hsl(0, 1, 0.5))))
      )
    )
  )
}
