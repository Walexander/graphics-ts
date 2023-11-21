/** @since 2.0.0 */
import { Effect, Context, Layer } from 'effect'

import * as Drawable from '../Drawable'
import * as C from '../Canvas'
import { Canvas2d } from '../Canvas/definition'
import { TurtleMove } from '../Turtle2d'
import { flow } from 'effect/Function'

/**
 *
 * Drawing operations required by our Turtle
 *
 * @category model
 * @since 2.0.0
 */
export interface TurtleSurface
  extends Pick<Canvas2d, 'moveTo' | 'lineTo' | 'beginPath' | 'stroke'> {}
/**
 *
 * Tagged `TurtleSurface` service
 *
 * @category model
 * @since 2.0.0
 */
export const TurtleSurfaceTag = Context.Tag<TurtleSurface>()

/**
 *
 * A `TurtleSurface` that provides a real canvas
 *
 * @category instances
 * @since 2.0.0
 */
export const TurtleSurfaceCanvas = Layer.effect(
  TurtleSurfaceTag,
  C.Tag.pipe(Effect.map(canvas => TurtleSurfaceImpl(canvas)))
)
// implement the actual turtle surface
function TurtleSurfaceImpl(canvas: CanvasRenderingContext2D) {
  const provide = Effect.provideService(C.Tag, canvas)
  return <TurtleSurface>{
    moveTo: flow(C.moveTo, provide),
    lineTo: flow(C.lineTo, provide),
    beginPath: provide(Effect.as(C.beginPath, void null)),
    stroke: provide(Effect.as(C.stroke(), void null))
  }
}

/**
 * Summon a `Drawable<Turtle2d>` instance
 *
 * @since 2.0.0
 * @category tag
 */
export const Tag = Context.Tag<Drawable.Drawable<TurtleMove>>()

/**
 * A live instance of the `Drawable<Turtle2d>`. Delegates
 * drawing to a `TurtleSurface`
 *
 * @since 2.0.0
 * @category instances
 */
export const Live = Layer.provide(
  TurtleSurfaceCanvas,
  Layer.effect(Tag,
    (TurtleSurfaceTag.pipe(Effect.map(surface => DrawsTurtleImpl(surface))))
  )
)

function DrawsTurtleImpl(surface: TurtleSurface): Drawable.Drawable<TurtleMove> {
  return ([[x0, y0], [x1, y1]]: TurtleMove): Effect.Effect<never, never, void> =>
    Effect.all([
      surface.beginPath,
      surface.moveTo(x0, y0),
      surface.lineTo(x1, y1),
      surface.stroke
    ], { discard: true })
}
