
/**
 * Adapted from https://github.com/purescript-contrib/purescript-drawing/blob/master/test/Main.purs
 */
import * as IO from '@effect/io/Effect'
import * as Duration from '@effect/data/Duration'
import * as RA from '@effect/data/ReadonlyArray'
import { pipe } from '@effect/data/Function'

import { Live as DrawsShapesLive } from '../src/Drawable/Shape'
import { Live as DrawsDrawingsLive } from '../src/Drawable/Drawing'
import * as Color from '../src/Color'
import * as C from '../src/Canvas'
import * as D from '../src/Drawing'
import * as S from '../src/Shape'

/**
 * A simple animation loop that grows a circle 1px / 16ms
 * and then renders a clipped rect drawing
 */
export const clippingDemo = pipe(
  IO.unit(),
  IO.zipRight(
    IO.loopDiscard(
      <[number, S.Arc]>[0, S.circle(300, 300, 100)],
      ([loops]) => loops < 2,
      nextCircle,
      ([, circle]) =>
        pipe(
          IO.unit(),
          IO.zipRight(C.clearRect(0, 0, 600, 600)),
          IO.zipRight(D.render(clippedRect(circle))),
          IO.zipRight((IO.delay(Duration.millis(16))(IO.unit())))
        )
    )
  ),
      // give our program a way to draw `Drawing`
      IO.provideSomeLayer(DrawsDrawingsLive),
      // give that a way to draw `Shape`
      IO.provideSomeLayer(DrawsShapesLive),
      // finally, provide our an actual canvas
  IO.forever
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
  RA.range(0, 2),
  RA.flatMap(row =>
    pipe(
      RA.range(0, 2),
      RA.map(col =>
        D.fill(S.rect(col * 200, row * 200, 150, 150), D.fillStyle(Color.hsl(0, 1, 0.5)))
      )
    )
  )
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
