import * as IO from '@effect/io/Effect'
import { flow, pipe } from '@fp-ts/core/Function'
import { Drawable } from '../Drawable'
import { Tag as ShapeTag } from './Shape'
import * as C from '../Canvas'
import { Shape } from '../Shape'
import { toCss } from '../Color'
import { Drawing } from '../Drawing'
import * as Context from '@fp-ts/data/Context'
import * as O from '@fp-ts/core/Option'
import {showFont} from '../Font'

export const Tag = Context.Tag<Drawable<Drawing>>()
export const Live = pipe(
  IO.service(ShapeTag),
  IO.map((draws) => new DrawingDrawableImpl(draws)),
  IO.toLayer(Tag)
)

export const renderDrawing = (drawing: Drawing) =>
  IO.serviceWithEffect(Tag, (drawer) => drawer.draw(drawing))

class DrawingDrawableImpl implements Drawable<Drawing> {
  constructor(readonly drawsShapes: Drawable<Shape>) { }

  draw(drawing: Drawing): IO.Effect<CanvasRenderingContext2D, never, void> {
    return pipe(
      this.render_(drawing),
    )
  }

  render_(drawing: Drawing) {
    switch (drawing._tag) {
      case 'Clipped':
        return C.withContext(
          pipe(
            C.beginPath,
            IO.zipRight(this.drawsShapes.draw(drawing.shape)),
            IO.zipRight(C.clip()),
            IO.zipRight(IO.suspendSucceed(() => this.draw(drawing.drawing)))
          )
        )

      case 'Fill':
        return C.withContext(
          pipe(
            applyStyle(drawing.style.color, flow(toCss, C.setFillStyle)),
            IO.zipRight(C.fillPath(this.drawsShapes.draw(drawing.shape)))
          )
        )

      case 'Many':
        return pipe(
          IO.service(C.Tag),
          IO.zipLeft(IO.forEachDiscard(drawing.drawings, (_) => this.draw(_)))
        )

      case 'Outline':
        return pipe(
          IO.service(C.Tag),
          IO.zipLeft(
            pipe(
              IO.collectAllDiscard([
                applyStyle(drawing.style.color, flow(toCss, C.setStrokeStyle)),
                applyStyle(drawing.style.lineWidth, C.setLineWidth),
                C.strokePath(this.drawsShapes.draw(drawing.shape))
              ]),
              C.withContext
            )
          )
        )
      case 'Rotate':
        return C.withContext(
          pipe(
            C.rotate(drawing.angle),
            IO.zipRight(IO.suspendSucceed(() => this.draw(drawing.drawing)))
          )
        )

      case 'Scale':
        return C.withContext(
          pipe(
            C.scale(drawing.scaleX, drawing.scaleY),
            IO.zipRight(IO.suspendSucceed(() => this.draw(drawing.drawing)))
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
            IO.zipRight(IO.suspendSucceed(() => this.draw(drawing.drawing)))
          )
        )

      case 'WithShadow':
        return C.withContext(
          pipe(
            IO.collectAllDiscard([
              applyStyle(drawing.shadow.color, flow(toCss, C.setShadowColor)),
              applyStyle(drawing.shadow.blur, C.setShadowBlur),
              applyStyle(drawing.shadow.offset, (o) =>
                pipe(C.setShadowOffsetX(o.x), IO.zipRight(C.setShadowOffsetY(o.y)))
              )
            ]),
            IO.zipRight(IO.suspendSucceed(() => this.draw(drawing.drawing)))
          )
        )
    }
  }
}
const applyStyle = <A>(o: O.Option<A>, f: (a:A) => IO.Effect<CanvasRenderingContext2D, never, unknown>) => pipe(
  IO.fromOption(o),
  IO.flatMap(f),
  IO.orElse(IO.unit)
)
