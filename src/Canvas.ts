/**
 * The `Canvas` module contains all the functions necessary to interact with the HTML
 * Canvas API. `graphics-ts` wraps all canvas operations in an `IO<A>` to allow for
 * chaining multiple effectful calls to the HTML Canvas API.
 *
 * For example, taking the example of [drawing a triangle](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes) from the MDN Web Docs, the code
 * without `graphics-ts` looks like this.
 *
 * ```ts
 * const draw = () => {
 *   var canvas = document.getElementById('canvas')
 *
 *   if (canvas.getContext) {
 *     var ctx = canvas.getContext('2d')
 *
 *     ctx.beginPath();
 *     ctx.fillStyle = 'black'
 *     ctx.moveTo(75, 50)
 *     ctx.lineTo(100, 75)
 *     ctx.lineTo(100, 25)
 *     ctx.fill()
 *   }
 * }
 * ```
 *
 * With `graphics-ts`, we can put the individual commands into an array
 * and call IO.collectAllDiscard to generate the effect.  Then we `renderTo(#id)`
 * to provide it with the canvas and, finally, run the effect to a Promise
 *
 * ```ts
 * import { pipe } from '@fp-ts/core/Function'
 * import * as E from '@effect/io/Effect'
 * import * as C from 'graphics-ts/Canvas'
 *
 * const triangle = IO.collectAllDiscard([
 *   C.beginPath,
 *   C.moveTo(75, 50),
 *   C.lineTo(100, 75),
 *   C.lineTo(100, 25),
 *   C.setFillStyle('black'),
 *   C.fill(),
 * ])
 *
 * IO.runPromise(pipe(
 *  triangle,
 *  C.renderTo('canvas'),
 *  IO.catchAll(error => Effect.logError(`Error rendering to #canvas: ${error.message}`))
 * ))
 *
 * ```
 *
 * While this may seem somewhat verbose compared to its non-functional counterpart above,
 * the real power of the `Canvas` module is apparent when it is abstracted away by the
 * `Drawing` module.
 *
 * Adapted from https://github.com/purescript-contrib/purescript-canvas.
 *
 * @since 1.0.0
 */
import * as IO from '@effect/io/Effect'
import * as Layer from '@effect/io/Layer'
import * as O from '@fp-ts/core/Option'
import * as Either from '@fp-ts/core/Either'
import { pipe, flow, constant } from '@fp-ts/core/Function'
import * as RA from '@fp-ts/core/ReadonlyArray'
import * as Context from '@fp-ts/data/Context'

export const Effect = IO
export const Tag: Context.Tag<CanvasRenderingContext2D> = Context.Tag<CanvasRenderingContext2D>()
// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------
/**
 * Represents the management of a `CanvasGradient` as *reading* from the `CanvasGradient` and
 * returning a type `A` wrapped in an `IO`. In other words, we can say that when we are managing
 * a `CanvasGradient` we are yielding an `Gradient` effect.
 *
 * @category model
 * @since 1.0.0
 */
export interface Gradient<A> extends IO.Effect<CanvasGradient, never, A> {}

/**
 * Represents the management of an `HTMLCanvasElement` as *reading* from the `HTMLCanvasElement`
 * and returning an Effect<E, A>. In other words, we can say that when we are
 * managing an `HTMLCanvasElement` we are yielding an `Html` effect.
 *
 * @category model
 * @since 1.0.0
 */
export interface Html<E, A> extends IO.Effect<HTMLCanvasElement, E, A> {}
export const Html: Context.Tag<HTMLCanvasElement> = Context.Tag<HTMLCanvasElement>()

/**
 * Represents the management of a `CanvasRenderingContext2D` as *reading* from the
 * `CanvasRenderingContext2D` and returning either an `A` or an error of type `E`.
 * In other words, we can say that when we are managing a `CanvasRenderingContext2D`
 * we are yielding an `Render` effect.
 *
 * @category model
 * @since 1.0.0
 */
export interface Render<A, E = never, R = unknown> extends IO.Effect<R | CanvasRenderingContext2D, E, A> {}

/**
 * Represents the dimensions of the HTML canvas.
 *
 * @category model
 * @since 1.0.0
 */
export interface CanvasDimensions {
  /**
   * The width of the canvas in CSS pixels.
   */
  readonly width: number

  /**
   * The height of the canvas in CSS pixels.
   */
  readonly height: number
}

