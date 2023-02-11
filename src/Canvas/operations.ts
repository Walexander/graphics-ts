import { pipe, constant } from '@fp-ts/core/Function'
import * as RA from '@fp-ts/core/ReadonlyArray'
import { fromNullable } from '@fp-ts/core/Option'
import * as IO from '@effect/io/Effect'
import {
  LineCap,
  LineJoin,
  TextAlign,
  TextBaseline,
  Render,
  ImageSource,
  PatternRepetition,
  CanvasDimensions,
  Gradient,
  Tag,
  FillRule
} from './definition'
/**
 * Gets the canvas width in pixels.
 *
 * @category combinators
 * @since 1.0.0
 */
export const width = withCanvas((ctx) => IO.sync(() => ctx.canvas.width))
export const getWidth = constant(width)

/**
 * Sets the width of the canvas in pixels.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setWidth(width: number) {
  return withCanvas((ctx) =>
    IO.sync(() => {
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
export const height = withCanvas((ctx) => IO.sync(() => ctx.canvas.height))

/**
 * Sets the height of the canvas in pixels.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setHeight(height: number) {
  return withCanvas((ctx) =>
    IO.sync(() => {
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
export const dimensions: IO.Effect<CanvasRenderingContext2D, never, CanvasDimensions> = IO.struct({
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
    IO.collectAllDiscard,
    IO.zipRight(dimensions)
  )
}

/**
 * Create a data URL for the canvas.
 *
 * @category combinators
 * @since 1.0.0
 */
export const toDataURL = withCanvas((ctx) =>
  IO.sync(() => ctx.canvas.toDataURL())
)

/**
 * Sets the current fill style for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
  
export const setFillStyle: (style: string | CanvasGradient | CanvasPattern) => IO.Effect<CanvasRenderingContext2D, never, CanvasRenderingContext2D> = (style: string | CanvasGradient | CanvasPattern) =>
  withCanvas((ctx) =>
    pipe(
      IO.sync(() => (ctx.fillStyle = style)),
      IO.as(ctx)
    )
  )

/**
 * Gets the current font.
 *
 * @category combinators
 * @since 1.0.0
 */
export const font = withCanvas((ctx) => IO.sync(() => ctx.font))
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
      IO.sync(() => (ctx.font = font)),
      IO.as(ctx)
    )
  )
}

/**
 * Gets the current global alpha.
 *
 * @category combinators
 * @since 1.1.0
 */
