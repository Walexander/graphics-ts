import * as IO from '@effect/io/Effect'
import * as Layer from '@effect/io/Layer'
import * as RA from '@fp-ts/core/ReadonlyArray'
import { flow, pipe } from '@fp-ts/core/Function'
import * as Drawable from '../Drawable'
import * as C from '../Canvas'
import { Canvas } from '../Canvas/definition'
import { Shape } from '../Shape'
import * as Context from '@fp-ts/data/Context'
import * as Duration from '@fp-ts/data/Duration'

export const drawShape = (shape: Shape) => IO.serviceWithEffect(Tag, drawer => drawer(shape))

export interface Surface
  extends Pick<Canvas, 'arc' | 'rect' | 'ellipse' | 'moveTo' | 'lineTo' | 'closePath'> {}
export const SurfaceTag = Context.Tag<Surface>()
export const CanvasSurface = IO.toLayer(
  IO.serviceWith(C.Tag, canvas => CanvasSurfaceImpl(canvas)),
  SurfaceTag
)

/**
 * The `Drawable` instance for `Shape`
 * @category instances
 */
export const Tag = Context.Tag<Drawable.Drawable<Shape>>()

export const Live = Layer.provide(
  CanvasSurface,
  Layer.effect(
    Tag,
    IO.serviceWith(SurfaceTag, c => DrawsShapesLive(c))
  )
)

export const withDelay = (delay: Duration.Duration) =>
  IO.updateService(
    Tag,
    draws => shape => shape._tag != 'Composite' ? IO.delay(delay)(draws(shape)) : draws(shape)
  )

export function DrawsShapesLive(surface: Surface): Drawable.Drawable<Shape> {
  return DrawsShapesImpl(surface)
}
function DrawsShapesImpl(canvas: Surface): Drawable.Drawable<Shape> {
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
          RA.match(IO.unit, (head, tail) =>
            IO.tuple(
              canvas.moveTo(head.x, head.y),
              IO.forEach(tail, ({ x, y }) => canvas.lineTo(x, y))
            )
          ),
          IO.zipRight(shape.closed ? canvas.closePath : IO.unit())
        )

      case 'Rect':
        return canvas.rect(shape.x, shape.y, shape.width, shape.height)
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
    arc: flow(C.arc, provide)
  }
}