/**
 * The algorithm by which to determine if a point is inside or outside the filling region.
 *
 * @see [MDN Web Docs](https://mzl.la/2zaDdNu)
 *
 * @category model
 * @since 1.0.0
 */
export type FillRule = 'evenodd' | 'nonzero'

/**
 * The type of compositing operation to apply when drawing new shapes. Defaults to `source-over`.
 *
 * @see [MDN Web Docs](https://mzl.la/36gbsz7)
 *
 * @category model
 * @since 1.0.0
 */
export type GlobalCompositeOperation =
  | 'color'
  | 'color-burn'
  | 'color-dodge'
  | 'copy'
  | 'darken'
  | 'destination-atop'
  | 'destination-in'
  | 'destination-out'
  | 'destination-over'
  | 'difference'
  | 'exclusion'
  | 'hard-light'
  | 'hue'
  | 'lighten'
  | 'lighter'
  | 'luminosity'
  | 'multiply'
  | 'overlay'
  | 'saturation'
  | 'screen'
  | 'soft-light'
  | 'source-atop'
  | 'source-in'
  | 'source-out'
  | 'source-over'
  | 'xor'

// TODO: remove in version 2.0.0

/**
 * An element to draw into the HTML canvas context.
 *
 * @see [MDN Web Docs](https://mzl.la/3bKwLu6)
 *
 * @category model
 * @since 1.0.0
 */
export type ImageSource = HTMLCanvasElement | HTMLImageElement | HTMLVideoElement

/**
 * The shape used to draw the end points of lines.
 *
 * @see [MDN Web Docs](https://mzl.la/2zOVZtS)
 *
 * @category model
 * @since 1.0.0
 */
export type LineCap = 'butt' | 'round' | 'square'

/**
 * The shape used to draw two line segments where they meet.
 *
 * @see [MDN Web Docs](https://mzl.la/3cMHqFU)
 *
 * @category model
 * @since 1.0.0
 */
export type LineJoin = 'bevel' | 'miter' | 'round'

/**
 * The repetition pattern used to repeat a pattern's image.
 *
 * @see [MDN Web Docs](https://mzl.la/3bN4nHJ)
 *
 * @category model
 * @since 1.0.0
 */
export type PatternRepetition = 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'

/**
 * The text alignment used when drawing text.
 *
 * @see [MDN Web Docs](https://mzl.la/2TkO2TY)
 *
 * @category model
 * @since 1.0.0
 */
export type TextAlign = 'center' | 'end' | 'left' | 'right' | 'start'

/**
 * The text baseline used when drawing text.
 *
 * @see [MDN Web Docs](https://mzl.la/2XG6KH1)
 *
 * @category model
 * @since 1.0.0
 */
export type TextBaseline = 'alphabetic' | 'bottom' | 'hanging' | 'ideographic' | 'middle' | 'top'

/**
 * The dimensions of a piece of text in the canvas.
 *
 * @see [MDN Web Docs](https://mzl.la/3g0OCQG)
 *
 * @category model
 * @since 1.0.0
 */
export interface TextMetrics_ {
  /**
   * The distance from the alignment point given by the `text-align` property to the left side
   * of the bounding rectangle of the given text in CSS pixels.
   */
  readonly actualBoundingBoxLeft: number

  /**
   * The distance from the alignment point given by the `text-align` property to the right side
   * of the bounding rectangle of the given text in CSS pixels.
   */
  readonly actualBoundingBoxRight: number

  /**
   * The distance from the horizontal line indicated by the `text-baseline` attribute to the top
   * of the highest bounding rectangle of all the fonts used to render the text in CSS pixels.
   */
  readonly fontBoundingBoxAscent: number

  /**
   * The distance from the horizontal line indicated by the `text-baseline` attribute to the bottom
   * of the bounding rectangle of all the fonts used to render the text in CSS pixels.
   */
  readonly fontBoundingBoxDescent: number

  /**
   * The distance from the horizontal line indicated by the `text-baseline` attribute to the top
   * of the bounding rectangle used to render the text in CSS pixels.
   */
  readonly actualBoundingBoxAscent: number

  /**
   * The distance from the horizontal line indicated by the `text-baseline` attribute to the bottom
   * of the bounding rectangle used to render the text in CSS pixels.
   */
  readonly actualBoundingBoxDescent: number

  /**
   * The distance from the horizontal line indicated by the `text-baseline` property to the top
   * of the *em* square in the line box in CSS pixels.
   */
  readonly emHeightAscent: number

