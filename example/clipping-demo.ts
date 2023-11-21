
/**
 * Adapted from https://github.com/purescript-contrib/purescript-drawing/blob/master/test/Main.purs
 */
import { pipe, Duration, Effect as IO, ReadonlyArray as RA } from 'effect'

import { Live as DrawsShapesLive } from '../src/Drawable/Shape'
import { Live as DrawsDrawingsLive } from '../src/Drawable/Drawing'
import * as Color from '../src/Color'
import * as D from '../src/Drawing'
import * as S from '../src/Shape'

/**
 * A simple animation loop that grows a circle 1px / 16ms
 * and then renders a clipped rect drawing
 */
export const clippingDemo = pipe(
  IO.loop(
    <[number, S.Arc]>[0, S.circle(300, 300, 100)],
    {
      while: ([loops]) => loops < 2,
      step: nextCircle,
      body: ([, circle]) => D.render(D.combineAll([
          D.fill(S.rect(0, 0, 600, 600), D.fillStyle(Color.white)),
          clippedRect(circle)
      ])).pipe(IO.zipRight(IO.delay(IO.unit, Duration.millis(16))))
    },
  ).pipe(
      // give our program a way to draw `Drawing`
      IO.provide(DrawsDrawingsLive),
      // give that a way to draw `Shape`
      IO.provide(DrawsShapesLive),
      // finally, provide our an actual canvas
      IO.forever
    ),
)
// a circle that gets bigger up to a radius of 300
// then gets smaller down to a radius of 100
// and repeats
function nextCircle([loops, circle]: [number, S.Arc]): [number, S.Arc] {
  return [
    loops % 2 == 0 ? (circle.r >= 300 ? loops + 1 : loops) : circle.r <= 100 ? loops + 1 : loops,
    loops % 2 == 0
      ? S.circle(circle.x, circle.y, circle.r + 1)
      : S.circle(circle.x, circle.y, Math.max(circle.r - 1, 0))
  ]
}
const backgroundSquares = pipe(
  RA.makeBy(3, row => RA.makeBy(3, col =>
    D.fill(S.rect(col * 200, row * 200, 150, 150), D.fillStyle(Color.hsl(0, 1, 0.5))
  ))),
  RA.flatMap(_ => _)
)

/**
 * Example of a clipped canvas from [MDN Web Docs](https://mzl.la/3e0mKKx).
 */
function clippedRect(clip: S.Shape) {
  return pipe(
    D.many([
      // a blue background
      D.fill(S.rect(0, 0, 600, 600), D.fillStyle(Color.hsl(240, 1, 0.5))),
      // and red tiles
      D.translate(25, 25)(D.many(backgroundSquares))
    ]),
    // clip out our shape
    D.clipped(clip),
  )
}
