/**
 * Adapted from https://github.com/purescript-contrib/purescript-drawing/blob/master/test/Main.purs
 */
import * as IO from '@effect/io/Effect'
import * as RA from '@fp-ts/core/ReadonlyArray'
import * as Duration from '@fp-ts/data/Duration'
import { pipe } from '@fp-ts/core/Function'

import { Live as DrawsShapesLive } from '../src/Drawable/Shape'
import { Live as DrawsDrawingsLive } from '../src/Drawable/Drawing'
import * as Color from '../src/Color'
import * as C from '../src/Canvas'
import * as D from '../src/Drawing'
import * as S from '../src/Shape'
import { snowFlakes } from './snowflake'

const CANVAS_ONE_ID = 'canvas1'
const CANVAS_TWO_ID = 'canvas2'

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
/**
 * A simple animation loop that grows a circle 1px / 16ms
 * and then renders a clipped rect drawing
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
          C.clearRect(0, 0, 600, 600),
          IO.zipRight(D.render(clippedRect(circle))),
          IO.zipRight((IO.delay(Duration.millis(16))(IO.unit())))
        )
    )
  ),
  IO.zipLeft(IO.log(`Finished clipping animation loop`)),
  IO.forever
)
// The `clippingDemo` in parallel with our `snowflake` animation Effect
const canvasDemo = pipe(
  // some button management
  IO.sync(() => {
    (document.getElementById('restart') as HTMLButtonElement).disabled = true;
    (document.getElementById('restart') as HTMLButtonElement).removeEventListener('click', main);
  }),
  IO.zipRight(
    // our clipping demo runs forever but `raceAll`
    // will interrupt it once our `snowFlakes` are done
    IO.raceAll([
      pipe(
        clippingDemo,
        // give our program a way to draw `Drawing`
        IO.provideSomeLayer( DrawsDrawingsLive),
        // give that a way to draw `Shape`
        IO.provideSomeLayer(DrawsShapesLive),
        // finally, provide our an actual canvas
        C.renderTo(CANVAS_TWO_ID),
      ),
      snowFlakes(CANVAS_ONE_ID, 6)
    ])),
  IO.zipLeft(IO.sync(() => {
    (document.getElementById('restart') as HTMLButtonElement).disabled = false;
    (document.getElementById('restart') as HTMLButtonElement).addEventListener('click', main)
  })
))

// The only left to do is *run* the thing.
function main() { void IO.runPromise(canvasDemo) }
// Now it's someone else's problem 🤣
main()

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
    RA.flatMap((row) =>
      pipe(
        RA.range(0, 2),
        RA.map((col) => D.fill(S.rect(col * 200, row * 200, 150, 150), D.fillStyle(Color.hsl(0, 1, 0.5))))
      )
    )
  )