export const globalAlpha = withCanvas((ctx) => IO.sync(() => ctx.globalAlpha))
/**
 * Sets the current global alpha for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setGlobalAlpha(globalAlpha: number) {
  return withCanvas((ctx) => IO.sync(() => (ctx.globalAlpha = globalAlpha)))
}

/**
 * Gets the current global composite operation type for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export const globalCompositeOperation = withCanvas((ctx) =>
  IO.sync(() => ctx.globalCompositeOperation)
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
      IO.sync(() => (ctx.globalCompositeOperation = globalCompositeOperation)),
      IO.as(ctx)
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
  IO.sync(() => ctx.imageSmoothingEnabled)
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
      IO.sync(() => (ctx.imageSmoothingEnabled = enable)),
      IO.as(ctx)
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
      IO.sync(() => (ctx.lineCap = cap)),
      IO.as(ctx)
    )
  )
}
/**
 * Gets the current line cap type for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export const lineCap = withCanvas((ctx) => pipe(IO.sync(() => ctx.lineCap)))

/**
 * Sets the current line dash offset, or "phase", for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setLineDashOffset(offset: number) {
  return withCanvas((ctx) =>
    pipe(
      IO.sync(() => (ctx.lineDashOffset = offset)),
      IO.as(ctx)
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
  pipe(IO.sync(() => ctx.lineDashOffset))
)

/**
 * Sets the current line join type for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setLineJoin(join: LineJoin) {
  return withCanvas((ctx) =>
    IO.sync(() => {
      ctx.lineJoin = join
      return ctx
    })
  )
}
export const lineJoin = withCanvas((ctx) =>
  pipe(IO.sync(() => ctx.lineJoin))
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
      IO.sync(() => (ctx.lineWidth = lineWidth)),
      IO.as(ctx)
    )
  )
}
export const lineWidth = withCanvas((ctx) => pipe(IO.sync(() => ctx.lineWidth)))

/**
 * Sets the current miter limit for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setMiterLimit(miterLimit: number) {
  return withCanvas((ctx) =>
    pipe(
      IO.sync(() => (ctx.miterLimit = miterLimit)),
      IO.as(ctx)
    )
  )
}
export const miterLimit = withCanvas((ctx) =>
  pipe(IO.sync(() => ctx.miterLimit))
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
      IO.sync(() => (ctx.shadowBlur = blur)),
      IO.as(ctx)
    )
  )
}
export const shadowBlur = withCanvas((ctx) =>
  pipe(IO.sync(() => ctx.shadowBlur))
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
      IO.sync(() => (ctx.shadowColor = color)),
      IO.as(ctx)
    )
  )
}
export const shadowColor = withCanvas((ctx) =>
  pipe(IO.sync(() => ctx.shadowColor))
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
      IO.sync(() => (ctx.shadowOffsetX = offsetX)),
      IO.as(ctx)
    )
  )
}
export const shadowOffsetX = withCanvas((ctx) =>
  pipe(IO.sync(() => ctx.shadowOffsetX))
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
      IO.sync(() => (ctx.shadowOffsetY = offsetY)),
      IO.as(ctx)
    )
  )
}
export const shadowOffsetY = withCanvas((ctY) =>
  pipe(IO.sync(() => ctY.shadowOffsetY))
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
      IO.sync(() => (ctx.strokeStyle = style)),
      IO.as(ctx)
    )
  )
}
export const strokeStyle = withCanvas((ctx) =>
  pipe(IO.sync(() => ctx.strokeStyle))
)

/**
 * Gets the current text alignment.
 *
 * @category combinators
 * @since 1.0.0
 */
export const textAlign = withCanvas((ctx) => IO.sync(() => ctx.textAlign))

/**
 * Sets the current text alignment.
 *
 * @category combinators
 * @since 1.0.0
 */
