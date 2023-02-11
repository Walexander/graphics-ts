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

export const drawShape = (shape: Shape) => IO.serviceWithEffect(Tag, (drawer) => drawer.draw(shape))

export interface Surface
  extends Pick<Canvas, 'arc' | 'rect' | 'ellipse' | 'moveTo' | 'lineTo' | 'closePath'> {}
export const SurfaceTag = Context.Tag<Surface>()
export const CanvasSurface = IO.toLayer(IO.serviceWith(C.Tag, canvas => ShapeCanvasImpl(canvas)), SurfaceTag)

function ShapeCanvasImpl(canvas: CanvasRenderingContext2D): Surface {
  const provide = IO.provideService(C.Tag, canvas)
  return {
    moveTo: flow(C.moveTo, provide),
    lineTo: flow(C.lineTo, provide),
    closePath: provide(C.closePath),
    ellipse: flow(C.ellipse, provide),
    rect: flow(C.rect, provide),
    arc: flow(C.arc, provide),
  }
}

/**
 * The `Drawable` instance for `Shape`
 * @category instances
 */
export const Tag = Context.Tag<Drawable.Drawable<Shape>>()
export const Live = Layer.provide(
  CanvasSurface,
  Layer.effect(Tag, pipe(IO.serviceWith(SurfaceTag, c => new ShapeDrawableImpl(c))))
)

export const withDelay = (delay: Duration.Duration) =>
  IO.updateService(Tag, (service) => ({
    draw: (shape) => shape._tag != 'Composite' ?
      IO.delay(delay)(service.draw(shape)) :
      service.draw(shape)
  }))

class ShapeDrawableImpl implements Drawable.Drawable<Shape> {
  constructor(readonly canvas: Surface) {}
  draw(shape: Shape): IO.Effect<never, never, void> {
    switch (shape._tag) {
      case 'Arc':
        return this.canvas.arc(shape.x, shape.y, shape.r, shape.start, shape.end, shape.anticlockwise)

      case 'Composite':
        return pipe(IO.forEachParDiscard(shape.shapes, s => this.draw(s)))

      case 'Ellipse':
        return this.canvas.ellipse(
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
              this.canvas.moveTo(head.x, head.y),
              IO.forEach(tail, ({ x, y }) => this.canvas.lineTo(x, y))
            )
          ),
          IO.zipRight(shape.closed ? this.canvas.closePath : IO.unit())
        )

      case 'Rect':
        return this.canvas.rect(shape.x, shape.y, shape.width, shape.height)
    }
  }
}
