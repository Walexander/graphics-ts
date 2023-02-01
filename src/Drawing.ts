/**
 * The `Drawing` module abstracts away the repetitive calls to the HTML Canvas API that are required
 * when using the `Canvas` module directly and instead allows us to be more declarative with our code.
 *
 * Taking the MDN example from the `Canvas` documentation,
 *
 * ```ts
 * import { error } from 'fp-ts/lib/Console'
 * import { pipe } from 'fp-ts/lib/pipeable'
 * import * as R from 'fp-ts-contrib/lib/ReaderIO'
 * import * as C from 'graphics-ts/lib/Canvas'
 * import * as Color from 'graphics-ts/lib/Color'
 * import * as S from 'graphics-ts/lib/Shape'
 *
 * const canvasId = 'canvas'
 *
 * const triangle: C.Render<void> = C.fillPath(
 *   pipe(
 *     C.setFillStyle(pipe(Color.black, Color.toCss)),
 *     R.chain(() => C.moveTo(S.point(75, 50))),
 *     R.chain(() => C.lineTo(S.point(100, 75))),
 *     R.chain(() => C.lineTo(S.point(100, 25)))
 *   )
 * )
 *
 * C.renderTo(canvasId, () => error(`[ERROR]: Unable to find canvas with id ${canvasId}`))(triangle)()
 * ```
 *
 * the `triangle` renderer above becomes the following
 *
 * ```ts
 * import { error } from 'fp-ts/lib/Console'
 * import * as RA from 'fp-ts/lib/ReadonlyArray'
 * import * as C from 'graphics-ts/lib/Canvas'
 * import * as Color from 'graphics-ts/lib/Color'
 * import * as D from 'graphics-ts/lib/Drawing'
 * import * as S from 'graphics-ts/lib/Shape'
 *
 * const canvasId = 'canvas'
 *
 * const triangle: C.Render<void> = D.render(
 *   D.fill(
 *     S.path(RA.readonlyArray)([S.point(75, 50), S.point(100, 75), S.point(100, 25)]),
 *     D.fillStyle(Color.black)
 *   )
 * )
 *
 * C.renderTo(canvasId, () => error(`[ERROR]: Unable to find canvas with id ${canvasId}`))(triangle)()
 * ```
 *
 * Adapted from https://github.com/purescript-contrib/purescript-drawing
 *
 * @since 1.0.0
 */
import * as IO from '@effect/io/Effect'
import * as SG from '@fp-ts/core/typeclass/Semigroup'
import * as M from '@fp-ts/core/typeclass/Monoid'
import * as O from '@fp-ts/core/Option'
import * as RA from '@fp-ts/core/ReadonlyArray'
import { flow, pipe } from '@fp-ts/core/Function'

import * as C from './Canvas'
import { toCss, Color } from './Color'
import { showFont, Font } from './Font'
import { Point, Shape } from './Shape'

const readonlyArrayMonoidDrawing = RA.getMonoid<Drawing>()
const firstSome = <A>() => (M.fromSemigroup(O.getFirstSomeSemigroup<A>(), O.none<A>()))
const getFirstMonoidColor = firstSome<Color>()
const getFirstMonoidNumber = firstSome<number>()
const getFirstMonoidPoint = firstSome<Point>()

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * Represents a `Drawing` that has been clipped by a `Shape`.
 *
 * @category model
 * @since 1.0.0
 */
export interface Clipped {
  readonly _tag: 'Clipped'

  /**
   * The shape to use for clipping.
   */
  readonly shape: Shape

  /**
   * The drawing to be clipped.
   */
  readonly drawing: Drawing
}

/**
 * Represents a filled `Shape` that can be drawn to the canvas.
 *
 * @category model
 * @since 1.0.0
 */
export interface Fill {
  readonly _tag: 'Fill'

  /**
   * The filled `Shape`.
   */
  readonly shape: Shape

  /**
   * The fill style applied to the `Shape`.
   */
  readonly style: FillStyle
}

/**
 * Represents the styles applied to a filled `Shape`.
 *
 * @category model
 * @since 1.0.0
 */
export interface FillStyle {
  /**
   * The fill color.
   */
  readonly color: O.Option<Color>
}

/**
 * Represents an outlined `Shape` that can be drawn to the canvas.
 *
 * @category model
 * @since 1.0.0
 */
export interface Outline {
  readonly _tag: 'Outline'

