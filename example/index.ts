/**
 * Adapted from https://github.com/purescript-contrib/purescript-drawing/blob/master/test/Main.purs
 */
import * as IO from '@effect/io/Effect'
import * as RA from '@fp-ts/core/ReadonlyArray'
import { pipe } from '@fp-ts/core/Function'

import * as Color from '../src/Color'
import * as C from '../src/Canvas'
import * as D from '../src/Drawing'
import * as S from '../src/Shape'

const CANVAS_ONE_ID = 'canvas1'
const CANVAS_TWO_ID = 'canvas2'
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
      D.scale(SCALE, SCALE, makeDrawing(n - 1)),
      pentaganolInception(colors[n % colors.length]),
      D.monoidDrawing.combineAll
    )
  }

  function pentaganolInception(color: Color.Color): (child: D.Drawing) => D.Drawing[] {
    return (child: D.Drawing) => pipe(
      RA.range(0, 4),
      RA.map((j) =>
        D.rotate(
          (Math.PI / 2.5) * (j + 0.5),
          D.translate(0, Math.cos(Math.PI / 5) * (1 + SCALE), child)
        )
      ),
      RA.prepend(D.fill(pentagon, D.fillStyle(color))),
    )
  }

}

const snowflake = pipe(
  D.monoidShadow.combine(D.shadowColor(Color.black), D.shadowBlur(10)),
  (o) => D.withShadow(o, D.translate(300, 300, D.scale(150, 150, makeDrawing(3)))),
  D.render
)

/* tslint:disable no-console */
const makeFlake = pipe(
  IO.log(`Starting makeFlake`),
  IO.zipRight(IO.timed(snowflake)),
  IO.tap(([duration]) => IO.logInfo(`snowflake took ${duration.millis}ms`)),
  C.renderTo(CANVAS_ONE_ID),
  IO.catchAll((e) => IO.logError(`Error finding canvas: ${e.message}`)),
)
/* tslint:enable no-console */

/**
 * Example of a clipped canvas from [MDN Web Docs](https://mzl.la/3e0mKKx).
 */
const clippedRect: C.Render<CanvasRenderingContext2D> = pipe(
  D.many([
    D.fill(S.rect(0, 0, 600, 600), D.fillStyle(Color.hsl(240, 1, 0.5))),
    D.fill(S.rect(0, 0, 150, 150), D.fillStyle(Color.hsl(0, 1, 0.5)))
  ]),
  (d) => D.clipped(S.circle(100, 125, 75), d),
  D.render,
)
/* tslint:disable no-console */
const makeClipped = pipe(
  IO.log(`Starting makeClipped`),
  IO.zipRight(IO.timed(clippedRect)),
  IO.tap(([duration]) => IO.logInfo(`clippedRect took ${duration.millis}ms`)),
  C.renderTo(CANVAS_TWO_ID),
)
/* tslint:enable no-console */

void pipe(
  IO.collectAllDiscard([
    makeClipped,
    makeFlake
  ]),
  IO.runPromise
)
