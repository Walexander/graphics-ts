/** @since 2.0.0 */
import * as IO from '@effect/io/Effect'
import { flow, pipe } from '@effect/data/Function'
import { Drawable } from '../Drawable'
import { Tag as ShapeTag, Live as ShapeLive } from './Shape'
import * as C from '../Canvas'
import { Shape } from '../Shape'
import { toCss } from '../Color'
import { Drawing } from '../Drawing'
import * as Context from '@effect/data/Context'
import * as O from '@effect/data/Option'
import { showFont } from '../Font'

/**
 * The `Drawable` instance for a `Drawing` type
 *
 * @category instances
 * @since 2.0.0
 */
export const Tag = Context.Tag<Drawable<Drawing>>()
/**
 * A Live `Drawable` layer that renders to a `CanvasRenderingContext2D`
 *
 * @category instances
 * @since 2.0.0
 */
export const Live = pipe(
  IO.service(ShapeTag),
  IO.zip(IO.service(C.Tag)),
  IO.map(([draws, canvas]) => DrawsDrawingImpl(draws, canvas)),
  IO.toLayer(Tag)
)
/**
 * Draws a `Drawing` using a `Drawable<Drawing>`
* from the context
 *
 * @category operators
 * @since 2.0.0
 */
export function drawsDrawing(drawing: Drawing): IO.Effect<Drawable<Drawing>, never, void> {
  return IO.serviceWithEffect(Tag, drawer => drawer(drawing))
}

/**
 * Render a `Drawing` providing the Live `Drawable`
 * instances for both `Drawing` and `Shape`
 *
 * @category operators
 * @since 1.0.0
 */
export function renderDrawing(drawing: Drawing): IO.Effect<CanvasRenderingContext2D, never, void> {
  return pipe(
    IO.serviceWithEffect(Tag, drawer => drawer(drawing)),
    IO.provideSomeLayer(Live),
    IO.provideSomeLayer(ShapeLive)
  )
}

function DrawsDrawingImpl(
  drawShape: Drawable<Shape>,
  canvas: CanvasRenderingContext2D
): Drawable<Drawing> {
  return draw

  function draw(drawing: Drawing): IO.Effect<never, never, void> {
    return IO.provideService(render_(drawing), C.Tag, canvas)
  }

  function render_(drawing: Drawing) {
    switch (drawing._tag) {
      case 'Clipped':
        return C.withContext(
          pipe(
            C.beginPath,
            IO.zipRight(drawShape(drawing.shape)),
            IO.zipRight(C.clip()),
            IO.zipRight(IO.suspendSucceed(() => draw(drawing.drawing)))
          )
        )

      case 'Fill':
        return C.withContext(
          pipe(
            applyStyle(drawing.style.color, flow(toCss, C.setFillStyle)),
            IO.zipRight(C.fillPath(drawShape(drawing.shape)))
          )
        )

      case 'Many':
        return pipe(
          IO.service(C.Tag),
          IO.zipLeft(IO.forEachDiscard(drawing.drawings, _ => draw(_)))
        )

      case 'Outline':
        return pipe(
          IO.service(C.Tag),
          IO.zipLeft(
            pipe(
              IO.collectAllDiscard([
                applyStyle(drawing.style.color, flow(toCss, C.setStrokeStyle)),
                applyStyle(drawing.style.lineWidth, C.setLineWidth),
                C.strokePath(drawShape(drawing.shape))
              ]),
              C.withContext
            )
          )
        )
      case 'Rotate':
        return C.withContext(
          pipe(C.rotate(drawing.angle), IO.zipRight(IO.suspendSucceed(() => draw(drawing.drawing))))
        )

      case 'Scale':
        return C.withContext(
          pipe(
            C.scale(drawing.scaleX, drawing.scaleY),
            IO.zipRight(IO.suspendSucceed(() => draw(drawing.drawing)))
          )
        )

      case 'Text':
        return pipe(
          IO.collectAllDiscard([
            C.setFont(showFont.show(drawing.font)),
            applyStyle(drawing.style.color, flow(toCss, C.setFillStyle)),
            C.fillText(drawing.text, drawing.x, drawing.y)
          ]),
          C.withContext,
          IO.zipRight(IO.service(C.Tag))
        )

      case 'Translate':
        return C.withContext(
          pipe(
            C.translate(drawing.translateX, drawing.translateY),
            IO.zipRight(IO.suspendSucceed(() => draw(drawing.drawing)))
          )
        )

      case 'WithShadow':
        return C.withContext(
          pipe(
            IO.collectAllDiscard([
              applyStyle(drawing.shadow.color, flow(toCss, C.setShadowColor)),
              applyStyle(drawing.shadow.blur, C.setShadowBlur),
              applyStyle(drawing.shadow.offset, o =>
                pipe(C.setShadowOffsetX(o.x), IO.zipRight(C.setShadowOffsetY(o.y)))
              )
            ]),
            IO.zipRight(IO.suspendSucceed(() => draw(drawing.drawing)))
          )
        )
    }
  }
}
const applyStyle = <A>(
  o: O.Option<A>,
  f: (a: A) => IO.Effect<CanvasRenderingContext2D, never, unknown>
) => pipe(IO.fromOption(o), IO.flatMap(f), IO.orElse(IO.unit))