  /**
   * The distance from the horizontal line indicated by the `text-baseline` property to the bottom
   * of the *em* square in the line box, in CSS pixels.
   */
  readonly emHeightDescent: number

  /**
   * The horizontal line indicated by the `text-baseline` property to the hanging baseline of the
   * line box in CSS pixels.
   */
  readonly hangingBaseline: number

  /**
   * The distance from the horizontal line indicated by the `text-baseline` property to the alphabetic
   * baseline of the line box in CSS pixels.
   */
  readonly alphabeticBaseline: number

  /**
   * The distance from the horizontal line indicated by the `text-baseline` property to the ideographic
   * baseline of the line box in CSS pixels.
   */
  readonly ideographicBaseline: number

  /**
   * The calculated width of a segment of inline text in CSS pixels.
   */
  readonly width: number
}

export function withCanvas<R, E, A>(
  f: (ctx: CanvasRenderingContext2D) => IO.Effect<R, E, A>
): IO.Effect<R | CanvasRenderingContext2D, E, A> {
  return Effect.serviceWithEffect(Tag, f)
}
declare function withGradient<R, E, A>(
  f: (gradient: CanvasGradient) => IO.Effect<R, E, A>
): IO.Effect<R | CanvasGradient, E, A>
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * **[UNSAFE]** Gets a canvas element by id.
 *
 * @category constructors
 * @since 1.0.0
 */
export function unsafeGetCanvasElementById(id: string) {
  return document.getElementById(id) as HTMLCanvasElement
}

/**
 * **[UNSAFE]** Gets the 2D graphics context for a canvas element.
 *
 * @category constructors
 * @since 1.0.0
 */
export const unsafeGetContext2D: (canvas: HTMLCanvasElement) => CanvasRenderingContext2D = (c) =>
  c.getContext('2d') as CanvasRenderingContext2D

export class CanvasError {
  readonly _tag = 'CanvasError'
  constructor(readonly message: string) {}
}
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Gets the 2D graphics context for a canvas element.
 *
 * @category combinators
 * @since 1.0.0
 */
export declare const getContext2D: Html<O.None, HTMLCanvasElement>

const fromOption = flow(O.fromNullable, Effect.fromOption)
export function getContext(element: HTMLCanvasElement) {
  return pipe(
    Effect.sync(() => element.getContext('2d')),
    Effect.flatMap(fromOption),
    Effect.mapError((_) => new CanvasError(`${element.id} is not an instance of HTMLCanvasElement`))
  )
}
/**
 * Gets the canvas width in pixels.
 *
 * @category combinators
 * @since 1.0.0
 */
export const width = withCanvas((ctx) => Effect.sync(() => ctx.canvas.width))
export const getWidth = constant(width)

/**
 * Sets the width of the canvas in pixels.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setWidth(width: number) {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.canvas.width = width
    })
  )
}

/**
 * Gets the canvas height in pixels.
 *
 *  @category combinators
 * @since 1.0.0
 */
export const height = withCanvas((ctx) => Effect.sync(() => ctx.canvas.height))

/**
 * Sets the height of the canvas in pixels.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setHeight(height: number) {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.canvas.height = height
    })
  )
}

/**
 * Gets the dimensions of the canvas in pixels.
 *
 * @category combinators
 * @since 1.0.0
 */
export const dimensions = Effect.struct({
  width,
  height
})

/**
 * Sets the dimensions of the canvas in pixels.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setDimensions(dims: CanvasDimensions) {
  return pipe(
    [setWidth(dims.width), setHeight(dims.height)],
    Effect.collectAllDiscard,
    Effect.zipRight(dimensions)
  )
}

/**
 * Create a data URL for the canvas.
 *
 * @category combinators
 * @since 1.0.0
 */
export const toDataURL = withCanvas((ctx) =>
  Effect.sync(() => ctx.canvas.toDataURL())
)

/**
 * Sets the current fill style for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
  
export const setFillStyle = (style: string | CanvasGradient | CanvasPattern) =>
  withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.fillStyle = style)),
      Effect.as(ctx)
    )
  )

/**
 * Gets the current font.
 *
 * @category combinators
 * @since 1.0.0
 */
export const font = withCanvas((ctx) => Effect.sync(() => ctx.font))
export const getFont = font

/**
 * Sets the current font.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setFont(font: string) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.font = font)),
      Effect.as(ctx)
    )
  )
}

/**
 * Gets the current global alpha.
 *
 * @category combinators
 * @since 1.1.0
 */
