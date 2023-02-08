import * as IO from '@effect/io/Effect'
import * as Layer from '@effect/io/Layer'
import * as RA from '@fp-ts/core/ReadonlyArray'
import { pipe } from '@fp-ts/core/Function'
import * as Drawable from '../Drawable'
import * as C from '../Canvas'
import { Shape } from '../Shape'
import * as Context from '@fp-ts/data/Context'
import * as Schedule from '@effect/io/Schedule'
import * as Duration from '@fp-ts/data/Duration'

const jitter = IO.schedule(Schedule.jittered(Schedule.fromDelay(Duration.millis(100))))
export const drawShape = (shape: Shape) => IO.serviceWithEffect(Tag, (drawer) => drawer.draw(shape))
/**
 * The `Drawable` instance for `Shape`
 * @category instances
 */
export const Tag = Context.Tag<Drawable.Drawable<Shape>>()
export const Live = Layer.sync(Tag, () => new ShapeDrawableImpl())
export const withDelay = (delay: Duration.Duration) =>
  IO.updateService(Tag, (service) => ({
    draw: (shape) => shape._tag != 'Composite' ?
      IO.delay(delay)(service.draw(shape)) :
      service.draw(shape)
  }))
class ShapeDrawableImpl implements Drawable.Drawable<Shape> {
  constructor() {}

  draw(shape: Shape): IO.Effect<CanvasRenderingContext2D, never, void> {
    return this.render_(shape)
  }

  render_(shape: Shape) {
    const empty = IO.service(C.Tag)
    switch (shape._tag) {
      case 'Arc':
        return C.arc(shape.x, shape.y, shape.r, shape.start, shape.end, shape.anticlockwise)

      case 'Composite':
        return pipe(IO.forEachParDiscard(shape.shapes, (s) => this.draw(s)))

      case 'Ellipse':
        return C.ellipse(
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
          RA.match(
            () => IO.succeed(void null),
            (head, tail) =>
              pipe(
                C.moveTo(head.x, head.y),
                IO.zipRight(IO.forEach(tail, ({ x, y }) => C.lineTo(x, y)))
              )
          ),
          IO.zipRight(shape.closed ? C.closePath : empty),
          IO.zipRight(IO.unit())
        )
      case 'Rect':
        return C.rect(shape.x, shape.y, shape.width, shape.height)
    }
  }
}
