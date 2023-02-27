/** @since 2.0.0 */
import { pipe, constant } from '@effect/data/Function'
import * as RA from '@effect/data/ReadonlyArray'
import { fromNullable } from '@effect/data/Option'
import * as IO from '@effect/io/Effect'
import { Effect } from '@effect/io/Effect'
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
 * @category box
 * @since 2.0.0
 */
export const width = withCanvas(ctx => IO.sync(() => ctx.canvas.width))
/**
 * @since 1.0.0
 * @category box
 * */
export const getWidth = constant(width)

/**
 * Sets the width of the canvas in pixels.
 *
 * @category box
 * @since 1.0.0
 */
export function setWidth(width: number) {
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.canvas.width = width
    })
  )
}

/**
 * Gets the canvas height in pixels.
 *
 *  @category box
 * @since 1.0.0
 */
export const height = withCanvas(ctx => IO.sync(() => ctx.canvas.height))
/**
 * @since 1.0.0
 * @category box
 */
export const getHeight = constant(height)

/**
 * Sets the height of the canvas in pixels.
 *
 * @category box
 * @since 1.0.0
 */
export function setHeight(height: number) {
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.canvas.height = height
    })
  )
}

/**
 * Gets the dimensions of the canvas in pixels.
 *
 * @category box
 * @since 1.0.0
 */
export const dimensions: Effect<CanvasRenderingContext2D, never, CanvasDimensions> = IO.struct({
  width,
  height
})

/**
 * Sets the dimensions of the canvas in pixels.
 *
 * @category box
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
 * @category conversion
 * @since 1.0.0
 */
export const toDataURL = withCanvas(ctx => IO.sync(() => ctx.canvas.toDataURL()))

/**
 * Sets the current fill style for the canvas context.
 *
 * @category fill styles
 * @since 1.0.0
 */

export const setFillStyle: (
  style: string | CanvasGradient | CanvasPattern
) => Effect<CanvasRenderingContext2D, never, void> = (style) => use(ctx => {
    ctx.fillStyle = style
  })
/**
 * Gets the current fill style for the canvas context.
 *
 * @category fill styles
 * @since 1.0.0
 */

export const fillStyle = use(ctx => ctx.fillStyle)
/**
 * Gets the current font.
 *
 * @category text
 * @since 1.0.0
 */
export const font = withCanvas(ctx => IO.sync(() => ctx.font))
/**
 * Gets the current font.
 *
 * @category text
 * @since 2.0.0
 */
export const getFont = constant(font)

/**
 * Sets the current font.
 *
 * @category text
 * @since 1.0.0
 */
export function setFont(font: string) {
  return withCanvas(ctx =>
    pipe(
      IO.sync(() => (ctx.font = font)),
      IO.as(ctx)
    )
  )
}

/**
 * Gets the current global alpha.
 *
 * @category compositing
 * @since 1.1.0
 */
export const globalAlpha = withCanvas(ctx => IO.sync(() => ctx.globalAlpha))
/**
 * Sets the current global alpha for the canvas context.
 *
 * @category compositing
 * @since 1.0.0
 */
export function setGlobalAlpha(globalAlpha: number) {
  return withCanvas(ctx => IO.sync(() => (ctx.globalAlpha = globalAlpha)))
}

/**
 * Gets the current global composite operation type for the canvas context.
 *
 * @category compositing
 * @since 1.0.0
 */
export const globalCompositeOperation = withCanvas(ctx =>
  IO.sync(() => ctx.globalCompositeOperation)
)

/**
 * Sets the current global composite operation type for the canvas context.
 *
 * @category compositing
 * @since 1.0.0
 */
