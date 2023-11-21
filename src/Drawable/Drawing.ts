/** @since 2.0.0 */
import * as Drawable from '../Drawable'
import { Tag as ShapeTag, Live as ShapeLive } from './Shape'
import * as C from '../Canvas'
import { Shape } from '../Shape'
import { toCss } from '../Color'
import { Drawing } from '../Drawing'
import { showFont } from '../Font'
import { Layer, Effect as IO, Option as O, Duration, Context } from 'effect'
import { flow, pipe } from 'effect/Function'

/**
 * The `Drawable` instance for a `Drawing` type
 *
 * @category instances
 * @since 2.0.0
 */
export const Tag = Context.Tag<Drawable.Drawable<Drawing>>()
/**
 * A Live `Drawable` layer that renders to a `CanvasRenderingContext2D`
 *
 * @category instances
 * @since 2.0.0
 */
export const Live = pipe(
  ShapeTag.pipe(
    IO.zip(C.Tag),
    IO.map(([draws, canvas]) => DrawsDrawingImpl(draws, canvas)),
    Layer.effect(Tag),
  )
)
/**
 * Draws a `Drawing` using a `Drawable<Drawing>`
* from the context
 *
 * @category operators
 * @since 2.0.0
 */
export function drawsDrawing(drawing: Drawing): IO.Effect<Drawable.Drawable<Drawing>, never, void> {
  return Tag.pipe(IO.tap(draws => draws(drawing)))
}

/**
 * Render a `Drawing` providing the Live `Drawable`
 * instances for both `Drawing` and `Shape`
 *
 * @category operators
 * @since 1.0.0
 */
export function renderDrawing(drawing: Drawing): IO.Effect<CanvasRenderingContext2D, never, void> {
  return Tag.pipe(
    IO.flatMap(drawer => drawer(drawing)),
    IO.provide(Live),
    IO.provide(ShapeLive)
  )
}

function DrawsDrawingImpl(
  drawShape: Drawable.Drawable<Shape>,
  canvas: CanvasRenderingContext2D
): Drawable.Drawable<Drawing> {
  const drawEffect = IO.provideService(C.Tag, canvas)

  function draw(drawing: Drawing): IO.Effect<never, never, void> {
    return render_(drawing).pipe(drawEffect)
  }

  return draw

  function render_(drawing: Drawing): IO.Effect<CanvasRenderingContext2D, never, void> {
    switch (drawing._tag) {
      case 'Clipped':
        return IO.all([
          C.beginPath,
          drawShape(drawing.shape),
          C.clip(),
          IO.suspend(() => draw(drawing.drawing))
        ]).pipe(C.withContext)

      case 'Fill':
        return IO.all(
          [
            applyStyle(drawing.style.color, color => C.setFillStyle(toCss(color))),
            C.fillPath(drawShape(drawing.shape))
          ],
          { discard: true }
        ).pipe(C.withContext)

      case 'Many':
        return IO.forEach(drawing.drawings, render_, { discard: true })
          // IO.service(C.Tag),
          // IO.zipLeft(IO.forEachDiscard(drawing.drawings, _ => draw(_)))

      case 'Outline':
        return IO.all(
          [
            applyStyle(drawing.style.color, flow(toCss, C.setStrokeStyle)),
            applyStyle(drawing.style.lineWidth, C.setLineWidth),
            C.strokePath(drawShape(drawing.shape))
          ],
          { discard: true }
        ).pipe(C.withContext)

      case 'Rotate':
        return C.rotate(drawing.angle).pipe(
          IO.zipRight(IO.suspend(() => draw(drawing.drawing))),
          C.withContext,
        )

      case 'Scale':
        return IO.all([
          C.scale(drawing.scaleX, drawing.scaleY).pipe(
            IO.zipRight(IO.suspend(() => draw(drawing.drawing)))
          )
        ]).pipe(C.withContext)

      case 'Text':
        return IO.all([
          C.setFont(showFont.show(drawing.font)),
          applyStyle(drawing.style.color, flow(toCss, C.setFillStyle)),
          C.fillText(drawing.text, drawing.x, drawing.y)
        ]).pipe(C.withContext)

      case 'Translate':
        return C.translate(drawing.translateX, drawing.translateY).pipe(
          IO.zipRight(IO.suspend(() => draw(drawing.drawing))),
          C.withContext
        )

      case 'WithShadow': return IO.all(
          [
            applyStyle(drawing.shadow.color, flow(toCss, C.setShadowColor)),
            applyStyle(drawing.shadow.blur, C.setShadowBlur),
            applyStyle(drawing.shadow.offset, ({ x, y }) =>
              C.setShadowOffsetX(x).pipe(IO.zipRight(C.setShadowOffsetY(y)))
            )
          ],
          { discard: true }
        ).pipe(
            IO.zipRight(IO.suspend(() => draw(drawing.drawing))),
            C.withContext,
          )

      case 'Image':
        return C.drawImage(drawing.image, drawing.source.x, drawing.source.y)
    }
  }
}
const applyStyle = <A, B = unknown>(
  o: O.Option<A>,
  f: (a: A) => IO.Effect<CanvasRenderingContext2D, never, B>
) => o.pipe(IO.flatMap(f), IO.orElse(() => IO.unit))


/**
 * Modifies any `Drawable<Shape>` instance to pause
 * for `delay` after `N` shapes are drawn
 *
 * @category instances
 * @since 2.0.0
 */

export const withDelayN = (delay: Duration.Duration, count: number) => {
  let queue: Drawing[] = []
  const pushShape = (shape: Drawing) => {
    return IO.sync(() => {
      queue.push(shape)
      return queue
    })
  }
  const flushQueue = (draws: Drawable.Drawable<Drawing>, queue: Drawing[]) =>
    pipe(
      IO.log(
        `getting all of the shapes out: ${queue.length}: ${JSON.stringify(queue.map(_ => _._tag))}`
      ),
      IO.zipRight(IO.forEach(queue, draws)),
      IO.zipRight(IO.sync(() => (queue.length = 0))), // <-- Sneaky?  or dumb?
      IO.zipLeft(IO.log(`DONE flushing the shapes: ${queue.length}:`))
    )
  return IO.updateService(
    Tag,
    draws =>
      function _draws(drawing: Drawing): IO.Effect<never, never, void> {
        return drawing._tag == 'Many'
          ? IO.log(`got an effect to draw ${drawing._tag}`).pipe(
              IO.zipRight(IO.forEach(drawing.drawings, pushShape)),
              IO.zipRight(IO.sync(() => queue)),
              IO.flatMap(queue => (queue.length < count ? IO.unit : flushQueue(draws, queue))),
              IO.delay(delay)
            )
          : _draws(drawing)
      }
  )
}
