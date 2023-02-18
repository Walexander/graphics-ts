import * as IO from '@effect/io/Effect'
import * as Duration from '@fp-ts/data/Duration'
import { pipe } from '@fp-ts/core/Function'

import * as Color from '../src/Color'
import * as C from '../src/Canvas'
import * as D from '../src/Drawing'
import * as S from '../src/Shape'

const drawNestedRect = IO.collectAll([
  C.setFillStyle('magenta'),
  C.fillRect(-20, -20, 40, 40),
  C.setFillStyle(Color.toCss(Color.hsla(180, 0.5, 0.5, 0.5))),
  C.fillPath(C.rect(-5, -5, 10, 10)),
])

function rotatesAndDrawsRect(rads: number) {
  return C.withContext(
    IO.collectAllDiscard([
      C.clearRect(-50, -50, 100, 100),
      C.rotate(rads),
      drawNestedRect
    ])
  )
}
const drawDirect = C.withContext(
  IO.collectAll([
    C.translate(50, 50),
    loopCircle(z => IO.delay(rotatesAndDrawsRect(z), Duration.millis(16)))
  ])
)

const nestedRectDrawing = D.combineAll([
  D.fill(
    S.rect(-50, -50, 100, 100),
    D.fillStyle(Color.white),
  ),
  D.fill(
    S.rect(-20, -20, 40, 40),
    D.fillStyle(Color.hsla(-180, 0.5, 0.5, 1))
  ),
  D.outline(
    S.rect(-5, -5, 10, 10),
    D.outlineColor(Color.hsla(-180, 0.5, 0.25, 1))
  ),
])
const rotateRectDrawing = (z: number) => pipe(
  nestedRectDrawing,
  D.rotate(z),
  D.translate(50, 50)
)

const withDrawing = C.withContext(
  loopCircle(z => IO.delay(
    D.render(rotateRectDrawing(z)),
    Duration.millis(16)
  ))
)

function loopCircle<R, E, A>(f: (z: number) => IO.Effect<R, E, A>) {
  return IO.loopDiscard(
    0,
    _ => _ <= 360,
    z => z + 10,
    z => f(-z * Math.PI / 180),
  )
}

void pipe(
  drawDirect,
  IO.zipRight(withDrawing),
  C.renderTo('canvas3'),
  IO.runPromise
)