export function setGlobalCompositeOperation(globalCompositeOperation: GlobalCompositeOperation) {
  return withCanvas(ctx =>
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
 * @category compositing
 * @since 1.1.0
 */

export const imageSmoothingEnabled = withCanvas(ctx => IO.sync(() => ctx.imageSmoothingEnabled))

/**
 * Sets the current image smoothing property for the canvas context. Determines whether scaled images are smoothed
 * (`true`, default) or not (`false`).
 *
 * @category smoothing
 * @since 1.0.0
 */
export function setImageSmoothingEnabled(enable: boolean) {
  return withCanvas(ctx =>
    pipe(
      IO.sync(() => (ctx.imageSmoothingEnabled = enable)),
      IO.as(ctx)
    )
  )
}

/**
 * Sets the current line cap type for the canvas context.
 *
 * @category line styles
 * @since 1.0.0
 */
export function setLineCap(cap: LineCap) {
  return withCanvas(ctx =>
    pipe(
      IO.sync(() => (ctx.lineCap = cap)),
      IO.as(ctx)
    )
  )
}
/**
 * Gets the current line cap type for the canvas context.
 *
 * @category line styles
 * @since 1.0.0
 */
export const lineCap = withCanvas(ctx => pipe(IO.sync(() => ctx.lineCap)))

/**
 * Sets the current line dash offset, or "phase", for the canvas context.
 *
 * @category line styles
 * @since 1.0.0
 */
export function setLineDashOffset(offset: number) {
  return withCanvas(ctx =>
    pipe(
      IO.sync(() => (ctx.lineDashOffset = offset)),
      IO.as(ctx)
    )
  )
}
/**
 * Gets the current line dash offset, or "phase", for the canvas context.
 *
 * @category line styles
 * @since 1.0.0
 */
export const lineDashOffset = withCanvas(ctx => pipe(IO.sync(() => ctx.lineDashOffset)))

/**
 * Sets the current line join type for the canvas context.
 *
 * @category line styles
 * @since 1.0.0
 */
export function setLineJoin(join: LineJoin) {
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.lineJoin = join
    })
  )
}
/**
 * gets the current line join type for the canvas context.
 *
 * @category line styles
 * @since 2.0.0
 */
export const lineJoin = withCanvas(ctx => pipe(IO.sync(() => ctx.lineJoin)))
/**
 * @category line styles
 * @since 1.0.0
 */
export const getLineJoin = constant(lineJoin)

/**
 * Sets the current line width for the canvas context in pixels.
 *
 * @category line styles
 * @since 1.0.0
 */
export function setLineWidth(lineWidth: number) {
  return use(ctx => {
    ctx.lineWidth = lineWidth
  })
}
/**
 * @category line styles
 * @since 2.0.0
 * */
export const lineWidth = withCanvas(ctx => pipe(IO.sync(() => ctx.lineWidth)))

/**
 * Sets the current miter limit for the canvas context.
 *
 * @category line styles
 * @since 1.0.0
 */
export function setMiterLimit(miterLimit: number) {
  return withCanvas(ctx =>
    pipe(
      IO.sync(() => (ctx.miterLimit = miterLimit)),
      IO.as(ctx)
    )
  )
}
/**
 * Gets the current miter limit for the canvas context.
 *
 * @category line styles
 * @since 2.0.0
 */
export const miterLimit: Effect<CanvasRenderingContext2D, never, number> = withCanvas(ctx =>
  IO.sync(() => ctx.miterLimit)
)
/**
 * Lazily get the current miter limit for the canvas context.
 *
 * @category line styles
 * @since 1.0.0
 */
export const getMiterLimit = constant(miterLimit)


/**
 * Sets the current stroke style for the canvas context.
 *
 * @category stroke styles
 * @since 1.0.0
 */
export function setStrokeStyle(style: string) {
  return use(ctx => {
    ctx.strokeStyle = style
  })
}
/**
 * Gets the current stroke style for the canvas context.
 *
 * @category stroke styles
 * @since 1.0.0
 */
export const strokeStyle = use(c => c.strokeStyle)
/**
 * Sets the current shadow blur radius for the canvas context.
 *
 * @category shadow
 * @since 1.0.0
 */
export function setShadowBlur(blur: number) {
  return withCanvas(ctx =>
    pipe(
      IO.sync(() => (ctx.shadowBlur = blur)),
      IO.as(ctx)
    )
  )
}
/**
 * Gets the current shadow blur radius for the canvas context.
 *
 * @category shadow
 * @since 2.0.0
 */
export const shadowBlur = withCanvas(ctx => IO.sync(() => ctx.shadowBlur))
/**
 * Gets the current shadow blur radius for the canvas context.
 *
 * @category shadow
 * @since 1.0.0
 */
export const getShadowBlur = constant(shadowBlur)

/**
 * Sets the current shadow color for the canvas context.
 *
 * @category shadow
 * @since 1.0.0
 */
