/**
 * These are examples from the `README` for this project
 */
import { Effect as IO, Duration, pipe } from 'effect'

import * as Color from '../src/Color'
import * as C from '../src/Canvas'
import * as D from '../src/Drawing'
import * as S from '../src/Shape'
import { loopCircle, toggleButton, RestartButton, liveRestartButton } from './utils'

const drawNestedRect = IO.all([
  C.setFillStyle('magenta'),
  C.fillRect(-20, -20, 40, 40),
  C.setStrokeStyle(Color.toCss(Color.hsla(180, 0.5, 0.25, 1))),
  C.strokePath(C.rect(-5, -5, 10, 10))
])
function drawRect(canvas: CanvasRenderingContext2D) {
  canvas.fillStyle = 'magenta'
  canvas.fillRect(40, 40, 20, 20)
}
function drawCircle(canvas: CanvasRenderingContext2D) {
  canvas.fillStyle= 'purple'
  canvas.arc(50, 50, 25, 0, Math.PI * 2)
  canvas.fill()
  console.log('here')
}

function rotatesAndDrawsRect(rads: number) {
  return C.withContext(
    IO.all([C.clearRect(-50, -50, 100, 100), C.rotate(rads), drawNestedRect])
  )
}
const drawDirect = C.withContext(
  IO.all([
    C.translate(50, 50),
    loopCircle(z => IO.delay(rotatesAndDrawsRect(z), Duration.millis(16)))
  ])
)

const nestedRectDrawing = D.combineAll([
  D.fill(S.rect(-50, -50, 100, 100), D.fillStyle(Color.white)),
  D.fill(S.rect(-20, -20, 40, 40), D.fillStyle(Color.hsla(-180, 0.5, 0.5, 1))),
  D.outline(S.rect(-5, -5, 10, 10), D.outlineColor(Color.hsla(-180, 0.5, 0.25, 1))),
])

const rotateRectDrawing = (z: number) => pipe(
  nestedRectDrawing,
  D.rotate(z),
)
export const demoUse = IO.zip(
  C.use(drawCircle),
  C.use(drawRect),
)

const withDrawing = C.withContext(IO.all([
  C.translate(50, 50),
  loopCircle(z => IO.delay(
    IO.all( [D.render(rotateRectDrawing(z)),]),
    Duration.millis(16))
  )
])
)
export function main() {
  return RestartButton.pipe(IO.flatMap(toggleButton(main)),
    IO.zipRight(C.renderTo('canvas3')(withDrawing), {concurrent: true }),
    IO.zipRight(C.renderTo('canvas2')(drawDirect), {concurrent: true }),
    IO.zipRight(RestartButton.pipe(IO.flatMap(toggleButton(main)))),
    IO.provide(liveRestartButton),
    IO.runPromise
  )
}