export const globalAlpha = withCanvas((ctx) => Effect.sync(() => ctx.globalAlpha))
/**
 * Sets the current global alpha for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setGlobalAlpha(globalAlpha: number) {
  return withCanvas((ctx) => Effect.sync(() => (ctx.globalAlpha = globalAlpha)))
}

/**
 * Gets the current global composite operation type for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export const globalCompositeOperation = withCanvas((ctx) =>
  Effect.sync(() => ctx.globalCompositeOperation)
)

/**
 * Sets the current global composite operation type for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setGlobalCompositeOperation(
  globalCompositeOperation: GlobalCompositeOperation
) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.globalCompositeOperation = globalCompositeOperation)),
      Effect.as(ctx)
    )
  )
}
/**
 * Gets the current image smoothing property for the canvas context. Determines whether scaled images are smoothed
 * (`true`, default) or not (`false`).
 *
 * @category combinators
 * @since 1.1.0
 */

export const imageSmoothingEnabled = withCanvas((ctx) =>
  Effect.sync(() => ctx.imageSmoothingEnabled)
)

/**
 * Sets the current image smoothing property for the canvas context. Determines whether scaled images are smoothed
 * (`true`, default) or not (`false`).
 *
 * @category combinators
 * @since 1.0.0
 */
export function setImageSmoothingEnabled(enable: boolean) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.imageSmoothingEnabled = enable)),
      Effect.as(ctx)
    )
  )
}

/**
 * Sets the current line cap type for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setLineCap(cap: LineCap) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.lineCap = cap)),
      Effect.as(ctx)
    )
  )
}
/**
 * Gets the current line cap type for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export const lineCap = withCanvas((ctx) => pipe(Effect.sync(() => ctx.lineCap)))

/**
 * Sets the current line dash offset, or "phase", for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setLineDashOffset(offset: number) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.lineDashOffset = offset)),
      Effect.as(ctx)
    )
  )
}
/**
 * Gets the current line dash offset, or "phase", for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export const lineDashOffset = withCanvas((ctx) =>
  pipe(Effect.sync(() => ctx.lineDashOffset))
)

/**
 * Sets the current line join type for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setLineJoin(join: LineJoin) {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.lineJoin = join
      return ctx
    })
  )
}
export const lineJoin = withCanvas((ctx) =>
  pipe(Effect.sync(() => ctx.lineJoin))
)

/**
 * Sets the current line width for the canvas context in pixels.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setLineWidth(lineWidth: number) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.lineWidth = lineWidth)),
      Effect.as(ctx)
    )
  )
}
export const lineWidth = withCanvas((ctx) => pipe(Effect.sync(() => ctx.lineWidth)))

/**
 * Sets the current miter limit for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setMiterLimit(miterLimit: number) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.miterLimit = miterLimit)),
      Effect.as(ctx)
    )
  )
}
export const miterLimit = withCanvas((ctx) =>
  pipe(Effect.sync(() => ctx.miterLimit))
)

/**
 * Sets the current shadow blur radius for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setShadowBlur(blur: number) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.shadowBlur = blur)),
      Effect.as(ctx)
    )
  )
}
export const shadowBlur = withCanvas((ctx) =>
  pipe(Effect.sync(() => ctx.shadowBlur))
)

/**
 * Sets the current shadow color for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setShadowColor(color: string) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.shadowColor = color)),
      Effect.as(ctx)
    )
  )
}
export const shadowColor = withCanvas((ctx) =>
  pipe(Effect.sync(() => ctx.shadowColor))
)

/**
 * Sets the current shadow x-offset for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setShadowOffsetX(offsetX: number) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.shadowOffsetX = offsetX)),
      Effect.as(ctx)
    )
  )
}
export const shadowOffsetX = withCanvas((ctx) =>
  pipe(Effect.sync(() => ctx.shadowOffsetX))
)

/**
 * Sets the current shadow y-offset for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setShadowOffsetY(offsetY: number) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.shadowOffsetY = offsetY)),
      Effect.as(ctx)
    )
  )
}
export const shadowOffsetY = withCanvas((ctY) =>
  pipe(Effect.sync(() => ctY.shadowOffsetY))
)

/**
 * Sets the current stroke style for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setStrokeStyle(style: string) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.strokeStyle = style)),
      Effect.as(ctx)
    )
  )
}
export const strokeStyle = withCanvas((ctx) =>
  pipe(Effect.sync(() => ctx.strokeStyle))
)

/**
 * Gets the current text alignment.
 *
 * @category combinators
 * @since 1.0.0
 */
