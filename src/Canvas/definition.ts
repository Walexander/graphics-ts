/**
* These are the Canvas helper types
* @since 2.0.0
*
*/
import { Effect, Context } from 'effect'
const { Tag: Tag$ } = Context
type Effect<R, E, A> = Effect.Effect<R, E, A>

/**
 * Represents the management of a `CanvasRenderingContext2D` as *reading* from the
 * `CanvasRenderingContext2D` and returning either an `A` or an error of type `E`.
 * In other words, we can say that when we are managing a `CanvasRenderingContext2D`
 * we are yielding an `Render` effect.
 *
 * @category model
 * @since 1.0.0
 */
export interface Render<A, E = never, R = unknown> extends Effect<R | CanvasRenderingContext2D, E, A> {}
/**
 * Represents the management of a `CanvasGradient` as *reading* from the `CanvasGradient` and
 * returning a type `A` wrapped in an `IO`. In other words, we can say that when we are managing
 * a `CanvasGradient` we are yielding an `Gradient` effect.
 *
 * @category model
 * @since 1.0.0
 */
export interface Gradient<A> extends Render<A> {}
/**
* Summon a `CanvasGradient` from the environment
* @category tag
* @since 2.0.0
*/
export const GradientTag = Tag$<CanvasGradient>()

/**
 * Represents an error attempting to obtain a valid `CanvasRenderingContext2D`, typically
 * because of some issue with the provided HTMLElement
 *
 * @category model
 * @since 2.0.0
 */
export class CanvasError {
  /** @since 2.0.0 */
  readonly _tag = 'CanvasError'
  constructor(readonly message: string) {}
}
/**
 * Summon a `CanvasRenderingContext2D`
 * @category tag
 * @since 2.0.0
 */
export const Tag = Tag$<CanvasRenderingContext2D>()


/**
 * The effectual operations one can perform against a `CanvasRenderingContext2D`
 *
 * @category model
 * @since 2.0.0
 */
export interface Canvas2d {

  /**
   * Render an arc.
   *
   * @category paths
   * @since 1.0.0
   */
  arc: (
    x: number,
    y: number,
    r: number,
    start: number,
    end: number,
    anticlockwise: boolean
  ) => Effect<never, never, void>
  beginPath: Effect<never, never, void>
  closePath: Effect<never, never, void>
 ellipse: (
    x: number,
    y: number,
    rx: number,
    ry: number,
    rotat: number,
    start: number,
    end: number,
    anticlockwise: boolean
  ) => Effect<never, never, void>

  font: Effect<never, never, string>
  getFont: () => Effect<never, never, string>
  setFont: (font: string) => Effect<never, never, void>

  lineTo: (x: number, y: number) => Effect<never, never, void>
  moveTo: (x: number, y: number) => Effect<never, never, void>
  rect: (x: number, y: number, width: number, height: number) => Effect<never, never, void>
  drawImage: (imageData: ImageSource, sx: number, sy: number) => Effect<never, never, void>
  setFillStyle: (
    style: string | CanvasGradient | CanvasPattern
  ) => Effect<never, never, void>
  stroke: Effect<never, never, void>
}


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
export type ImageSource = HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap

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

