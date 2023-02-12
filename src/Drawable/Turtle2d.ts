/** @since 2.0.0 */
import * as IO from '@effect/io/Effect'
import * as Layer from '@effect/io/Layer'
import * as Drawable from '../Drawable'
import * as C from '../Canvas'
import { Canvas } from '../Canvas/definition'
import * as Context from '@fp-ts/data/Context'
import { TurtleMove } from '../Turtle2d'
import { flow } from '@fp-ts/core/Function'

const TurtleSurfaceTag = Context.Tag<TurtleSurface>()
interface TurtleSurface extends Pick<Canvas, 'moveTo' | 'lineTo' | 'beginPath' | 'stroke'> {}
const TurtleSurfaceCanvas = IO.toLayer(
  IO.serviceWith(C.Tag, canvas => TurtleSurfaceImpl(canvas)),
  TurtleSurfaceTag
)

/**
*
* Summon a Drawable<Turtle2d> instance
* @since 2.0.0
  * @category tag
  */
export const Tag = Context.Tag<Drawable.Drawable<TurtleMove>>()
/**
* A live instance of the `Turtle2d` service that draws to a
* canvas.
*
* @since 2.0.0
  * @category tag
  */
export const Live = Layer.provide(
  TurtleSurfaceCanvas,
  IO.toLayer(
    IO.serviceWith(TurtleSurfaceTag, surface => DrawsTurtleImpl(surface)),
    Tag
  )
)

function DrawsTurtleImpl(surface: TurtleSurface): Drawable.Drawable<TurtleMove> {
  return draw
  function draw([[x0, y0], [x1, y1]]: TurtleMove): IO.Effect<never, never, void> {
    return IO.collectAllDiscard([
      surface.beginPath,
      surface.moveTo(x0, y0),
      surface.lineTo(x1, y1),
      surface.stroke
    ])
  }
}
function TurtleSurfaceImpl(canvas: CanvasRenderingContext2D) {
  const provide = IO.provideService(C.Tag, canvas)
  return <TurtleSurface>{
    moveTo: flow(C.moveTo, provide),
    lineTo: flow(C.lineTo, provide),
    beginPath: provide(IO.as(C.beginPath, void null)),
    stroke: provide(IO.as(C.stroke(), void null))
  }
}