export const textAlign = withCanvas((ctx) => Effect.sync(() => ctx.textAlign))

/**
 * Sets the current text alignment.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setTextAlign(textAlign: TextAlign) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.textAlign = textAlign)),
      Effect.as(ctx)
    )
  )
}

/**
 * Gets the current text baseline.
 *
 * @category combinators
 * @since 1.0.0
 */
export const textBaseline = withCanvas((ctx) =>
  Effect.sync(() => ctx.textBaseline)
)

/**
 * Sets the current text baseline.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setTextBaseline(textBaseline: TextBaseline) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => (ctx.textBaseline = textBaseline)),
      Effect.as(ctx)
    )
  )
}

/**
 * Render an arc.
 *
 * @category combinators
 * @since 1.0.0
 */
export function arc(
  x: number,
  y: number,
  radius: number,
  start: number,
  end: number,
  counterclockwise = false
) {
  return withCanvas((ctx) =>
    pipe(
      Effect.sync(() => ctx.arc(x, y, radius, start, end, counterclockwise)),
      Effect.as(ctx)
    )
  )
}
/**
 * Render an arc that is automatically connected to the path's latest point.
 *
 * @category combinators
 * @since 1.0.0
 */
export function arcTo (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  radius: number
) {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.arcTo(x1, y1, x2, y2, radius)
      return ctx
    })
  )
}
/**
 * Begin a path on the canvas.
 *
 * @category combinators
 * @since 1.0.0
 */
export const beginPath = withCanvas((ctx) =>
  pipe(
    Effect.sync(() => ctx.beginPath()),
    Effect.as(ctx)
  )
)

/**
 * Draw a cubic Bézier curve.
 *
 * @category combinators
 * @since 1.0.0
 */
export function bezierCurveTo(
  cpx1: number,
  cpy1: number,
  cpx2: number,
  cpy2: number,
  x: number,
  y: number
){
  return withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)
      return ctx
    })
  )
}
/**
 * Set the pixels in the specified rectangle back to transparent black.
 *
 * @category combinators
 * @since 1.0.0
 */
export function clearRect(
  x: number,
  y: number,
  width: number,
  height: number
) {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.clearRect(x, y, width, height)
      return ctx
    })
  )
}

/**
 * Clip the current path on the canvas.
 *
 * @category combinators
 * @since 1.0.0
 */
export function clip(fillRule?: FillRule, path?: Path2D)  {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      if (typeof path !== 'undefined') {
        ctx.clip(path, fillRule)
      } else if (typeof fillRule !== 'undefined') {
        ctx.clip(fillRule)
      } else {
        ctx.clip()
      }
      return ctx
    })
  )
}
/**
 * Closes the current canvas path.
 *
 * @category combinators
 * @since 1.0.0
 */
export const closePath =  withCanvas((ctx) =>
  Effect.sync(() => {
    ctx.closePath()
    return ctx
  })
)

/**
 * Gets `ImageData` for the specified rectangle.
 *
 * @category combinators
 * @since 1.0.0
 */
export const createImageData = (sw: number, sh: number) =>
  withCanvas((ctx) => Effect.sync(() => ctx.createImageData(sw, sh)))

/**
 * Creates a copy of an existing `ImageData` object.
 *
 * @category combinators
 * @since 1.0.0
 */
export const createImageDataCopy = (imageData: ImageData) =>
  withCanvas((ctx) => Effect.sync(() => ctx.createImageData(imageData)))

/**
 * Creates a linear `CanvasGradient` object.
 *
 * @category combinators
 * @since 1.0.0
 */
export const createLinearGradient = (
  x0: number,
  y0: number,
  x1: number,
  y1: number
) =>
  withCanvas((ctx) => Effect.sync(() => ctx.createLinearGradient(x0, y0, x1, y1)))

/**
 * Creates a new canvas pattern (repeatable image).
 *
 * @category combinators
 * @since 1.0.0
 */
export const createPattern = (
  source: ImageSource,
  repetition: PatternRepetition
) => withCanvas((ctx) => Effect.sync(() => O.fromNullable(ctx.createPattern(source, repetition))))

/**
 * Creates a radial `CanvasGradient` object.
 *
 * @category combinators
 * @since 1.0.0
 */
export const createRadialGradient= (
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number
) => withCanvas((ctx) => Effect.sync(() => ctx.createRadialGradient(x0, y0, r0, x1, y1, r1)))

/**
 * Draws a focus ring around the current or given path, if the specified element is focused.
 *
 * @category combinators
 * @since 1.0.0
 */