  /**
   * The outlined `Shape`.
   */
  readonly shape: Shape

  /**
   * The outline style applied to the `Shape`.
   */
  readonly style: OutlineStyle
}

/**
 * Represents the styles applied to an outlined `Shape`.
 *
 * @category model
 * @since 1.0.0
 */
export interface OutlineStyle {
  /**
   * The outline color.
   */
  readonly color: O.Option<Color>

  /**
   * The outline line width.
   */
  readonly lineWidth: O.Option<number>
}

/**
 * Represents a collection of `Drawing`s that can be drawn to the canvas.
 *
 * @category model
 * @since 1.0.0
 */
export interface Many {
  readonly _tag: 'Many'

  /**
   * The collection of drawings.
   */
  readonly drawings: ReadonlyArray<Drawing>
}

/**
 * Represents a `Drawing` that has had its transform rotated.
 *
 * @category model
 * @since 1.0.0
 */
export interface Rotate {
  readonly _tag: 'Rotate'

  /**
   * The angle of rotation.
   */
  readonly angle: number

  /**
   * The drawing to be rotated.
   */
  readonly drawing: Drawing
}

/**
 * Represents a `Drawing` that has had scale applied to its transform.
 *
 * @category model
 * @since 1.0.0
 */
export interface Scale {
  readonly _tag: 'Scale'

  /**
   * The x-axis scale.
   */
  readonly scaleX: number

  /**
   * The y-axis scale.
   */
  readonly scaleY: number

  /**
   * The drawing to be scaled.
   */
  readonly drawing: Drawing
}

/**
 * Represents text that can be drawn to the canvas.
 *
 * @category model
 * @since 1.0.0
 */
export interface Text {
  readonly _tag: 'Text'

  /**
   * The font style applied to the text.
   */
  readonly font: Font

  /**
   * The x-axis coordinate at which to begin drawing the text.
   */
  readonly x: number

  /**
   * The y-axis coordinate at which to begin drawing the text.
   */
  readonly y: number

  /**
   * The fill style applied to the text.
   */
  readonly style: FillStyle

  /**
   * The HTML text string.
   */
  readonly text: string
}

/**
 * Represents a `Drawing` that has had its transform translated.
 *
 * @category model
 * @since 1.0.0
 */
export interface Translate {
  readonly _tag: 'Translate'

  /**
   * The x-axis translation.
   */
  readonly translateX: number

  /**
   * The y-axis translation.
   */
  readonly translateY: number

  /**
   * The drawing to be translated.
   */
  readonly drawing: Drawing
}

/**
 * Represents a `Drawing` that has had a shadow applied to it.
 *
 * @category model
 * @since 1.0.0
 */
export interface WithShadow {
  readonly _tag: 'WithShadow'

  /**
   * The shadow to be applied.
   */
  readonly shadow: Shadow

  /**
   * The drawing to be shadowed.
   */
  readonly drawing: Drawing
}

/**
 * Represents the shadow styles applied to a `Shape`.
 *
 * @category model
 * @since 1.0.0
 */
export interface Shadow {
  /**
   * The shadow color.
   */
  readonly color: O.Option<Color>

  /**
   * The shadow blur radius.
   */
  readonly blur: O.Option<number>

  /**
   * The shadow offset.
   */
  readonly offset: O.Option<Point>
}

/**
 * Represents a shape that can be drawn to the canvas.
 *
 * @category model
 * @since 1.0.0
 */
export type Drawing = Clipped | Fill | Outline | Many | Rotate | Scale | Text | Translate | WithShadow

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * Clips a `Drawing` using the specified `Shape`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const clipped: (shape: Shape, drawing: Drawing) => Drawing = (shape, drawing) => ({
  _tag: 'Clipped',
  shape,
  drawing
})

/**
 * Constructs a `Drawing` from a `Fill` `Shape`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const fill: (shape: Shape, style: FillStyle) => Drawing = (shape, style) => ({ _tag: 'Fill', shape, style })

/**
 * Constructs a `FillStyle`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const fillStyle: (color: Color) => FillStyle = (c) => ({ color: O.some(c) })

/**
 * Constructs a `Drawing` from an `Outline` `Shape`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const outline: (shape: Shape, style: OutlineStyle) => Drawing = (shape, style) => ({
  _tag: 'Outline',
  shape,
  style
})

/**
 * Constructs an `OutlineStyle` from a `Color`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const outlineColor: (color: Color) => OutlineStyle = (c) => ({
  color: O.some(c),
  lineWidth: O.none()
})

/**
 * Constructs an `OutlineStyle` from a line width.
 *
 * @category constructors
 * @since 1.0.0
 */
