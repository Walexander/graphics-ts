import * as Turtle from '../src/Turtle2d'
import * as C from '../src/Canvas'
import * as IO from '@effect/io/Effect'
import * as Layer from '@effect/io/Layer'
import {pipe} from '@fp-ts/core/Function'

const turtleTriangle = IO.serviceWithEffect(Turtle.Tag, turtle =>
  pipe(
    turtle.drawForward(100),
    IO.zipRight(turtle.turn((2 * Math.PI) / 3)),
    IO.zipRight(turtle.drawForward(100)),
    IO.zipRight(turtle.turn((2 * Math.PI) / 3)),
    IO.zipRight(turtle.drawForward(100))
  )
)
export const main = pipe(
  C.translate(300 + 100, 300 - 100),
  IO.zipRight(C.scale(2, 2)),
  IO.zipRight(
  IO.loopDiscard(
    0,
    (z) => z <= 5,
    z => z + 1,
    z => pipe(
      C.rotate(Math.PI * z / 3),
      IO.zipRight(turtleTriangle),
    )
  )),
  IO.zipRight(C.rotate((Math.PI * 2) / 3)),
  IO.zipRight(turtleTriangle),
  IO.provideSomeLayer(Layer.provide(Turtle.TurtleSurfaceCanvas, Turtle.fromOrigin)),
  C.renderTo('canvas1'),
  IO.catchAllCause(IO.logFatalCause)
)