export function setTextAlign(textAlign: TextAlign) {
  return withCanvas((ctx) =>
    pipe(
      IO.sync(() => (ctx.textAlign = textAlign)),
      IO.as(ctx)
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
  IO.sync(() => ctx.textBaseline)
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
      IO.sync(() => (ctx.textBaseline = textBaseline)),
      IO.as(ctx)
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
      IO.sync(() => ctx.arc(x, y, radius, start, end, counterclockwise)),
      IO.as(ctx)
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
    IO.sync(() => {
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
    IO.sync(() => ctx.beginPath()),
    IO.as(ctx)
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
    IO.sync(() => {
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
    IO.sync(() => {
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
    IO.sync(() => {
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
  IO.sync(() => {
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
  withCanvas((ctx) => IO.sync(() => ctx.createImageData(sw, sh)))

/**
 * Creates a copy of an existing `ImageData` object.
 *
 * @category combinators
 * @since 1.0.0
 */
export const createImageDataCopy = (imageData: ImageData) =>
  withCanvas((ctx) => IO.sync(() => ctx.createImageData(imageData)))

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
  withCanvas((ctx) => IO.sync(() => ctx.createLinearGradient(x0, y0, x1, y1)))

/**
 * Creates a new canvas pattern (repeatable image).
 *
 * @category combinators
 * @since 1.0.0
 */
export const createPattern = (
  source: ImageSource,
  repetition: PatternRepetition
) => withCanvas((ctx) => IO.sync(() => fromNullable(ctx.createPattern(source, repetition))))

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
) => withCanvas((ctx) => IO.sync(() => ctx.createRadialGradient(x0, y0, r0, x1, y1, r1)))

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
    IO.sync(() => {
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
    IO.sync(() => {
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
    IO.sync(() => {
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
export const drawImageFull = (
  imageSource: ImageSource,
  offsetX: number,
  offsetY: number,
  width: number,
  height: number,
  canvasOffsetX: number,
  canvasOffsetY: number,
  canvasImageWidth: number,
  canvasImageHeight: number
) =>
  withCanvas((ctx) =>
    IO.sync(() => {
      ctx.drawImage(
        imageSource,
        offsetX,
        offsetY,
        width,
        height,
        canvasOffsetX,
        canvasOffsetY,
        canvasImageWidth,
        canvasImageHeight
      )
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
    IO.sync(() => {
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
    IO.sync(() => {
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
    IO.sync(() => {
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
    IO.sync(() => {
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
  return withCanvas((ctx) => IO.sync(() => ctx.getImageData(x, y, width, height)))
}

/**
 * Gets the current line dash pattern for the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export const lineDash = withCanvas((ctx) =>
  IO.sync(() => ctx.getLineDash())
)

/**
 * Gets the current transformation matrix being applied to the canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export const getTransform = withCanvas((ctx) =>
  IO.sync(() => ctx.getTransform())
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
) {
  return withCanvas((ctx) =>
    IO.sync(() => {
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
export const isPointInStroke = (
  x: number,
  y: number,
  path?: Path2D
) =>
  withCanvas((ctx) =>
    IO.sync(() =>
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
    IO.sync(() => {
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
export const measureText = (text: string) =>
  withCanvas((ctx) => IO.sync(() => ctx.measureText(text)))

/**
 * Move the canvas path to the specified point without drawing a line segment.
 *
 * @category combinators
 * @since 1.0.0
 */
export function moveTo(x: number, y: number) {
  return withCanvas((ctx) =>
    IO.sync(() => {
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
    IO.sync(() => {
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
    IO.sync(() => {
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
    IO.sync(() => {
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
    IO.sync(() => {
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
  IO.sync(() => {
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
    IO.sync(() => {
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
  IO.sync(() => {
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
    IO.sync(() => {
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
  return withCanvas((ctx) => IO.sync(() => {
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
) {
  return withCanvas((ctx) =>
    IO.sync(() => {
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
export function setTransformMatrix(matrix: DOMMatrix) {
  return withCanvas((ctx) => IO.sync(() => {
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
    IO.sync(() => {
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
    IO.sync(() => {
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
) {
  return withCanvas((ctx) =>
    IO.sync(() => {
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
export const transform = (m11: number, m12: number, m21: number, m22: number, m31: number, m32: number) =>
  withCanvas((ctx) =>
    IO.sync(() => {
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
    IO.sync(() => {
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
    IO.sync(() => {
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
export const fillPath = <R, E, A>(f: Render<A, E, R>): Render<A, E, R> =>
  pipe(beginPath, IO.zipRight(f), IO.zipLeft(fill()))

/**
 * Convenience function for drawing a stroked path.
 *
 * @category combinators
 * @since 1.0.0
 */
export const strokePath = <R, E, A>(f: Render<A, E, R>) =>
  pipe(beginPath, IO.zipRight(f), IO.zipLeft(stroke()))

/**
 * A convenience function which allows for running an action while preserving the existing
 * canvas context.
 *
 * @category combinators
 * @since 1.0.0
 */
export function withContext<R, E, A>(effect: Render<A, E, R>): Render<A, E, R> {
  return IO.scoped(IO.acquireUseRelease(
    save,
    (_) => effect,
    (_) => restore
  ))
}

export function withCanvas<R, E, A>(
  f: (ctx: CanvasRenderingContext2D) => IO.Effect<R, E, A>
): IO.Effect<R | CanvasRenderingContext2D, E, A> {
  return IO.serviceWithEffect(Tag, f)
}

declare function withGradient<R, E, A>(
  f: (gradient: CanvasGradient) => IO.Effect<R, E, A>
): Render<A, E, R>
