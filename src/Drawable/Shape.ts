/** @since 2.0.0 */
import * as IO from '@effect/io/Effect'
import * as Layer from '@effect/io/Layer'
import * as RA from '@fp-ts/core/ReadonlyArray'
import { flow, pipe } from '@fp-ts/core/Function'
import * as Drawable from '../Drawable'
import * as C from '../Canvas'
import { Canvas2d } from '../Canvas/definition'
import { Shape } from '../Shape'
import * as Context from '@effect/data/Context'
import * as Duration from '@effect/data/Duration'
/**
 * The Canvas operations required to draw a `Shape`
*
* @catgeory model
* @since 2.0.0
*/
interface Surface
  extends Pick<Canvas2d, 'drawImage' | 'arc' | 'rect' | 'ellipse' | 'moveTo' | 'lineTo' | 'closePath'> {}
/**
 * The Canvas operations required to draw a shape`
*
* @catgeory tag
* @since 2.0.0
*/
const SurfaceTag = Context.Tag<Surface>()
const CanvasSurface = IO.toLayer(
  IO.serviceWith(C.Tag, canvas => CanvasSurfaceImpl(canvas)),
  SurfaceTag
)

/**
 * Summon a `Drawable` instance for `Shape`
 * @category tag
 * @since 2.0.0
 */
export const Tag = Context.Tag<Drawable.Drawable<Shape>>()

/**
 * A `Drawable` instance for `Shape` that renders
 * to a `CanvasRenderingContext2D`
 *
 * @category instances
 * @since 2.0.0
 */
export const Live: Layer.Layer<CanvasRenderingContext2D, never, Drawable.Drawable<Shape>> = Layer.provide(
  CanvasSurface,
  Layer.effect(
    Tag,
    IO.serviceWith(SurfaceTag, c => DrawsShapeImpl(c))
  )
)

/**
 * Modifies any `Drawable<Shape>` instance to pause
 * for `delay` after each shape is drawn
 *
 * @category instances
 * @since 2.0.0
 */

export const withDelay = (delay: Duration.Duration) =>
  IO.updateService(
    Tag,
    draws => shape => shape._tag != 'Composite' ? IO.delay(delay)(draws(shape)) : draws(shape)
  )

function DrawsShapeImpl(canvas: Surface): Drawable.Drawable<Shape> {
  return draw
  function draw(shape: Shape): IO.Effect<never, never, void> {
    switch (shape._tag) {
      case 'Arc':
        return canvas.arc(shape.x, shape.y, shape.r, shape.start, shape.end, shape.anticlockwise)

      case 'Composite':
        return IO.forEachParDiscard(shape.shapes, s => draw(s))

      case 'Ellipse':
        return canvas.ellipse(
          shape.x,
          shape.y,
          shape.rx,
          shape.ry,
          shape.rotation,
          shape.start,
          shape.end,
          shape.anticlockwise
        )

      case 'Path':
        return pipe(
          shape.points,
          RA.match(IO.unit, ([head, ...tail]) =>
            IO.tuple(
              canvas.moveTo(head.x, head.y),
              IO.forEach(tail, ({ x, y }) => canvas.lineTo(x, y))
            )
          ),
          IO.zipRight(shape.closed ? canvas.closePath : IO.unit())
        )

      case 'Rect':
        return canvas.rect(shape.x, shape.y, shape.width, shape.height)

      case 'Image':
        return canvas.drawImage(shape.image, shape.source.x, shape.source.y)
    }
  }
}

function CanvasSurfaceImpl(canvas: CanvasRenderingContext2D): Surface {
  const provide = IO.provideService(C.Tag, canvas)
  return {
    moveTo: flow(C.moveTo, provide),
    lineTo: flow(C.lineTo, provide),
    closePath: provide(C.closePath),
    ellipse: flow(C.ellipse, provide),
    rect: flow(C.rect, provide),
    arc: flow(C.arc, provide),
    drawImage: flow(C.drawImage, provide),
  }
}
/**
  * Renders a `Shape` via some `Drawable<Shape>` instance
  *
  * @category combinators
  * @since 2.0.0
  */
export const drawShape = (shape: Shape) => IO.serviceWithEffect(Tag, drawer => drawer(shape))