export function setShadowColor(color: string) {
  return withCanvas(ctx => IO.sync(() => (ctx.shadowColor = color)))
}
/**
 * Gets the current shadow color for the canvas context.
 *
 * @category shadow
 * @since 2.0.0
 */
export const shadowColor = withCanvas(ctx => pipe(IO.sync(() => ctx.shadowColor)))
/**
 * Gets the current shadow color for the canvas context.
 *
 * @category shadow
 * @since 1.0.0
 */
export const getShadowColor = constant(shadowColor)

/**
 * Sets the current shadow x-offset for the canvas context.
 *
 * @category shadow
 * @since 1.0.0
 */
export function setShadowOffsetX(offsetX: number) {
  return withCanvas(ctx =>
    pipe(
      IO.sync(() => (ctx.shadowOffsetX = offsetX)),
      IO.as(ctx)
    )
  )
}
/**
 * Sets the current shadow x-offset for the canvas context.
 *
 * @category shadow
 * @since 2.0.0
 */
export const shadowOffsetX = withCanvas(ctx => pipe(IO.sync(() => ctx.shadowOffsetX)))

/**
 * Sets the current shadow y-offset for the canvas context.
 *
 * @category shadow
 * @since 1.0.0
 */
export function setShadowOffsetY(offsetY: number) {
  return withCanvas(ctx =>
    pipe(
      IO.sync(() => (ctx.shadowOffsetY = offsetY)),
      IO.as(ctx)
    )
  )
}
/**
 * Gets the current shadow y-offset for the canvas context.
 *
 * @category shadow
 * @since 2.0.0
 */
export const shadowOffsetY = withCanvas(ctY => pipe(IO.sync(() => ctY.shadowOffsetY)))

/**
 * Gets the current text alignment.
 *
 * @category text
 * @since 1.0.0
 */
export const textAlign = use(ctx => ctx.textAlign)

/**
 * Sets the current text alignment.
 *
 * @category text
 * @since 1.0.0
 */
export function setTextAlign(textAlign: TextAlign) {
  return withCanvas(ctx =>
    pipe(
      IO.sync(() => (ctx.textAlign = textAlign)),
      IO.as(ctx)
    )
  )
}

/**
 * Gets the current text baseline.
 *
 * @category text
 * @since 1.0.0
 */
export const textBaseline = withCanvas(ctx => IO.sync(() => ctx.textBaseline))

/**
 * Sets the current text baseline.
 *
 * @category text
 * @since 1.0.0
 */
export function setTextBaseline(textBaseline: TextBaseline) {
  return use(ctx => {
    ctx.textBaseline = textBaseline
  })
}

/**
 * Render an arc.
 *
 * @category paths
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
  return withCanvas(ctx =>
    pipe(
      IO.sync(() => ctx.arc(x, y, radius, start, end, counterclockwise)),
      IO.as(ctx)
    )
  )
}
/**
 * Render an arc that is automatically connected to the path's latest point.
 *
 * @category paths
 * @since 1.0.0
 */
export function arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.arcTo(x1, y1, x2, y2, radius)
    })
  )
}
/**
 * Begin a path on the canvas.
 *
 * @category paths
 * @since 1.0.0
 */
export const beginPath = use(ctx => {
  ctx.beginPath()
})

/**
 * Draw a cubic Bézier curve.
 *
 * @category paths
 * @since 1.0.0
 */
export function bezierCurveTo(
  cpx1: number,
  cpy1: number,
  cpx2: number,
  cpy2: number,
  x: number,
  y: number
) {
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)
    })
  )
}
/**
 * Set the pixels in the specified rectangle back to transparent black.
 *
 * @category rectangles
 * @since 1.0.0
 */
export function clearRect(x: number, y: number, width: number, height: number) {
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.clearRect(x, y, width, height)
    })
  )
}

/**
 * Clip the current path on the canvas.
 *
 * @category paths
 * @since 1.0.0
 */
export function clip(fillRule?: FillRule, path?: Path2D) {
  return withCanvas(ctx =>
    IO.sync(() => {
      if (typeof path !== 'undefined') {
        ctx.clip(path, fillRule)
      } else if (typeof fillRule !== 'undefined') {
        ctx.clip(fillRule)
      } else {
        ctx.clip()
      }
    })
  )
}
/**
 * Closes the current canvas path.
 *
 * @category paths
 * @since 1.0.0
 */
