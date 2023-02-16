---
title: Canvas/operations.ts
nav_order: 4
parent: Modules
---

## operations overview

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [addColorStop](#addcolorstop)
  - [arc](#arc)
  - [arcTo](#arcto)
  - [beginPath](#beginpath)
  - [bezierCurveTo](#beziercurveto)
  - [clearRect](#clearrect)
  - [clip](#clip)
  - [closePath](#closepath)
  - [createImageData](#createimagedata)
  - [createImageDataCopy](#createimagedatacopy)
  - [createLinearGradient](#createlineargradient)
  - [createPattern](#createpattern)
  - [createRadialGradient](#createradialgradient)
  - [dimensions](#dimensions)
  - [drawFocusIfNeeded](#drawfocusifneeded)
  - [drawImage](#drawimage)
  - [drawImageFull](#drawimagefull)
  - [drawImageScale](#drawimagescale)
  - [ellipse](#ellipse)
  - [fill](#fill)
  - [fillPath](#fillpath)
  - [fillRect](#fillrect)
  - [fillText](#filltext)
  - [font](#font)
  - [getHeight](#getheight)
  - [getImageData](#getimagedata)
  - [getLineJoin](#getlinejoin)
  - [getTransform](#gettransform)
  - [getWidth](#getwidth)
  - [globalAlpha](#globalalpha)
  - [globalCompositeOperation](#globalcompositeoperation)
  - [height](#height)
  - [imageSmoothingEnabled](#imagesmoothingenabled)
  - [isPointInPath](#ispointinpath)
  - [isPointInStroke](#ispointinstroke)
  - [lineCap](#linecap)
  - [lineDash](#linedash)
  - [lineDashOffset](#linedashoffset)
  - [lineJoin](#linejoin)
  - [lineTo](#lineto)
  - [measureText](#measuretext)
  - [miterLimit](#miterlimit)
  - [moveTo](#moveto)
  - [putImageData](#putimagedata)
  - [putImageDataFull](#putimagedatafull)
  - [quadraticCurveTo](#quadraticcurveto)
  - [rect](#rect)
  - [restore](#restore)
  - [rotate](#rotate)
  - [save](#save)
  - [scale](#scale)
  - [setDimensions](#setdimensions)
  - [setFillStyle](#setfillstyle)
  - [setFont](#setfont)
  - [setGlobalAlpha](#setglobalalpha)
  - [setGlobalCompositeOperation](#setglobalcompositeoperation)
  - [setHeight](#setheight)
  - [setImageSmoothingEnabled](#setimagesmoothingenabled)
  - [setLineCap](#setlinecap)
  - [setLineDash](#setlinedash)
  - [setLineDashOffset](#setlinedashoffset)
  - [setLineJoin](#setlinejoin)
  - [setLineWidth](#setlinewidth)
  - [setMiterLimit](#setmiterlimit)
  - [setShadowBlur](#setshadowblur)
  - [setShadowColor](#setshadowcolor)
  - [setShadowOffsetX](#setshadowoffsetx)
  - [setShadowOffsetY](#setshadowoffsety)
  - [setStrokeStyle](#setstrokestyle)
  - [setTextAlign](#settextalign)
  - [setTextBaseline](#settextbaseline)
  - [setTransform](#settransform)
  - [setTransformMatrix](#settransformmatrix)
  - [setWidth](#setwidth)
  - [shadowBlur](#shadowblur)
  - [stroke](#stroke)
  - [strokePath](#strokepath)
  - [strokeRect](#strokerect)
  - [strokeText](#stroketext)
  - [textAlign](#textalign)
  - [textBaseline](#textbaseline)
  - [toDataURL](#todataurl)
  - [transform](#transform)
  - [translate](#translate)
  - [width](#width)
  - [withContext](#withcontext)
- [utils](#utils)
  - [getFont](#getfont)
  - [getMiterLimit](#getmiterlimit)
  - [getShadowBlur](#getshadowblur)
  - [getShadowColor](#getshadowcolor)
  - [lineWidth](#linewidth)
  - [shadowColor](#shadowcolor)
  - [shadowOffsetX](#shadowoffsetx)
  - [shadowOffsetY](#shadowoffsety)
  - [strokeStyle](#strokestyle)

---

# combinators

## addColorStop

Add a single color stop to a `CanvasGradient` object.

**Signature**

```ts
export declare const addColorStop: (offset: number, color: string) => Gradient<CanvasGradient>
```

Added in v1.0.0

## arc

Render an arc.

**Signature**

```ts
export declare function arc(x: number, y: number, radius: number, start: number, end: number, counterclockwise = false)
```

Added in v1.0.0

## arcTo

Render an arc that is automatically connected to the path's latest point.

**Signature**

```ts
export declare function arcTo(x1: number, y1: number, x2: number, y2: number, radius: number)
```

Added in v1.0.0

## beginPath

Begin a path on the canvas.

**Signature**

```ts
export declare const beginPath: IO.Effect<CanvasRenderingContext2D, never, CanvasRenderingContext2D>
```

Added in v1.0.0

## bezierCurveTo

Draw a cubic Bézier curve.

**Signature**

```ts
export declare function bezierCurveTo(
  cpx1: number,
  cpy1: number,
  cpx2: number,
  cpy2: number,
  x: number,
  y: number

```

Added in v1.0.0

## clearRect

Set the pixels in the specified rectangle back to transparent black.

**Signature**

```ts
export declare function clearRect(x: number, y: number, width: number, height: number)
```

Added in v1.0.0

## clip

Clip the current path on the canvas.

**Signature**

```ts
export declare function clip(fillRule?: FillRule, path?: Path2D)
```

Added in v1.0.0

## closePath

Closes the current canvas path.

**Signature**

```ts
export declare const closePath: IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## createImageData

Gets `ImageData` for the specified rectangle.

**Signature**

```ts
export declare const createImageData: (sw: number, sh: number) => IO.Effect<CanvasRenderingContext2D, never, ImageData>
```

Added in v1.0.0

## createImageDataCopy

Creates a copy of an existing `ImageData` object.

**Signature**

```ts
export declare const createImageDataCopy: (
  imageData: ImageData
) => IO.Effect<CanvasRenderingContext2D, never, ImageData>
```

Added in v1.0.0

## createLinearGradient

Creates a linear `CanvasGradient` object.

**Signature**

```ts
export declare const createLinearGradient: (
  x0: number,
  y0: number,
  x1: number,
  y1: number
) => IO.Effect<CanvasRenderingContext2D, never, CanvasGradient>
```

Added in v1.0.0

## createPattern

Creates a new canvas pattern (repeatable image).

**Signature**

```ts
export declare const createPattern: (
  source: ImageSource,
  repetition: PatternRepetition
) => IO.Effect<CanvasRenderingContext2D, never, Option<CanvasPattern>>
```

Added in v1.0.0

## createRadialGradient

Creates a radial `CanvasGradient` object.

**Signature**

```ts
export declare const createRadialGradient: (
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number
) => IO.Effect<CanvasRenderingContext2D, never, CanvasGradient>
```

Added in v1.0.0

## dimensions

Gets the dimensions of the canvas in pixels.

**Signature**

```ts
export declare const dimensions: IO.Effect<CanvasRenderingContext2D, never, CanvasDimensions>
```

Added in v1.0.0

## drawFocusIfNeeded

Draws a focus ring around the current or given path, if the specified element is focused.

**Signature**

```ts
export declare const drawFocusIfNeeded: (
  element: HTMLElement,
  path2d?: Path2D | undefined
) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## drawImage

Render an image.

**Signature**

```ts
export declare const drawImage: (
  imageSource: ImageSource,
  offsetX: number,
  offsetY: number
) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## drawImageFull

Draws an image to the canvas.

**Signature**

```ts
export declare const drawImageFull: (
  imageSource: ImageSource,
  offsetX: number,
  offsetY: number,
  width: number,
  height: number,
  canvasOffsetX: number,
  canvasOffsetY: number,
  canvasImageWidth: number,
  canvasImageHeight: number
) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## drawImageScale

Draws an image to the canvas.

**Signature**

```ts
export declare const drawImageScale: (
  imageSource: ImageSource,
  offsetX: number,
  offsetY: number,
  width: number,
  height: number
) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## ellipse

Render an ellipse.

**Signature**

```ts
export declare function ellipse(
  x: number,
  y: number,
  rx: number,
  ry: number,
  rotation: number,
  start: number,
  end: number,
  anticlockwise = false
)
```

Added in v1.0.0

## fill

Fill the current path on the canvas.

**Signature**

```ts
export declare const fill: (
  f?: 'evenodd' | 'nonzero' | undefined,
  p?: Path2D | undefined
) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## fillPath

Convenience function for drawing a filled path.

**Signature**

```ts
export declare const fillPath: <R, E, A>(f: Render<A, E, R>) => Render<A, E, R>
```

Added in v1.0.0

## fillRect

Render a filled rectangle.

**Signature**

```ts
export declare function fillRect(x: number, y: number, width: number, height: number)
```

Added in v1.0.0

## fillText

Render filled text.

**Signature**

```ts
export declare const fillText: (
  t: string,
  x: number,
  y: number,
  mw?: number | undefined
) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## font

Gets the current font.

**Signature**

```ts
export declare const font: IO.Effect<CanvasRenderingContext2D, never, string>
```

Added in v1.0.0

## getHeight

**Signature**

```ts
export declare const getHeight: LazyArg<IO.Effect<CanvasRenderingContext2D, never, number>>
```

Added in v1.0.0

## getImageData

Gets the image data for the specified portion of the canvas.

**Signature**

```ts
export declare function getImageData(x: number, y: number, width: number, height: number)
```

Added in v1.0.0

## getLineJoin

**Signature**

```ts
export declare const getLineJoin: LazyArg<IO.Effect<CanvasRenderingContext2D, never, CanvasLineJoin>>
```

Added in v1.0.0

## getTransform

Gets the current transformation matrix being applied to the canvas context.

**Signature**

```ts
export declare const getTransform: IO.Effect<CanvasRenderingContext2D, never, DOMMatrix>
```

Added in v1.0.0

## getWidth

**Signature**

```ts
export declare const getWidth: LazyArg<IO.Effect<CanvasRenderingContext2D, never, number>>
```

Added in v1.0.0

## globalAlpha

Gets the current global alpha.

**Signature**

```ts
export declare const globalAlpha: IO.Effect<CanvasRenderingContext2D, never, number>
```

Added in v1.1.0

## globalCompositeOperation

Gets the current global composite operation type for the canvas context.

**Signature**

```ts
export declare const globalCompositeOperation: IO.Effect<CanvasRenderingContext2D, never, string>
```

Added in v1.0.0

## height

Gets the canvas height in pixels.

**Signature**

```ts
export declare const height: IO.Effect<CanvasRenderingContext2D, never, number>
```

Added in v1.0.0

## imageSmoothingEnabled

Gets the current image smoothing property for the canvas context. Determines whether scaled images are smoothed
(`true`, default) or not (`false`).

**Signature**

```ts
export declare const imageSmoothingEnabled: IO.Effect<CanvasRenderingContext2D, never, boolean>
```

Added in v1.1.0

## isPointInPath

Determines if the specified point is contained in the current path.)

**Signature**

```ts
export declare function isPointInPath(x: number, y: number, fillRule?: FillRule, path?: Path2D)
```

Added in v1.0.0

## isPointInStroke

Determines if the specified point is inside the area contained by the stroking of a path.

**Signature**

```ts
export declare const isPointInStroke: (
  x: number,
  y: number,
  path?: Path2D | undefined
) => IO.Effect<CanvasRenderingContext2D, never, boolean>
```

Added in v1.0.0

## lineCap

Gets the current line cap type for the canvas context.

**Signature**

```ts
export declare const lineCap: IO.Effect<CanvasRenderingContext2D, never, CanvasLineCap>
```

Added in v1.0.0

## lineDash

Gets the current line dash pattern for the canvas context.

**Signature**

```ts
export declare const lineDash: IO.Effect<CanvasRenderingContext2D, never, number[]>
```

Added in v1.0.0

## lineDashOffset

Gets the current line dash offset, or "phase", for the canvas context.

**Signature**

```ts
export declare const lineDashOffset: IO.Effect<CanvasRenderingContext2D, never, number>
```

Added in v1.0.0

## lineJoin

gets the current line join type for the canvas context.

**Signature**

```ts
export declare const lineJoin: IO.Effect<CanvasRenderingContext2D, never, CanvasLineJoin>
```

Added in v2.0.0

## lineTo

Move the canvas path to the specified point while drawing a line segment.

**Signature**

```ts
export declare const lineTo: (x: number, y: number) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## measureText

Get the text measurements for the specified text.

**Signature**

```ts
export declare const measureText: (text: string) => IO.Effect<CanvasRenderingContext2D, never, TextMetrics>
```

Added in v1.0.0

## miterLimit

Gets the current miter limit for the canvas context.

**Signature**

```ts
export declare const miterLimit: IO.Effect<CanvasRenderingContext2D, never, number>
```

Added in v2.0.0

## moveTo

Move the canvas path to the specified point without drawing a line segment.

**Signature**

```ts
export declare function moveTo(x: number, y: number)
```

Added in v1.0.0

## putImageData

Sets the image data for the specified portion of the canvas.

**Signature**

```ts
export declare const putImageData: (
  imageData: ImageData,
  dx: number,
  dy: number
) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## putImageDataFull

Sets the image data for the specified portion of the canvas.

**Signature**

```ts
export declare const putImageDataFull: (
  data: ImageData,
  dx: number,
  dy: number,
  dirtyX: number,
  dirtyY: number,
  dirtyW: number,
  dirtyH: number
) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## quadraticCurveTo

Draws a quadratic Bézier curve.

**Signature**

```ts
export declare const quadraticCurveTo: (
  cpx: number,
  cpy: number,
  x: number,
  y: number
) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## rect

Render a rectangle.

**Signature**

```ts
export declare function rect(x: number, y: number, width: number, height: number)
```

Added in v1.0.0

## restore

Restore the previous canvas context.

**Signature**

```ts
export declare const restore: IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## rotate

Apply rotation to the current canvas context transform.

**Signature**

```ts
export declare const rotate: (angle: number) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## save

Save the current canvas context.

**Signature**

```ts
export declare const save: IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## scale

Apply scale to the current canvas context transform.

**Signature**

```ts
export declare const scale: (scaleX: number, scaleY: number) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## setDimensions

Sets the dimensions of the canvas in pixels.

**Signature**

```ts
export declare function setDimensions(dims: CanvasDimensions)
```

Added in v1.0.0

## setFillStyle

Sets the current fill style for the canvas context.

**Signature**

```ts
export declare const setFillStyle: (
  style: string | CanvasGradient | CanvasPattern
) => Effect<CanvasRenderingContext2D, never, CanvasRenderingContext2D>
```

Added in v1.0.0

## setFont

Sets the current font.

**Signature**

```ts
export declare function setFont(font: string)
```

Added in v1.0.0

## setGlobalAlpha

Sets the current global alpha for the canvas context.

**Signature**

```ts
export declare function setGlobalAlpha(globalAlpha: number)
```

Added in v1.0.0

## setGlobalCompositeOperation

Sets the current global composite operation type for the canvas context.

**Signature**

```ts
export declare function setGlobalCompositeOperation(globalCompositeOperation: GlobalCompositeOperation)
```

Added in v1.0.0

## setHeight

Sets the height of the canvas in pixels.

**Signature**

```ts
export declare function setHeight(height: number)
```

Added in v1.0.0

## setImageSmoothingEnabled

Sets the current image smoothing property for the canvas context. Determines whether scaled images are smoothed
(`true`, default) or not (`false`).

**Signature**

```ts
export declare function setImageSmoothingEnabled(enable: boolean)
```

Added in v1.0.0

## setLineCap

Sets the current line cap type for the canvas context.

**Signature**

```ts
export declare function setLineCap(cap: LineCap)
```

Added in v1.0.0

## setLineDash

Sets the current line dash pattern used when stroking lines.

**Signature**

```ts
export declare function setLineDash(segments: ReadonlyArray<number>)
```

Added in v1.0.0

## setLineDashOffset

Sets the current line dash offset, or "phase", for the canvas context.

**Signature**

```ts
export declare function setLineDashOffset(offset: number)
```

Added in v1.0.0

## setLineJoin

Sets the current line join type for the canvas context.

**Signature**

```ts
export declare function setLineJoin(join: LineJoin)
```

Added in v1.0.0

## setLineWidth

Sets the current line width for the canvas context in pixels.

**Signature**

```ts
export declare function setLineWidth(lineWidth: number)
```

Added in v1.0.0

## setMiterLimit

Sets the current miter limit for the canvas context.

**Signature**

```ts
export declare function setMiterLimit(miterLimit: number)
```

Added in v1.0.0

## setShadowBlur

Sets the current shadow blur radius for the canvas context.

**Signature**

```ts
export declare function setShadowBlur(blur: number)
```

Added in v1.0.0

## setShadowColor

Sets the current shadow color for the canvas context.

**Signature**

```ts
export declare function setShadowColor(color: string)
```

Added in v1.0.0

## setShadowOffsetX

Sets the current shadow x-offset for the canvas context.

**Signature**

```ts
export declare function setShadowOffsetX(offsetX: number)
```

Added in v1.0.0

## setShadowOffsetY

Sets the current shadow y-offset for the canvas context.

**Signature**

```ts
export declare function setShadowOffsetY(offsetY: number)
```

Added in v1.0.0

## setStrokeStyle

Sets the current stroke style for the canvas context.

**Signature**

```ts
export declare function setStrokeStyle(style: string)
```

Added in v1.0.0

## setTextAlign

Sets the current text alignment.

**Signature**

```ts
export declare function setTextAlign(textAlign: TextAlign)
```

Added in v1.0.0

## setTextBaseline

Sets the current text baseline.

**Signature**

```ts
export declare function setTextBaseline(textBaseline: TextBaseline)
```

Added in v1.0.0

## setTransform

Resets the current transformation to the identity matrix, and then applies the transform specified
to the current canvas context.

**Signature**

```ts
export declare function setTransform(a: number, b: number, c: number, d: number, e: number, f: number)
```

Added in v1.0.0

## setTransformMatrix

Resets the current transformation to the identity matrix, and then applies the transform specified
to the current canvas context.

**Signature**

```ts
export declare function setTransformMatrix(matrix: DOMMatrix)
```

Added in v1.0.0

## setWidth

Sets the width of the canvas in pixels.

**Signature**

```ts
export declare function setWidth(width: number)
```

Added in v1.0.0

## shadowBlur

Gets the current shadow blur radius for the canvas context.

**Signature**

```ts
export declare const shadowBlur: IO.Effect<CanvasRenderingContext2D, never, number>
```

Added in v2.0.0

## stroke

Stroke the current path on the canvas.

**Signature**

```ts
export declare function stroke(path?: Path2D)
```

Added in v1.0.0

## strokePath

Convenience function for drawing a stroked path.

**Signature**

```ts
export declare const strokePath: <R, E, A>(f: Render<A, E, R>) => IO.Effect<CanvasRenderingContext2D | R, E, A>
```

Added in v1.0.0

## strokeRect

Render a stroked rectangle.

**Signature**

```ts
export declare function strokeRect(x: number, y: number, width: number, height: number)
```

Added in v1.0.0

## strokeText

Render stroked text.

**Signature**

```ts
export declare function strokeText(text: string, x: number, y: number, maxWidth?: number)
```

Added in v1.0.0

## textAlign

Gets the current text alignment.

**Signature**

```ts
export declare const textAlign: IO.Effect<CanvasRenderingContext2D, never, CanvasTextAlign>
```

Added in v1.0.0

## textBaseline

Gets the current text baseline.

**Signature**

```ts
export declare const textBaseline: IO.Effect<CanvasRenderingContext2D, never, CanvasTextBaseline>
```

Added in v1.0.0

## toDataURL

Create a data URL for the canvas.

**Signature**

```ts
export declare const toDataURL: IO.Effect<CanvasRenderingContext2D, never, string>
```

Added in v1.0.0

## transform

Apply the specified transformation matrix to the canvas context.

**Signature**

```ts
export declare const transform: (
  m11: number,
  m12: number,
  m21: number,
  m22: number,
  m31: number,
  m32: number
) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## translate

Translate the current canvas context transform.

**Signature**

```ts
export declare const translate: (x: number, y: number) => IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## width

Gets the canvas width in pixels.

**Signature**

```ts
export declare const width: IO.Effect<CanvasRenderingContext2D, never, number>
```

Added in v2.0.0

## withContext

A convenience function which allows for running an action while preserving the existing
canvas context.

**Signature**

```ts
export declare function withContext<R, E, A>(effect: Render<A, E, R>): Render<A, E, R>
```

Added in v1.0.0

# utils

## getFont

**Signature**

```ts
export declare const getFont: LazyArg<IO.Effect<CanvasRenderingContext2D, never, string>>
```

Added in v2.0.0

## getMiterLimit

**Signature**

```ts
export declare const getMiterLimit: LazyArg<IO.Effect<CanvasRenderingContext2D, never, number>>
```

Added in v1.0.0

## getShadowBlur

**Signature**

```ts
export declare const getShadowBlur: LazyArg<IO.Effect<CanvasRenderingContext2D, never, number>>
```

Added in v1.0.0

## getShadowColor

**Signature**

```ts
export declare const getShadowColor: LazyArg<IO.Effect<CanvasRenderingContext2D, never, string>>
```

Added in v1.0.0

## lineWidth

**Signature**

```ts
export declare const lineWidth: IO.Effect<CanvasRenderingContext2D, never, number>
```

Added in v2.0.0

## shadowColor

**Signature**

```ts
export declare const shadowColor: IO.Effect<CanvasRenderingContext2D, never, string>
```

Added in v2.0.0

## shadowOffsetX

**Signature**

```ts
export declare const shadowOffsetX: IO.Effect<CanvasRenderingContext2D, never, number>
```

Added in v2.0.0

## shadowOffsetY

**Signature**

```ts
export declare const shadowOffsetY: IO.Effect<CanvasRenderingContext2D, never, number>
```

Added in v2.0.0

## strokeStyle

**Signature**

```ts
export declare const strokeStyle: IO.Effect<CanvasRenderingContext2D, never, string | CanvasGradient | CanvasPattern>
```

Added in v2.0.0
