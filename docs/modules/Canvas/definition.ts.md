---
title: Canvas/definition.ts
nav_order: 2
parent: Modules
---

## definition overview

These are the Canvas helper types

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [model](#model)
  - [Canvas2d (interface)](#canvas2d-interface)
  - [CanvasDimensions (interface)](#canvasdimensions-interface)
  - [CanvasError (class)](#canvaserror-class)
    - [\_tag (property)](#_tag-property)
  - [FillRule (type alias)](#fillrule-type-alias)
  - [GlobalCompositeOperation (type alias)](#globalcompositeoperation-type-alias)
  - [Gradient (interface)](#gradient-interface)
  - [ImageSource (type alias)](#imagesource-type-alias)
  - [LineCap (type alias)](#linecap-type-alias)
  - [LineJoin (type alias)](#linejoin-type-alias)
  - [PatternRepetition (type alias)](#patternrepetition-type-alias)
  - [Render (interface)](#render-interface)
  - [TextAlign (type alias)](#textalign-type-alias)
  - [TextBaseline (type alias)](#textbaseline-type-alias)
  - [TextMetrics\_ (interface)](#textmetrics_-interface)
- [tag](#tag)
  - [Tag](#tag)

---

# model

## Canvas2d (interface)

The effectual operations one can perform against a `CanvasRenderingContext2D`

**Signature**

```ts
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
  setFillStyle: (style: string | CanvasGradient | CanvasPattern) => Effect<never, never, void>
  stroke: Effect<never, never, void>
}
```

Added in v2.0.0

## CanvasDimensions (interface)

Represents the dimensions of the HTML canvas.

**Signature**

```ts
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
```

Added in v1.0.0

## CanvasError (class)

Represents an error attempting to obtain a valid `CanvasRenderingContext2D`, typically
because of some issue with the provided HTMLElement

**Signature**

```ts
export declare class CanvasError {
  constructor(readonly message: string)
}
```

Added in v2.0.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "CanvasError"
```

Added in v2.0.0

## FillRule (type alias)

The algorithm by which to determine if a point is inside or outside the filling region.

**Signature**

```ts
export type FillRule = 'evenodd' | 'nonzero'
```

Added in v1.0.0

## GlobalCompositeOperation (type alias)

The type of compositing operation to apply when drawing new shapes. Defaults to `source-over`.

**Signature**

```ts
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
```

Added in v1.0.0

## Gradient (interface)

Represents the management of a `CanvasGradient` as _reading_ from the `CanvasGradient` and
returning a type `A` wrapped in an `IO`. In other words, we can say that when we are managing
a `CanvasGradient` we are yielding an `Gradient` effect.

**Signature**

```ts
export interface Gradient<A> extends Render<A> {}
```

Added in v1.0.0

## ImageSource (type alias)

An element to draw into the HTML canvas context.

**Signature**

```ts
export type ImageSource = HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap
```

Added in v1.0.0

## LineCap (type alias)

The shape used to draw the end points of lines.

**Signature**

```ts
export type LineCap = 'butt' | 'round' | 'square'
```

Added in v1.0.0

## LineJoin (type alias)

The shape used to draw two line segments where they meet.

**Signature**

```ts
export type LineJoin = 'bevel' | 'miter' | 'round'
```

Added in v1.0.0

## PatternRepetition (type alias)

The repetition pattern used to repeat a pattern's image.

**Signature**

```ts
export type PatternRepetition = 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
```

Added in v1.0.0

## Render (interface)

Represents the management of a `CanvasRenderingContext2D` as _reading_ from the
`CanvasRenderingContext2D` and returning either an `A` or an error of type `E`.
In other words, we can say that when we are managing a `CanvasRenderingContext2D`
we are yielding an `Render` effect.

**Signature**

```ts
export interface Render<A, E = never, R = unknown> extends Effect<R | CanvasRenderingContext2D, E, A> {}
```

Added in v1.0.0

## TextAlign (type alias)

The text alignment used when drawing text.

**Signature**

```ts
export type TextAlign = 'center' | 'end' | 'left' | 'right' | 'start'
```

Added in v1.0.0

## TextBaseline (type alias)

The text baseline used when drawing text.

**Signature**

```ts
export type TextBaseline = 'alphabetic' | 'bottom' | 'hanging' | 'ideographic' | 'middle' | 'top'
```

Added in v1.0.0

## TextMetrics\_ (interface)

The dimensions of a piece of text in the canvas.

**Signature**

```ts
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
```

Added in v1.0.0

# tag

## Tag

Summon a `CanvasRenderingContext2D`

**Signature**

```ts
export declare const Tag: Tag$<CanvasRenderingContext2D>
```

Added in v2.0.0