export const drawFocusIfNeeded= (
  element: HTMLElement,
  path2d?: Path2D
) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      if (typeof path2d !== 'undefined') {
        ctx.drawFocusIfNeeded(path2d, element)
      } else {
        ctx.drawFocusIfNeeded(element)
      }
      return ctx
    })
  )

/**
 * Render an image.
 *
 * @category combinators
 * @since 1.0.0
 */
export const drawImage= (
  imageSource: ImageSource,
  offsetX: number,
  offsetY: number
) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.drawImage(imageSource, offsetX, offsetY)
      return ctx
    })
  )

/**
 * Draws an image to the canvas.
 *
 * @category combinators
 * @since 1.0.0
 */
export const drawImageScale = (
  imageSource: ImageSource,
  offsetX: number,
  offsetY: number,
  width: number,
  height: number
) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.drawImage(imageSource, offsetX, offsetY, width, height)
      return ctx
    })
  )

/**
 * Draws an image to the canvas.
 *
 * @category combinators
 * @since 1.0.0
 */
export const drawImageFull: (
  imageSource: ImageSource,
  offsetX: number,
  offsetY: number,
  width: number,
  height: number,
  canvasOffsetX: number,
  canvasOffsetY: number,
  canvasImageWidth: number,
  canvasImageHeight: number
) => Render<CanvasRenderingContext2D> = (s, ox, oy, w, h, cox, coy, ciw, cih) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.drawImage(s, ox, oy, w, h, cox, coy, ciw, cih)
      return ctx
    })
  )

/**
 * Render an ellipse.
 *
 * @category combinators
 * @since 1.0.0
 */
export function ellipse(
  x: number,
  y: number,
  rx: number,
  ry: number,
  rotation: number,
  start: number,
  end: number,
  anticlockwise = false
) {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.ellipse(x, y, rx, ry, rotation, start, end, anticlockwise)
      return ctx
    })
  )
}
/**
 * Fill the current path on the canvas.
 *
 * @category combinators
 * @since 1.0.0
 */
export const fill = (
  f?: FillRule,
  p?: Path2D
) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      if (typeof p !== 'undefined') {
        ctx.fill(p, f)
      } else if (typeof f !== 'undefined') {
        ctx.fill(f)
      } else {
        ctx.fill()
      }
      return ctx
    })
  )

/**
 * Render a filled rectangle.
 *
 * @category combinators
 * @since 1.0.0
 */
export function fillRect(
  x: number,
  y: number,
  width: number,
  height: number
) {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.fillRect(x, y, width, height)
      return ctx
    })
  )
}
/**
 * Render filled text.
 *
 * @category combinators
 * @since 1.0.0
 */
export const fillText= (
  t: string,
  x: number,
  y: number,
  mw?: number
) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      if (typeof mw !== 'undefined') {
        ctx.fillText(t, x, y, mw)
      } else {
        ctx.fillText(t, x, y)
      }
      return ctx
    })
  )

/**
 * Gets the image data for the specified portion of the canvas.
 *
 * @category combinators
 * @since 1.0.0
 */
export function getImageData(
  x: number,
  y: number,
  width: number,
  height: number
) {
  return withCanvas((ctx) => Effect.sync(() => ctx.getImageData(x, y, width, height)))
}

/**
 * Gets the current line dash pattern for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export const lineDash: Render<ReadonlyArray<number>> = withCanvas((ctx) =>
  Effect.sync(() => ctx.getLineDash())
)

/**
 * Gets the current transformation matrix being applied to the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export const getTransform: Render<DOMMatrix> = withCanvas((ctx) =>
  Effect.sync(() => ctx.getTransform())
)

/**
 * Determines if the specified point is contained in the current path.)
 *
 * @category combinators
 * @since 1.0.0
 */
export function isPointInPath(
  x: number,
  y: number,
  fillRule?: FillRule,
  path?: Path2D
): Render<boolean> {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      return typeof path !== 'undefined'
        ? ctx.isPointInPath(path, x, y, fillRule)
        : typeof fillRule !== 'undefined'
        ? ctx.isPointInPath(x, y, fillRule)
        : ctx.isPointInPath(x, y)
    })
  )
}
/**
 * Determines if the specified point is inside the area contained by the stroking of a path.
 *
 * @category combinators
 * @since 1.0.0
 */
