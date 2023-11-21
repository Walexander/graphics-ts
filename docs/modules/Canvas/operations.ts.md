---
title: Canvas/operations.ts
nav_order: 4
parent: Modules
---

## operations overview

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [box](#box)
  - [dimensions](#dimensions)
  - [getHeight](#getheight)
  - [getWidth](#getwidth)
  - [height](#height)
  - [setDimensions](#setdimensions)
  - [setHeight](#setheight)
  - [setWidth](#setwidth)
  - [width](#width)
- [compositing](#compositing)
  - [globalAlpha](#globalalpha)
  - [globalCompositeOperation](#globalcompositeoperation)
  - [imageSmoothingEnabled](#imagesmoothingenabled)
  - [setGlobalAlpha](#setglobalalpha)
  - [setGlobalCompositeOperation](#setglobalcompositeoperation)
- [conversion](#conversion)
  - [toDataURL](#todataurl)
- [fill styles](#fill-styles)
  - [fillStyle](#fillstyle)
  - [setFillStyle](#setfillstyle)
- [gradients](#gradients)
  - [addColorStop](#addcolorstop)
  - [createLinearGradient](#createlineargradient)
  - [createPattern](#createpattern)
  - [createRadialGradient](#createradialgradient)
- [images](#images)
  - [drawImage](#drawimage)
  - [drawImageFull](#drawimagefull)
  - [drawImageScale](#drawimagescale)
  - [getImageData](#getimagedata)
  - [putImageData](#putimagedata)
  - [putImageDataFull](#putimagedatafull)
- [line styles](#line-styles)
  - [getLineJoin](#getlinejoin)
  - [getMiterLimit](#getmiterlimit)
  - [lineCap](#linecap)
  - [lineDash](#linedash)
  - [lineDashOffset](#linedashoffset)
  - [lineJoin](#linejoin)
  - [lineWidth](#linewidth)
  - [miterLimit](#miterlimit)
  - [setLineCap](#setlinecap)
  - [setLineDash](#setlinedash)
  - [setLineDashOffset](#setlinedashoffset)
  - [setLineJoin](#setlinejoin)
  - [setLineWidth](#setlinewidth)
  - [setMiterLimit](#setmiterlimit)
- [paths](#paths)
  - [arc](#arc)
  - [arcTo](#arcto)
  - [beginPath](#beginpath)
  - [bezierCurveTo](#beziercurveto)
  - [clip](#clip)
  - [closePath](#closepath)
  - [drawFocusIfNeeded](#drawfocusifneeded)
  - [ellipse](#ellipse)
  - [fill](#fill)
  - [fillPath](#fillpath)
  - [isPointInPath](#ispointinpath)
  - [isPointInStroke](#ispointinstroke)
  - [lineTo](#lineto)
  - [moveTo](#moveto)
  - [quadraticCurveTo](#quadraticcurveto)
  - [stroke](#stroke)
  - [strokePath](#strokepath)
- [pixels](#pixels)
  - [createImageData](#createimagedata)
  - [createImageDataCopy](#createimagedatacopy)
- [rectangles](#rectangles)
  - [clearRect](#clearrect)
  - [fillRect](#fillrect)
  - [rect](#rect)
  - [strokeRect](#strokerect)
- [shadow](#shadow)
  - [getShadowBlur](#getshadowblur)
  - [getShadowColor](#getshadowcolor)
  - [setShadowBlur](#setshadowblur)
  - [setShadowColor](#setshadowcolor)
  - [setShadowOffsetX](#setshadowoffsetx)
  - [setShadowOffsetY](#setshadowoffsety)
  - [shadowBlur](#shadowblur)
  - [shadowColor](#shadowcolor)
  - [shadowOffsetX](#shadowoffsetx)
  - [shadowOffsetY](#shadowoffsety)
- [smoothing](#smoothing)
  - [setImageSmoothingEnabled](#setimagesmoothingenabled)
- [state](#state)
  - [restore](#restore)
  - [save](#save)
  - [withContext](#withcontext)
- [stroke styles](#stroke-styles)
  - [setStrokeStyle](#setstrokestyle)
  - [strokeStyle](#strokestyle)
- [text](#text)
  - [fillText](#filltext)
  - [font](#font)
  - [getFont](#getfont)
  - [measureText](#measuretext)
  - [setFont](#setfont)
  - [setTextAlign](#settextalign)
  - [setTextBaseline](#settextbaseline)
  - [strokeText](#stroketext)
  - [textAlign](#textalign)
  - [textBaseline](#textbaseline)
- [transformations](#transformations)
  - [getTransform](#gettransform)
  - [rotate](#rotate)
  - [scale](#scale)
  - [setTransform](#settransform)
  - [setTransformMatrix](#settransformmatrix)
  - [transform](#transform)
  - [translate](#translate)
- [utils](#utils)
  - [use](#use)

---

# box

## dimensions

Gets the dimensions of the canvas in pixels.

**Signature**

```ts
export declare const dimensions: Effect<CanvasRenderingContext2D, never, CanvasDimensions>
```

Added in v1.0.0

## getHeight

**Signature**

```ts
export declare const getHeight: LazyArg<Effect<CanvasRenderingContext2D, never, number>>
```

Added in v1.0.0

## getWidth

**Signature**

```ts
export declare const getWidth: LazyArg<Effect<CanvasRenderingContext2D, never, number>>
```

Added in v1.0.0

## height

Gets the canvas height in pixels.

**Signature**

```ts
export declare const height: Effect<CanvasRenderingContext2D, never, number>
```

Added in v1.0.0

## setDimensions

Sets the dimensions of the canvas in pixels.

**Signature**

```ts
export declare function setDimensions(dims: CanvasDimensions)
```

Added in v1.0.0

## setHeight

Sets the height of the canvas in pixels.

**Signature**

```ts
export declare function setHeight(height: number)
```

Added in v1.0.0

## setWidth

Sets the width of the canvas in pixels.

**Signature**

```ts
export declare function setWidth(width: number)
```

Added in v1.0.0

## width

Gets the canvas width in pixels.

**Signature**

```ts
export declare const width: Effect<CanvasRenderingContext2D, never, number>
```

Added in v2.0.0

# compositing

## globalAlpha

Gets the current global alpha.

**Signature**

```ts
export declare const globalAlpha: Effect<CanvasRenderingContext2D, never, number>
```

Added in v1.1.0

## globalCompositeOperation

Gets the current global composite operation type for the canvas context.

**Signature**

```ts
export declare const globalCompositeOperation: Effect<CanvasRenderingContext2D, never, string>
```

Added in v1.0.0

## imageSmoothingEnabled

Gets the current image smoothing property for the canvas context. Determines whether scaled images are smoothed
(`true`, default) or not (`false`).

**Signature**

```ts
export declare const imageSmoothingEnabled: Effect<CanvasRenderingContext2D, never, boolean>
```

Added in v1.1.0

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

# conversion

## toDataURL

Create a data URL for the canvas.

**Signature**

```ts
export declare const toDataURL: Effect<CanvasRenderingContext2D, never, string>
```

Added in v1.0.0

# fill styles

## fillStyle

Gets the current fill style for the canvas context.

**Signature**

```ts
export declare const fillStyle: Effect<CanvasRenderingContext2D, never, string | CanvasGradient | CanvasPattern>
```

Added in v1.0.0

## setFillStyle

Sets the current fill style for the canvas context.

**Signature**

```ts
export declare const setFillStyle: (
  style: string | CanvasGradient | CanvasPattern
) => Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

# gradients

## addColorStop

Add a single color stop to a `CanvasGradient` object.

**Signature**

```ts
export declare const addColorStop: (offset: number, color: string) => Gradient<CanvasGradient>
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
) => Effect<CanvasRenderingContext2D, never, CanvasGradient>
```

Added in v1.0.0

## createPattern

Creates a new canvas pattern (repeatable image).

**Signature**

```ts
export declare const createPattern: (
  source: ImageSource,
  repetition: PatternRepetition
) => Effect<CanvasRenderingContext2D, never, Option.Option<CanvasPattern>>
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
) => Effect<CanvasRenderingContext2D, never, CanvasGradient>
```

Added in v1.0.0

# images

## drawImage

Render an image.

**Signature**

```ts
export declare const drawImage: (
  imageSource: ImageSource,
  offsetX: number,
  offsetY: number
) => Effect<CanvasRenderingContext2D, never, void>
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
) => Effect<CanvasRenderingContext2D, never, void>
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
) => Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## getImageData

Gets the image data for the specified portion of the canvas.

**Signature**

```ts
export declare function getImageData(x: number, y: number, width: number, height: number)
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
) => Effect<CanvasRenderingContext2D, never, void>
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
) => Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

# line styles

## getLineJoin

**Signature**

```ts
export declare const getLineJoin: LazyArg<Effect<CanvasRenderingContext2D, never, CanvasLineJoin>>
```

Added in v1.0.0

## getMiterLimit

Lazily get the current miter limit for the canvas context.

**Signature**

```ts
export declare const getMiterLimit: LazyArg<Effect<CanvasRenderingContext2D, never, number>>
```

Added in v1.0.0

## lineCap

Gets the current line cap type for the canvas context.

**Signature**

```ts
export declare const lineCap: Effect<CanvasRenderingContext2D, never, CanvasLineCap>
```

Added in v1.0.0

## lineDash

Gets the current line dash pattern for the canvas context.

**Signature**

```ts
export declare const lineDash: Effect<CanvasRenderingContext2D, never, number[]>
```

Added in v1.0.0

## lineDashOffset

Gets the current line dash offset, or "phase", for the canvas context.

**Signature**

```ts
export declare const lineDashOffset: Effect<CanvasRenderingContext2D, never, number>
```

Added in v1.0.0

## lineJoin

gets the current line join type for the canvas context.

**Signature**

```ts
export declare const lineJoin: Effect<CanvasRenderingContext2D, never, CanvasLineJoin>
```

Added in v2.0.0

## lineWidth

**Signature**

```ts
export declare const lineWidth: Effect<CanvasRenderingContext2D, never, number>
```

Added in v2.0.0

## miterLimit

Gets the current miter limit for the canvas context.

**Signature**

```ts
export declare const miterLimit: Effect<CanvasRenderingContext2D, never, number>
```

Added in v2.0.0

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

# paths

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
export declare const beginPath: Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## bezierCurveTo

Draw a cubic Bézier curve.

**Signature**

```ts
export declare function bezierCurveTo(cpx1: number, cpy1: number, cpx2: number, cpy2: number, x: number, y: number)
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
export declare const closePath: Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## drawFocusIfNeeded

Draws a focus ring around the current or given path, if the specified element is focused.

**Signature**

```ts
export declare const drawFocusIfNeeded: (
  element: HTMLElement,
  path2d?: Path2D | undefined
) => Effect<CanvasRenderingContext2D, never, void>
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
) => Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## fillPath

Convenience function for drawing a filled path.

**Signature**

```ts
export declare const fillPath: <R, E, A>(f: Render<A, E, R>) => Render<A, E, R>
```

Added in v1.0.0

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
) => Effect<CanvasRenderingContext2D, never, boolean>
```

Added in v1.0.0

## lineTo

Move the canvas path to the specified point while drawing a line segment.

**Signature**

```ts
export declare const lineTo: (x: number, y: number) => Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## moveTo

Move the canvas path to the specified point without drawing a line segment.

**Signature**

```ts
export declare function moveTo(x: number, y: number)
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
) => Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

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
export declare const strokePath: <R, E, A>(f: Render<A, E, R>) => Effect.Effect<CanvasRenderingContext2D | R, E, A>
```

Added in v1.0.0

# pixels

## createImageData

Gets `ImageData` for the specified rectangle.

**Signature**

```ts
export declare const createImageData: (sw: number, sh: number) => Effect<CanvasRenderingContext2D, never, ImageData>
```

Added in v1.0.0

## createImageDataCopy

Creates a copy of an existing `ImageData` object.

**Signature**

```ts
export declare const createImageDataCopy: (imageData: ImageData) => Effect<CanvasRenderingContext2D, never, ImageData>
```

Added in v1.0.0

# rectangles

## clearRect

Set the pixels in the specified rectangle back to transparent black.

**Signature**

```ts
export declare function clearRect(x: number, y: number, width: number, height: number)
```

Added in v1.0.0

## fillRect

Render a filled rectangle.

**Signature**

```ts
export declare function fillRect(x: number, y: number, width: number, height: number)
```

Added in v1.0.0

## rect

Render a rectangle.

**Signature**

```ts
export declare function rect(x: number, y: number, width: number, height: number)
```

Added in v1.0.0

## strokeRect

Render a stroked rectangle.

**Signature**

```ts
export declare function strokeRect(x: number, y: number, width: number, height: number)
```

Added in v1.0.0

# shadow

## getShadowBlur

Gets the current shadow blur radius for the canvas context.

**Signature**

```ts
export declare const getShadowBlur: LazyArg<Effect<CanvasRenderingContext2D, never, number>>
```

Added in v1.0.0

## getShadowColor

Gets the current shadow color for the canvas context.

**Signature**

```ts
export declare const getShadowColor: LazyArg<Effect<CanvasRenderingContext2D, never, string>>
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

## shadowBlur

Gets the current shadow blur radius for the canvas context.

**Signature**

```ts
export declare const shadowBlur: Effect<CanvasRenderingContext2D, never, number>
```

Added in v2.0.0

## shadowColor

Gets the current shadow color for the canvas context.

**Signature**

```ts
export declare const shadowColor: Effect<CanvasRenderingContext2D, never, string>
```

Added in v2.0.0

## shadowOffsetX

Sets the current shadow x-offset for the canvas context.

**Signature**

```ts
export declare const shadowOffsetX: Effect<CanvasRenderingContext2D, never, number>
```

Added in v2.0.0

## shadowOffsetY

Gets the current shadow y-offset for the canvas context.

**Signature**

```ts
export declare const shadowOffsetY: Effect<CanvasRenderingContext2D, never, number>
```

Added in v2.0.0

# smoothing

## setImageSmoothingEnabled

Sets the current image smoothing property for the canvas context. Determines whether scaled images are smoothed
(`true`, default) or not (`false`).

**Signature**

```ts
export declare function setImageSmoothingEnabled(enable: boolean)
```

Added in v1.0.0

# state

## restore

Restore the previous canvas context.

**Signature**

```ts
export declare const restore: Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## save

Save the current canvas context.

**Signature**

```ts
export declare const save: Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## withContext

A convenience function which allows for running an action while preserving the existing
canvas context.

**Signature**

```ts
export declare function withContext<R, E, A>(effect: Render<A, E, R>): Render<A, E, R>
```

Added in v1.0.0

# stroke styles

## setStrokeStyle

Sets the current stroke style for the canvas context.

**Signature**

```ts
export declare function setStrokeStyle(style: string)
```

Added in v1.0.0

## strokeStyle

Gets the current stroke style for the canvas context.

**Signature**

```ts
export declare const strokeStyle: Effect<CanvasRenderingContext2D, never, string | CanvasGradient | CanvasPattern>
```

Added in v1.0.0

# text

## fillText

Render filled text.

**Signature**

```ts
export declare const fillText: (
  t: string,
  x: number,
  y: number,
  mw?: number | undefined
) => Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## font

Gets the current font.

**Signature**

```ts
export declare const font: Effect<CanvasRenderingContext2D, never, string>
```

Added in v1.0.0

## getFont

Gets the current font.

**Signature**

```ts
export declare const getFont: LazyArg<Effect<CanvasRenderingContext2D, never, string>>
```

Added in v2.0.0

## measureText

Get the text measurements for the specified text.

**Signature**

```ts
export declare const measureText: (text: string) => Effect<CanvasRenderingContext2D, never, TextMetrics>
```

Added in v1.0.0

## setFont

Sets the current font.

**Signature**

```ts
export declare function setFont(font: string)
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
export declare const textAlign: Effect<CanvasRenderingContext2D, never, CanvasTextAlign>
```

Added in v1.0.0

## textBaseline

Gets the current text baseline.

**Signature**

```ts
export declare const textBaseline: Effect<CanvasRenderingContext2D, never, CanvasTextBaseline>
```

Added in v1.0.0

# transformations

## getTransform

Gets the current transformation matrix being applied to the canvas context.

**Signature**

```ts
export declare const getTransform: Effect<CanvasRenderingContext2D, never, DOMMatrix>
```

Added in v1.0.0

## rotate

Apply rotation to the current canvas context transform.

**Signature**

```ts
export declare const rotate: (angle: number) => Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## scale

Apply scale to the current canvas context transform.

**Signature**

```ts
export declare const scale: (scaleX: number, scaleY: number) => Effect<CanvasRenderingContext2D, never, void>
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
) => Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

## translate

Translate the current canvas context transform.

**Signature**

```ts
export declare const translate: (x: number, y: number) => Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0

# utils

## use

Get access to a raw canvas 2d context and go crazy

**Signature**

```ts
export declare function use<A = void>(f: (canvas: CanvasRenderingContext2D) => A)
```

Added in v2.0.0