export const lineWidth: (lineWidth: number) => OutlineStyle = (w) => ({
  color: O.none(),
  lineWidth: O.some(w)
})

/**
 * Construct a single `Drawing` from a collection of `Many` `Drawing`s.
 *
 * @category constructors
 * @since 1.0.0
 */
export const many: (drawings: ReadonlyArray<Drawing>) => Drawing = (drawings) => ({ _tag: 'Many', drawings })

/**
 * Applies rotation to the transform of a `Drawing`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const rotate: (angle: number, drawing: Drawing) => Drawing = (angle, drawing) => ({
  _tag: 'Rotate',
  angle,
  drawing
})

/**
 * Applies scale to the transform of a `Drawing`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const scale: (scaleX: number, scaleY: number, drawing: Drawing) => Drawing = (scaleX, scaleY, drawing) => ({
  _tag: 'Scale',
  scaleX,
  scaleY,
  drawing
})

/**
 * Constructs a `Drawing` from `Text`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const text: (font: Font, x: number, y: number, style: FillStyle, text: string) => Drawing = (
  font,
  x,
  y,
  style,
  text
) => ({
  _tag: 'Text',
  font,
  x,
  y,
  style,
  text
})

/**
 * Applies translation to the transform of a `Drawing`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const translate: (translateX: number, translateY: number, drawing: Drawing) => Drawing = (
  translateX,
  translateY,
  drawing
) => ({
  _tag: 'Translate',
  translateX,
  translateY,
  drawing
})

/**
 * Applies `Shadow` to a `Drawing`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const withShadow: (shadow: Shadow, drawing: Drawing) => Drawing = (shadow, drawing) => ({
  _tag: 'WithShadow',
  shadow,
  drawing
})

/**
 * Constructs a `Shadow` from a blur radius.
 *
 * @category constructors
 * @since 1.0.0
 */
export const shadowBlur: (blurRadius: number) => Shadow = (b) => ({
  color: O.none(),
  blur: O.some(b),
  offset: O.none()
})

/**
 * Constructs a `Shadow` from a `Color`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const shadowColor: (color: Color) => Shadow = (c) => ({
  color: O.some(c),
  blur: O.none(),
  offset: O.none()
})

/**
 * Constructs a `Shadow` from an offset `Point`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const shadowOffset: (offsetPoint: Point) => Shadow = (o) => ({
  color: O.none(),
  blur: O.none(),
  offset: O.some(o)
})

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

const applyStyle: <A>(
  fa: O.Option<A>,
  f: (a: A) => C.Render<CanvasRenderingContext2D>
) => C.Render<CanvasRenderingContext2D> = (fa, f) =>
  pipe(
    fa,
    O.match(
      () => IO.service(C.Tag),
      (a) => f(a)
    )
  )

/**
 * Renders a `Shape`.
 *
 * @category combinators
 * @since 1.1.0
 */
export const renderShape: (shape: Shape) => C.Render<CanvasRenderingContext2D> = (shape) => {
  const empty = IO.service(C.Tag)
  switch (shape._tag) {
    case 'Arc':
      return C.arc(shape)

    case 'Composite':
      return pipe(
        IO.forEach(shape.shapes, renderShape),
        IO.zipRight(empty)
      )

    case 'Ellipse':
      return C.ellipse(shape)

    case 'Path':
      return pipe(
        shape.points,
        RA.match(
          () => empty,
          (head, tail) => pipe(
            C.moveTo(head),
            IO.zipRight(IO.forEach(tail, C.lineTo)),
            IO.zipRight(shape.closed ? C.closePath : empty)
          )
        )
      )

    case 'Rect':
      return C.rect(shape)
  }
}

/**
 * Renders a `Drawing`.
 *
 * @category combinators
 * @since 1.0.0
 */