export const isPointInStroke: (x: number, y: number, path?: Path2D) => Render<boolean> = (
  x,
  y,
  path
) =>
  withCanvas((ctx) =>
    Effect.sync(() =>
      typeof path !== 'undefined' ? ctx.isPointInStroke(path, x, y) : ctx.isPointInStroke(x, y)
    )
  )
/**
 * Move the canvas path to the specified point while drawing a line segment.
 *
 * @category combinators
 * @since 1.0.0
 */
export const lineTo = (x: number, y: number) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.lineTo(x, y)
      return ctx
    })
  )

/**
 * Get the text measurements for the specified text.
 *
 * @category combinators
 * @since 1.0.0
 */
export const measureText: (text: string) => Render<TextMetrics> = (t) =>
  withCanvas((ctx) => Effect.sync(() => ctx.measureText(t)))

/**
 * Move the canvas path to the specified point without drawing a line segment.
 *
 * @category combinators
 * @since 1.0.0
 */
export function moveTo(x: number, y: number) {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.moveTo(x, y)
      return ctx
    })
  )
}

/**
 * Sets the image data for the specified portion of the canvas.
 *
 * @category combinators
 * @since 1.0.0
 */
export const putImageData= (
  imageData: ImageData,
  dx: number,
  dy: number
) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.putImageData(imageData, dx, dy)
      return ctx
    })
  )

/**
 * Sets the image data for the specified portion of the canvas.
 *
 * @category combinators
 * @since 1.0.0
 */
export const putImageDataFull= (
  data: ImageData,
  dx: number,
  dy: number,
  dirtyX: number,
  dirtyY: number,
  dirtyW: number,
  dirtyH: number
) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.putImageData(data, dx, dy, dirtyX, dirtyY, dirtyW, dirtyH)
      return ctx
    })
  )

/**
 * Draws a quadratic Bézier curve.
 *
 * @category combinators
 * @since 1.0.0
 */
export const quadraticCurveTo= (
  cpx: number,
  cpy: number,
  x: number,
  y: number
) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.quadraticCurveTo(cpx, cpy, x, y)
      return ctx
    })
  )

/**
 * Render a rectangle.
 *
 * @category combinators
 * @since 1.0.0
 */
export function rect(
  x: number,
  y: number,
  width: number,
  height: number
) {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.rect(x, y, width, height)
      return ctx
    })
  )
}
/**
 * Restore the previous canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export const restore = withCanvas((ctx) =>
  Effect.sync(() => {
    ctx.restore()
    return ctx
  })
)

/**
 * Apply rotation to the current canvas context transform.
 *
 * @category combinators
 * @since 1.0.0
 */
export const rotate = (angle: number) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.rotate(angle)
      return ctx
    })
  )

/**
 * Save the current canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export const save = withCanvas((ctx) =>
  Effect.sync(() => {
    ctx.save()
    return ctx
  })
)

/**
 * Apply scale to the current canvas context transform.
 *
 * @category combinators
 * @since 1.0.0
 */
export const scale = (scaleX: number, scaleY: number) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.scale(scaleX, scaleY)
      return ctx
    })
  )

/**
 * Sets the current line dash pattern used when stroking lines.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setLineDash(segments: ReadonlyArray<number>) {
  return withCanvas((ctx) => Effect.sync(() => {
    ctx.setLineDash(RA.copy(segments))
    return ctx
  })
  )
}

/**
 * Resets the current transformation to the identity matrix, and then applies the transform specified
 * to the current canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setTransform(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number
): Render<CanvasRenderingContext2D> {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.setTransform(a, b, c, d, e, f)
      return ctx
    })
  )
}
/**
 * Resets the current transformation to the identity matrix, and then applies the transform specified
 * to the current canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setTransformMatrix(matrix: DOMMatrix): Render<CanvasRenderingContext2D> {
  return withCanvas((ctx) => Effect.sync(() => {
    ctx.setTransform(matrix)
    return ctx
  })
  )
}

/**
 * Stroke the current path on the canvas.
 *
 * @category combinators
 * @since 1.0.0
 */
export function stroke(path?: Path2D) {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      if (typeof path !== 'undefined') {
        ctx.stroke(path)
      } else {
        ctx.stroke()
      }
      return ctx
    })
  )
}

/**
 * Render a stroked rectangle.
 *
 * @category combinators
 * @since 1.0.0
 */
export function strokeRect(x: number, y: number, width: number, height: number) {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.strokeRect(x, y, width, height)
      return ctx
    })
  )
}
/**
 * Render stroked text.
 *
 * @category combinators
 * @since 1.0.0
 */