export const closePath = withCanvas(ctx =>
  IO.sync(() => {
    ctx.closePath()
  })
)

/**
 * Gets `ImageData` for the specified rectangle.
 *
 * @category pixels
 * @since 1.0.0
 */
export const createImageData = (sw: number, sh: number) =>
  withCanvas(ctx => IO.sync(() => ctx.createImageData(sw, sh)))

/**
 * Creates a copy of an existing `ImageData` object.
 *
 * @category pixels
 * @since 1.0.0
 */
export const createImageDataCopy = (imageData: ImageData) =>
  withCanvas(ctx => IO.sync(() => ctx.createImageData(imageData)))

/**
 * Creates a linear `CanvasGradient` object.
 *
 * @category gradients
 * @since 1.0.0
 */
export const createLinearGradient = (x0: number, y0: number, x1: number, y1: number) =>
  withCanvas(ctx => IO.sync(() => ctx.createLinearGradient(x0, y0, x1, y1)))

/**
 * Creates a new canvas pattern (repeatable image).
 *
 * @category gradients
 * @since 1.0.0
 */
export const createPattern = (source: ImageSource, repetition: PatternRepetition) =>
  withCanvas(ctx => IO.sync(() => fromNullable(ctx.createPattern(source, repetition))))

/**
 * Creates a radial `CanvasGradient` object.
 *
 * @category gradients
 * @since 1.0.0
 */
export const createRadialGradient = (
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number
) => withCanvas(ctx => IO.sync(() => ctx.createRadialGradient(x0, y0, r0, x1, y1, r1)))

/**
 * Draws a focus ring around the current or given path, if the specified element is focused.
 *
 * @category paths
 * @since 1.0.0
 */
export const drawFocusIfNeeded = (element: HTMLElement, path2d?: Path2D) =>
  withCanvas(ctx =>
    IO.sync(() => {
      if (typeof path2d !== 'undefined') {
        ctx.drawFocusIfNeeded(path2d, element)
      } else {
        ctx.drawFocusIfNeeded(element)
      }
    })
  )

/**
 * Render an image.
 *
 * @category images
 * @since 1.0.0
 */
export const drawImage = (imageSource: ImageSource, offsetX: number, offsetY: number) =>
  withCanvas(ctx =>
    IO.sync(() => {
      ctx.drawImage(imageSource, offsetX, offsetY)
    })
  )

/**
 * Draws an image to the canvas.
 *
 * @category images
 * @since 1.0.0
 */
export const drawImageScale = (
  imageSource: ImageSource,
  offsetX: number,
  offsetY: number,
  width: number,
  height: number
) =>
  use(ctx => {
    ctx.drawImage(imageSource, offsetX, offsetY, width, height)
  })

/**
 * Draws an image to the canvas.
 *
 * @category images
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
  use(ctx => {
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
  })

/**
 * Render an ellipse.
 *
 * @category paths
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
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.ellipse(x, y, rx, ry, rotation, start, end, anticlockwise)
    })
  )
}
/**
 * Fill the current path on the canvas.
 *
 * @category paths
 * @since 1.0.0
 */
export const fill = (f?: FillRule, p?: Path2D) =>
  withCanvas(ctx =>
    IO.sync(() => {
      if (typeof p !== 'undefined') {
        ctx.fill(p, f)
      } else if (typeof f !== 'undefined') {
        ctx.fill(f)
      } else {
        ctx.fill()
      }
    })
  )

/**
 * Render a filled rectangle.
 *
 * @category rectangles
 * @since 1.0.0
 */
export function fillRect(x: number, y: number, width: number, height: number) {
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.fillRect(x, y, width, height)
    })
  )
}
/**
 * Render filled text.
 *
 * @category text
 * @since 1.0.0
 */
export const fillText = (t: string, x: number, y: number, mw?: number) =>
  withCanvas(ctx =>
    IO.sync(() => {
      if (typeof mw !== 'undefined') {
        ctx.fillText(t, x, y, mw)
      } else {
        ctx.fillText(t, x, y)
      }
    })
  )

/**
 * Gets the image data for the specified portion of the canvas.
 *
 * @category images
 * @since 1.0.0
 */
export function getImageData(x: number, y: number, width: number, height: number) {
  return withCanvas(ctx => IO.sync(() => ctx.getImageData(x, y, width, height)))
}

