/**
 * Adapted from https://github.com/purescript-contrib/purescript-drawing/blob/master/test/Main.purs
 */
import { Live as DrawsShapesLive, withDelay } from '../src/Drawable/Shape'
import { Live as DrawsDrawingsLive } from '../src/Drawable/Drawing'
import { pipe, Duration,Effect as IO, ReadonlyArray as RA } from 'effect'
import * as Color from '../src/Color'
import * as C from '../src/Canvas'
import * as D from '../src/Drawing'
import * as S from '../src/Shape'
void withDelay
export function snowFlakes(iters: number) {
  return pipe(
    // this is our main program.
    // It has dependencies on the CanvasRenderingContext2D
    // and a `Drawable<Drawing>`
    loopFlakes(iters),

    // First, provide the Drawable instance for our Drawings
    // This depends on a `Drawable<Shape>`
    IO.provide(DrawsDrawingsLive),
    // This allows us to animate drawing
    // with a slight delay between shapes
    withDelay(Duration.millis(16)),
    // Provide a live instance for `Drawable<Shape>`
    IO.provide(DrawsShapesLive)
  )
}

// this is our main rendering loop.
// it iteratively draws a new `snowflake(1..total)` every `1/iteration` seconds
function loopFlakes(total: number) {
  return IO.loop(total, {
    while: z => z <= total,
    step: z => z + 1,
    body: z =>
      C.dimensions.pipe(
        IO.tap(({ width, height }) => C.clearRect(0, 0, width, height)),
        IO.map(({ width, height }) => flakeDrawing(z, 5, width, height)),
        // Now, time how long it takes to draw
        IO.flatMap(drawing => IO.timed(D.draw(drawing))),
        // Log the duration, but keep the previous result
        IO.tap(([duration]) => IO.logInfo(`snowflake(${z}) took ${duration}ms`)),
        // Pause to allow the user to behold the wonder
        IO.zipLeft(pipe(IO.unit, IO.delay('1 seconds')))
      )
  })
}

//
function flakeDrawing(z: number, sides: number, width: number, height: number) {
  const flake = pipe(
    // generate a snowflake drawing for this iteration
    snowflake(z, sides),
    // scale the whole thing by 25%
    D.scale(width / 3.75, height / 3.75),
    // translate it to the middle of the canvas
    D.translate(width / 2, height / 2),
    // add a shadow
    D.withShadow(D.monoidShadow.combine(D.shadowColor(Color.black), D.shadowBlur(10)))
  )
  return D.many([
    // put half opacity to fade the layer below us
    clear(width, height),
    flake
  ])
}

const colors: ReadonlyArray<Color.Color> = [
  Color.hsla(60, 0.6, 0.5, 1),
  Color.hsla(55, 0.65, 0.55, 1),
  Color.hsla(30, 1, 0.55, 1),
  Color.hsla(345, 0.62, 0.45, 1),
  Color.hsla(305, 0.7, 0.28, 1),
  Color.hsla(268, 1, 0.18, 1),
  Color.hsla(240, 1, 0.01, 1)
]

// this function recursively creates a new drawing,
// makes 5 more copies, each scaled down 0.375 and
// placed on the edge of a unit pentagon,
// which is then prepended to the Drawing
function snowflake(n: number, sides: number): D.Drawing {
  const polygon = S.polygon(sides)
  const color = colors[n % colors.length]
  const scale = 0.375

  const drawing = n <= 0
    ? D.monoidDrawing.empty
    : pipe(
        // get our immediate "child" drawing
        snowflake(n - 1, sides),
        // scale it down so it fits around the pentagon
        D.scale(scale, scale),
        // translate it up
        D.translate(0, Math.cos(Math.PI / sides) * (1 + scale)),
        child =>
          pipe(
            RA.range(0, sides - 1),
            RA.map(j =>
              pipe(
                // copy the child
                child,
                // and rotate it so its placed on the polygon
                D.rotate((Math.PI / (sides / 2)) * (j + 0.5))
              )
            ),
            D.many
          ),
        // prepend a unit polygon to the drawing
        children => D.combine(D.fill(polygon, D.fillStyle(color)), children)
      )
  return drawing
}

function clear(width: number, height: number) {
  return D.fill(S.rect(0, 0, width, height), D.fillStyle(Color.hsla(0, 0, 100, 0.0)))
}
