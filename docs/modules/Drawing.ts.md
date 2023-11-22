---
title: Drawing.ts
nav_order: 11
parent: Modules
---

## Drawing overview

The `Drawing` module abstracts away the repetitive calls to the HTML Canvas API that are required
when using the `Canvas` module directly and instead allows us to be more declarative with our code.

Taking the MDN example from the `Canvas` documentation,

```ts
import { Effect as E, ReadonlyArray as RA } from 'effect'
import { pipe } from '@effect/Function'
import * as Color from 'graphics-ts/lib/Color'
import * as C from 'graphics-ts/Canvas'
import * as S from 'graphics-ts/Shape'

const canvasId = 'canvas'
const triangle = IO.collectAllDiscard([
  C.beginPath,
  C.moveTo(75, 50),
  C.lineTo(100, 75),
  C.lineTo(100, 25),
  C.setFillStyle('black')
  C.fill(),
])
```

the imperative `triangle` above can be expressed as a
`Drawing`

```ts
const triangle = D.render(
  D.fill(S.path(RA.Foldable)([S.point(75, 50), S.point(100, 75), S.point(100, 25)]), D.fillStyle(Color.black))
)
```

Either of these `triangle`s can be rendered by

1. providing a Canvas context via `C.renderTo()`
2. running the resulting effect

```ts
pipe(
  triangle,
  C.renderTo(canvasId),
  IO.catchAll((e) => Effect.logError(`error opening #${canvasId}: ${e.message}`)),
  IO.runPromise
)
```

Adapted from https://github.com/purescript-contrib/purescript-drawing

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [renderShape](#rendershape)
- [constructors](#constructors)
  - [clipped](#clipped)
  - [combine](#combine)
  - [combineAll](#combineall)
  - [fill](#fill)
  - [fillStyle](#fillstyle)
  - [image](#image)
  - [lineWidth](#linewidth)
  - [many](#many)
  - [outline](#outline)
  - [outlineColor](#outlinecolor)
  - [rotate](#rotate)
  - [scale](#scale)
  - [shadowBlur](#shadowblur)
  - [shadowColor](#shadowcolor)
  - [shadowOffset](#shadowoffset)
  - [text](#text)
  - [translate](#translate)
  - [withShadow](#withshadow)
- [destructors](#destructors)
  - [draw](#draw)
  - [render](#render)
- [instances](#instances)
  - [monoidDrawing](#monoiddrawing)
  - [monoidFillStyle](#monoidfillstyle)
  - [monoidOutlineStyle](#monoidoutlinestyle)
  - [monoidShadow](#monoidshadow)
- [model](#model)
  - [Clipped (interface)](#clipped-interface)
  - [Drawing (type alias)](#drawing-type-alias)
  - [Fill (interface)](#fill-interface)
  - [FillStyle (interface)](#fillstyle-interface)
  - [Image (interface)](#image-interface)
  - [Many (interface)](#many-interface)
  - [Outline (interface)](#outline-interface)
  - [OutlineStyle (interface)](#outlinestyle-interface)
  - [Rotate (interface)](#rotate-interface)
  - [Scale (interface)](#scale-interface)
  - [Shadow (interface)](#shadow-interface)
  - [Text (interface)](#text-interface)
  - [Translate (interface)](#translate-interface)
  - [WithShadow (interface)](#withshadow-interface)

---

# combinators

## renderShape

Renders a `Shape`.

**Signature**

```ts
export declare const renderShape: (shape: Shape) => IO.Effect<Drawable<Shape>, never, void>
```

Added in v1.1.0

# constructors

## clipped

Clips a `Drawing` using the specified `Shape`.

**Signature**

```ts
export declare const clipped: (shape: Shape) => (drawing: Drawing) => Drawing
```

Added in v1.0.0

## combine

Combine two drawings together

**Signature**

```ts
export declare const combine: (self: Drawing, that: Drawing) => Drawing
```

Added in v1.0.0

## combineAll

Collect an Iterable of Drawings into one bigger shape

**Signature**

```ts
export declare const combineAll: (collection: Iterable<Drawing>) => Drawing
```

Added in v1.0.0

## fill

Constructs a `Drawing` from a `Fill` `Shape`.

**Signature**

```ts
export declare const fill: { (shape: Shape, style: FillStyle): Drawing; (style: FillStyle): (shape: Shape) => Drawing }
```

Added in v1.0.0

## fillStyle

Constructs a `FillStyle`.

**Signature**

```ts
export declare const fillStyle: (color: Color) => FillStyle
```

Added in v1.0.0

## image

Constructs an image `Shape`

**Signature**

```ts
export declare const image: (image: ImageSource, source: Point, dest?: Point | undefined) => Drawing
```

Added in v2.0.0

## lineWidth

Constructs an `OutlineStyle` from a line width.

**Signature**

```ts
export declare const lineWidth: (lineWidth: number) => OutlineStyle
```

Added in v1.0.0

## many

Construct a single `Drawing` from a collection of `Many` `Drawing`s.

**Signature**

```ts
export declare const many: (drawings: ReadonlyArray<Drawing>) => Drawing
```

Added in v1.0.0

## outline

Constructs a `Drawing` from an `Outline` `Shape`.

**Signature**

```ts
export declare const outline: {
  (shape: Shape, style: OutlineStyle): Drawing
  (style: OutlineStyle): (shape: Shape) => Drawing
}
```

Added in v1.0.0

## outlineColor

Constructs an `OutlineStyle` from a `Color`.

**Signature**

```ts
export declare const outlineColor: (color: Color) => OutlineStyle
```

Added in v1.0.0

## rotate

Applies rotation to the transform of a `Drawing`.

**Signature**

```ts
export declare const rotate: {
  (drawing: Drawing, angle: number): Drawing
  (angle: number): (drawing: Drawing) => Drawing
}
```

Added in v1.0.0

## scale

Applies scale to the transform of a `Drawing`.

**Signature**

```ts
export declare const scale: {
  (drawing: Drawing, scaleX: number, scaleY: number): Drawing
  (scaleX: number, scaleY: number): (drawing: Drawing) => Drawing
}
```

Added in v1.0.0

## shadowBlur

Constructs a `Shadow` from a blur radius.

**Signature**

```ts
export declare const shadowBlur: (blurRadius: number) => Shadow
```

Added in v1.0.0

## shadowColor

Constructs a `Shadow` from a `Color`.

**Signature**

```ts
export declare const shadowColor: (color: Color) => Shadow
```

Added in v1.0.0

## shadowOffset

Constructs a `Shadow` from an offset `Point`.

**Signature**

```ts
export declare const shadowOffset: (offsetPoint: Point) => Shadow
```

Added in v1.0.0

## text

Constructs a `Drawing` from `Text`.

**Signature**

```ts
export declare const text: (font: Font, x: number, y: number, style: FillStyle, text: string) => Drawing
```

Added in v1.0.0

## translate

Applies translation to the transform of a `Drawing`.

**Signature**

```ts
export declare const translate: {
  (drawing: Drawing, translateX: number, translateY: number): Drawing
  (translateX: number, translateY: number): (drawing: Drawing) => Drawing
}
```

Added in v1.0.0

## withShadow

Applies `Shadow` to a `Drawing`.

**Signature**

```ts
export declare const withShadow: {
  (drawing: Drawing, shadow: Shadow): Drawing
  (shadow: Shadow): (drawing: Drawing) => Drawing
}
```

Added in v1.0.0

# destructors

## draw

Renders a `Drawing` to a CanvasRenderingContext2D using live instances of the
Drawable<SHape> and Drawable<Drawing>.

**Signature**

```ts
export declare const draw: typeof drawsDrawing
```

Added in v1.0.0

## render

Renders a `Drawing`.

**Signature**

```ts
export declare const render: (drawing: Drawing) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