/**
 * Gets the current line dash pattern for the canvas context.
 *
 * @category line styles
 * @since 1.0.0
 */
export const lineDash = withCanvas(ctx => IO.sync(() => ctx.getLineDash()))

/**
 * Gets the current transformation matrix being applied to the canvas context.
 *
 * @category transformations
 * @since 1.0.0
 */
export const getTransform = withCanvas(ctx => IO.sync(() => ctx.getTransform()))

/**
 * Determines if the specified point is contained in the current path.)
 *
 * @category paths
 * @since 1.0.0
 */
export function isPointInPath(x: number, y: number, fillRule?: FillRule, path?: Path2D) {
  return withCanvas(ctx =>
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
 * @category paths
 * @since 1.0.0
 */
export const isPointInStroke = (x: number, y: number, path?: Path2D) =>
  withCanvas(ctx =>
    IO.sync(() =>
      typeof path !== 'undefined' ? ctx.isPointInStroke(path, x, y) : ctx.isPointInStroke(x, y)
    )
  )
/**
 * Move the canvas path to the specified point while drawing a line segment.
 *
 * @category paths
 * @since 1.0.0
 */
export const lineTo = (x: number, y: number) =>
  use(ctx => {
    ctx.lineTo(x, y)
  })

/**
 * Get the text measurements for the specified text.
 *
 * @category text
 * @since 1.0.0
 */
export const measureText = (text: string) => withCanvas(ctx => IO.sync(() => ctx.measureText(text)))

/**
 * Move the canvas path to the specified point without drawing a line segment.
 *
 * @category paths
 * @since 1.0.0
 */
export function moveTo(x: number, y: number) {
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.moveTo(x, y)
    })
  )
}

/**
 * Sets the image data for the specified portion of the canvas.
 *
 * @category images
 * @since 1.0.0
 */
export const putImageData = (imageData: ImageData, dx: number, dy: number) =>
  withCanvas(ctx =>
    IO.sync(() => {
      ctx.putImageData(imageData, dx, dy)
    })
  )

/**
 * Sets the image data for the specified portion of the canvas.
 *
 * @category images
 * @since 1.0.0
 */
export const putImageDataFull = (
  data: ImageData,
  dx: number,
  dy: number,
  dirtyX: number,
  dirtyY: number,
  dirtyW: number,
  dirtyH: number
) =>
  withCanvas(ctx =>
    IO.sync(() => {
      ctx.putImageData(data, dx, dy, dirtyX, dirtyY, dirtyW, dirtyH)
    })
  )

/**
 * Draws a quadratic Bézier curve.
 *
 * @category paths
 * @since 1.0.0
 */
export const quadraticCurveTo = (cpx: number, cpy: number, x: number, y: number) =>
  withCanvas(ctx =>
    IO.sync(() => {
      ctx.quadraticCurveTo(cpx, cpy, x, y)
    })
  )

/**
 * Render a rectangle.
 *
 * @category rectangles
 * @since 1.0.0
 */
export function rect(x: number, y: number, width: number, height: number) {
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.rect(x, y, width, height)
    })
  )
}
/**
 * Restore the previous canvas context.
 *
 * @category state
 * @since 1.0.0
 */
export const restore = withCanvas(ctx =>
  IO.sync(() => {
    ctx.restore()
  })
)

/**
 * Apply rotation to the current canvas context transform.
 *
 * @category transformations
 * @since 1.0.0
 */
export const rotate = (angle: number) =>
  withCanvas(ctx =>
    IO.sync(() => {
      ctx.rotate(angle)
    })
  )

/**
 * Save the current canvas context.
 *
 * @category state
 * @since 1.0.0
 */
export const save = withCanvas(ctx =>
  IO.sync(() => {
    ctx.save()
  })
)

/**
 * Apply scale to the current canvas context transform.
 *
 * @category transformations
 * @since 1.0.0
 */
export const scale = (scaleX: number, scaleY: number) =>
  withCanvas(ctx =>
    IO.sync(() => {
      ctx.scale(scaleX, scaleY)
    })
  )

/**
 * Sets the current line dash pattern used when stroking lines.
 *
 * @category line styles
 * @since 1.0.0
 */
export function setLineDash(segments: ReadonlyArray<number>) {
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.setLineDash(RA.copy(segments))
    })
  )
}