export function strokeText(
  text: string,
  x: number,
  y: number,
  maxWidth?: number
): Render<CanvasRenderingContext2D> {
  return withCanvas((ctx) =>
    Effect.sync(() => {
      if (typeof maxWidth !== 'undefined') {
        ctx.strokeText(text, x, y, maxWidth)
      } else {
        ctx.strokeText(text, x, y)
      }
      return ctx
    })
  )
}
/**
 * Apply the specified transformation matrix to the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export const transform: (
  m11: number,
  m12: number,
  m21: number,
  m22: number,
  m31: number,
  m32: number
) => Render<CanvasRenderingContext2D> = (m11, m12, m21, m22, m31, m32) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.transform(m11, m12, m21, m22, m31, m32)
      return ctx
    })
  )

/**
 * Translate the current canvas context transform.
 *
 * @category combinators
 * @since 1.0.0
 */
export const translate = (x: number, y: number) =>
  withCanvas((ctx) =>
    Effect.sync(() => {
      ctx.translate(x, y)
      return ctx
    })
  )

/**
 * Add a single color stop to a `CanvasGradient` object.
 *
 * @category combinators
 * @since 1.0.0
 */
export const addColorStop: (offset: number, color: string) => Gradient<CanvasGradient> = (o, c) =>
  withGradient((g) =>
    Effect.sync(() => {
      g.addColorStop(o, c)
      return g
    })
  )

/**
 * Convenience function for drawing a filled path.
 *
 * @category combinators
 * @since 1.0.0
 */
export const fillPath= <R, E, A>(f: Render<A, E, R>): Render<A, E, R> =>
  pipe(beginPath, IO.zipRight(f), IO.zipLeft(fill()))

/**
 * Convenience function for drawing a stroked path.
 *
 * @category combinators
 * @since 1.0.0
 */
export const strokePath = <R, E, A>(f: IO.Effect<R, E, A>) =>
  pipe(beginPath, IO.zipRight(f), IO.zipLeft(stroke()))

/**
 * A convenience function which allows for running an action while preserving the existing
 * canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function withContext<R, E, A>(effect: Render<A,E,R>): Render<A, E, R> {
   const aur =  IO.acquireUseRelease(
      save,
      _ => effect,
      _ => restore
    )
  return IO.scoped(aur)
}
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Executes a `Render` effect for a canvas with the specified `canvas`, or `onCanvasNotFound()` if a canvas with
 * the specified `canvasId` does not exist.
 *
 * @since 1.0.0
 */
export function renderTo(canvas: string | HTMLElement | CanvasRenderingContext2D) {
  const layer =
    typeof canvas == 'string'
      ? fromId(canvas)
      : canvas instanceof HTMLElement
      ? fromElement(canvas)
      : fromCanvas(canvas)
  return <R, E, A>(r: IO.Effect<R, E, A>) => IO.provideSomeLayer(r, layer)
}

/**
 * Executes a `Render` effect for the given canvas
 *
 * @since 1.0.0
 */
export const renderToCanvas =
  (canvas: CanvasRenderingContext2D) => renderTo(canvas)

const isCanvas = flow(
  Either.liftPredicate(
    (element): element is HTMLCanvasElement => element instanceof HTMLCanvasElement,
    () => new CanvasError(`element is not an instance of HTMLCanvasElement`)
  ),
  Effect.fromEither
)

function fromId(id: string): Layer.Layer<never, CanvasError, CanvasRenderingContext2D> {
  return Layer.effect(Tag, getContextById(id))
}
function fromCanvas(
  context2d: CanvasRenderingContext2D
): Layer.Layer<never, CanvasError, CanvasRenderingContext2D> {
  return Layer.succeed(Tag, context2d)
}
function fromElement(
  element: HTMLElement
): Layer.Layer<never, CanvasError, CanvasRenderingContext2D> {
  return Layer.effect(Tag, pipe(isCanvas(element), Effect.flatMap(getContext)))
}
function getContextById(id: string): IO.Effect<never, CanvasError, CanvasRenderingContext2D> {
  return pipe(elementById(id), IO.flatMap(getContext))
}
export function elementById(id: string): IO.Effect<never, CanvasError, HTMLCanvasElement> {
  return pipe(
    Effect.sync(() => document.getElementById(id)),
    Effect.flatMap(fromOption),
    Effect.mapError(() => new CanvasError(`No such element with id ${id} exists`)),
    IO.flatMap(isCanvas)
  )
}