export const render: (drawing: Drawing) => C.Render<CanvasRenderingContext2D> = (drawing) => {
  const go: (drawing: Drawing) => C.Render<CanvasRenderingContext2D> = (d) => {
    switch (d._tag) {
      case 'Clipped':
        return C.withContext(
          pipe(
            C.beginPath,
            IO.zipRight(renderShape(d.shape)),
            IO.zipRight(C.clip()),
            IO.zipRight(go(d.drawing))
          )
        )

      case 'Fill':
        return C.withContext(
          pipe(
            applyStyle(d.style.color, flow(toCss, C.setFillStyle)),
            IO.zipRight(C.fillPath(renderShape(d.shape)))
          )
        )

      case 'Many':
        return pipe(
          IO.forEachDiscard(d.drawings, (d) => go(d)),
          IO.zipRight(IO.service(C.Tag))
        )

      case 'Outline':
        return pipe(

          (IO.collectAllDiscard([
            applyStyle(d.style.color, flow(toCss, C.setStrokeStyle)),
applyStyle(d.style.lineWidth, C.setLineWidth),
C.strokePath(renderShape(d.shape))
          ])
          ),
          C.withContext,
          IO.zipRight(IO.service(C.Tag))
        )

      case 'Rotate':
        return C.withContext(
          pipe(
            C.rotate(d.angle),
            IO.zipRight(go(d.drawing))
          )
        )

      case 'Scale':
        return C.withContext(
          pipe(
            C.scale(d.scaleX, d.scaleY),
            IO.zipRight(go(d.drawing))
          )
        )

      case 'Text':
        return pipe(
          IO.collectAllDiscard([
            C.setFont(showFont.show(d.font)),
            applyStyle(d.style.color, flow(toCss, C.setFillStyle)),
            C.fillText(d.text, d.x, d.y)
          ]),
          C.withContext,
          IO.zipRight(IO.service(C.Tag))
        )

      case 'Translate':
        return C.withContext(
          pipe(
            C.translate(d.translateX, d.translateY),
            IO.zipRight(go(d.drawing)),
          )
        )

      case 'WithShadow':
        return C.withContext(
          pipe(
            IO.collectAllDiscard([
              applyStyle(d.shadow.color, flow(toCss, C.setShadowColor)),
              applyStyle(d.shadow.blur, C.setShadowBlur),
              applyStyle(d.shadow.offset, (o) => pipe(
                C.setShadowOffsetX(o.x),
                IO.zipRight(C.setShadowOffsetY(o.y))
              ))
            ]),
            IO.zipRight(go(d.drawing))
          )
        )
    }
  }

  return go(drawing)
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * Gets a `Monoid` instance for `FillStyle`.
 *
 * @category instances
 * @since 1.0.0
 */
export const monoidFillStyle = M.struct<FillStyle>({
  color: getFirstMonoidColor
})

/**
 * Gets a `Monoid` instance for `OutlineStyle`.
 *
 * @example
 * import * as O from 'fp-ts/lib/Option'
 * import * as M from 'fp-ts/lib/Monoid'
 * import * as Color from 'graphics-ts/lib/Color'
 * import * as D from 'graphics-ts/lib/Drawing'
 *
 * assert.deepStrictEqual(
 *   M.fold(D.monoidOutlineStyle)([
 *     D.outlineColor(Color.black),
 *     D.outlineColor(Color.white),
 *     D.lineWidth(5)
 *   ]),
 *   {
 *     color: O.some(Color.black),
 *     lineWidth: O.some(5)
 *   }
 * )
 *
 * @category instances
 * @since 1.0.0
 */
export const monoidOutlineStyle = M.struct<OutlineStyle>({
  color: getFirstMonoidColor,
  lineWidth: getFirstMonoidNumber
})

/**
 * Gets a `Monoid` instance for `Shadow`.
 *
 * @category instances
 * @since 1.0.0
 */
export const monoidShadow = M.struct<Shadow>({
  color: getFirstMonoidColor,
  blur: getFirstMonoidNumber,
  offset: getFirstMonoidPoint
})

/**
 * Gets a `Monoid` instance for `Drawing`.
 *
 * @category instances
 * @since 1.0.0
 */
export const monoidDrawing: M.Monoid<Drawing> = M.fromSemigroup(
  SG.fromCombine((x, y) =>
    x._tag === 'Many' && y._tag === 'Many'
      ? many(readonlyArrayMonoidDrawing.combineAll([x.drawings, y.drawings]))
      : x._tag === 'Many'
      ? many(readonlyArrayMonoidDrawing.combineAll([x.drawings, [y]]))
      : y._tag === 'Many'
      ? many(readonlyArrayMonoidDrawing.combineAll([[x], y.drawings]))
      : many([x, y])
  ),
  many(readonlyArrayMonoidDrawing.empty)
)