# instances

## monoidDrawing

Gets a `Monoid` instance for `Drawing`.

**Signature**

```ts
export declare const monoidDrawing: M.Monoid<Drawing>
```

Added in v1.0.0

## monoidFillStyle

Gets a `Monoid` instance for `FillStyle`.

**Signature**

```ts
export declare const monoidFillStyle: M.Monoid<FillStyle>
```

Added in v1.0.0

## monoidOutlineStyle

Gets a `Monoid` instance for `OutlineStyle`.

import \* as D from 'graphics-ts/Drawing'
D.monoidOutlineStyle.combineAll([])

**Signature**

```ts
export declare const monoidOutlineStyle: M.Monoid<OutlineStyle>
```

Added in v1.0.0

## monoidShadow

Gets a `Monoid` instance for `Shadow`.

**Signature**

```ts
export declare const monoidShadow: M.Monoid<Shadow>
```

Added in v1.0.0

# model

## Clipped (interface)

Represents a `Drawing` that has been clipped by a `Shape`.

**Signature**

```ts
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
```

Added in v1.0.0

## Drawing (type alias)

Represents a shape that can be drawn to the canvas.

**Signature**

```ts
export type Drawing = Clipped | Fill | Outline | Many | Rotate | Scale | Text | Translate | WithShadow | Image
```

Added in v1.0.0

## Fill (interface)

Represents a filled `Shape` that can be drawn to the canvas.

**Signature**

```ts
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
```

Added in v1.0.0

## FillStyle (interface)

Represents the styles applied to a filled `Shape`.

**Signature**

```ts
export interface FillStyle {
  /**
   * The fill color.
   */
  readonly color: O.Option<Color>
}
```

Added in v1.0.0

## Image (interface)

Represents an `ImageSource` with a top-left corner at `x` and `y`,
a width and a height

**Signature**

```ts
export interface Image {
  readonly _tag: 'Image'

  /**
   * The position of the top-left corner on the x-axis.
   */
  readonly source: Point
  /**
   * The position of the top-left corner on the x-axis
   * of the source image
   */
  readonly dest?: Point
  /**
   * The source of the image data
   */
  readonly image: ImageSource
}
```

Added in v2.0.0

## Many (interface)

Represents a collection of `Drawing`s that can be drawn to the canvas.

**Signature**

```ts
export interface Many {
  readonly _tag: 'Many'

  /**
   * The collection of drawings.
   */
  readonly drawings: ReadonlyArray<Drawing>
}
```

Added in v1.0.0

## Outline (interface)

Represents an outlined `Shape` that can be drawn to the canvas.

**Signature**

```ts
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
```

Added in v1.0.0

## OutlineStyle (interface)

Represents the styles applied to an outlined `Shape`.

**Signature**

```ts
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
```

Added in v1.0.0

## Rotate (interface)

Represents a `Drawing` that has had its transform rotated.

**Signature**

```ts
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
```

Added in v1.0.0

## Scale (interface)

Represents a `Drawing` that has had scale applied to its transform.

**Signature**

```ts
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
```

Added in v1.0.0

## Shadow (interface)

Represents the shadow styles applied to a `Shape`.

**Signature**

```ts
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
```

Added in v1.0.0

## Text (interface)

Represents text that can be drawn to the canvas.

**Signature**

```ts
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
```

Added in v1.0.0

## Translate (interface)

Represents a `Drawing` that has had its transform translated.

**Signature**

```ts
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
```

Added in v1.0.0

## WithShadow (interface)

Represents a `Drawing` that has had a shadow applied to it.

**Signature**

```ts
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
```

Added in v1.0.0