/**
 * Resets the current transformation to the identity matrix, and then applies the transform specified
 * to the current canvas context.
 *
 * @category transformations
 * @since 1.0.0
 */
export function setTransform(a: number, b: number, c: number, d: number, e: number, f: number) {
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.setTransform(a, b, c, d, e, f)
    })
  )
}
/**
 * Resets the current transformation to the identity matrix, and then applies the transform specified
 * to the current canvas context.
 *
 * @category transformations
 * @since 1.0.0
 */
export function setTransformMatrix(matrix: DOMMatrix) {
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.setTransform(matrix)
    })
  )
}

/**
 * Stroke the current path on the canvas.
 *
 * @category paths
 * @since 1.0.0
 */
export function stroke(path?: Path2D) {
  return withCanvas(ctx =>
    IO.sync(() => {
      if (typeof path !== 'undefined') {
        ctx.stroke(path)
      } else {
        ctx.stroke()
      }
    })
  )
}

/**
 * Render a stroked rectangle.
 *
 * @category rectangles
 * @since 1.0.0
 */
export function strokeRect(x: number, y: number, width: number, height: number) {
  return withCanvas(ctx =>
    IO.sync(() => {
      ctx.strokeRect(x, y, width, height)
    })
  )
}
/**
 * Render stroked text.
 *
 * @category text
 * @since 1.0.0
 */
export function strokeText(text: string, x: number, y: number, maxWidth?: number) {
  return withCanvas(ctx =>
    IO.sync(() => {
      if (typeof maxWidth !== 'undefined') {
        ctx.strokeText(text, x, y, maxWidth)
      } else {
        ctx.strokeText(text, x, y)
      }
    })
  )
}
/**
 * Apply the specified transformation matrix to the canvas context.
 *
 * @category transformations
 * @since 1.0.0
 */
export const transform = (
  m11: number,
  m12: number,
  m21: number,
  m22: number,
  m31: number,
  m32: number
) =>
  withCanvas(ctx =>
    IO.sync(() => {
      ctx.transform(m11, m12, m21, m22, m31, m32)
    })
  )

/**
 * Translate the current canvas context transform.
 *
 * @category transformations
 * @since 1.0.0
 */
export const translate = (x: number, y: number) =>
  withCanvas(ctx =>
    IO.sync(() => {
      ctx.translate(x, y)
    })
  )

/**
 * Add a single color stop to a `CanvasGradient` object.
 *
 * @category gradients
 * @since 1.0.0
 */
export const addColorStop: (offset: number, color: string) => Gradient<CanvasGradient> = (o, c) =>
  withGradient(g =>
    IO.sync(() => {
      g.addColorStop(o, c)
      return g
    })
  )

/**
 * Convenience function for drawing a filled path.
 *
 * @category paths
 * @since 1.0.0
 */
export const fillPath = <R, E, A>(f: Render<A, E, R>): Render<A, E, R> =>
  pipe(beginPath, IO.zipRight(f), IO.zipLeft(fill()))

/**
 * Convenience function for drawing a stroked path.
 *
 * @category paths
 * @since 1.0.0
 */
export const strokePath = <R, E, A>(f: Render<A, E, R>) =>
  pipe(beginPath, IO.zipRight(f), IO.zipLeft(stroke()))

/**
 * Get access to a raw canvas 2d context and go crazy
 *
 * @category utils
 * @since 2.0.0
 */
export function use<A = void>(f: (canvas: CanvasRenderingContext2D) => A) {
  return withCanvas(ctx => IO.sync(() => f(ctx)))
}

/**
 * A convenience function which allows for running an action while preserving the existing
 * canvas context.
 *
 * @category state
 * @since 1.0.0
 */
export function withContext<R, E, A>(effect: Render<A, E, R>): Render<A, E, R> {
  return IO.scoped(
    IO.acquireUseRelease(
      save,
      _ => effect,
      _ => restore
    )
  )
}

function withCanvas<R, E, A>(
  f: (ctx: CanvasRenderingContext2D) => Effect<R, E, A>
): Effect<R | CanvasRenderingContext2D, E, A> {
  return IO.serviceWithEffect(Tag, f)
}

declare function withGradient<R, E, A>(f: (gradient: CanvasGradient) => Effect<R, E, A>): Render<A, E, R>
