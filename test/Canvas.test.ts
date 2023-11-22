import { Effect } from 'effect'
import { pipe } from 'effect/Function'
import { testM, testCanvas } from './utils'
import type { Mock } from 'vitest'
import { assert, beforeEach, describe, expect } from 'vitest'

import * as C from '../src/Canvas'
import * as S from '../src/Shape'

const it = testM

const CANVAS_ID = 'canvas'
const TEST_CANVAS_ID = 'test-canvas'
const FOCUS_TARGET = 'focus-target'
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600

let focusTarget: HTMLElement

const Canvas = C

beforeEach(() => {
  document.body.innerHTML = `
    <canvas
      id="${CANVAS_ID}"
      width="${CANVAS_WIDTH}"
      height="${CANVAS_HEIGHT}"
    >
      <input
        id="${FOCUS_TARGET}"
        type="range"
        min="1"
        max="12"
      />
    </canvas>
    <canvas
      id="${TEST_CANVAS_ID}"
      width="${CANVAS_WIDTH}"
      height="${CANVAS_HEIGHT}"
    />
  `
  focusTarget = document.getElementById(FOCUS_TARGET) as HTMLElement
  focusTarget.focus()
})

describe('Canvas', () => {
  describe('dimensions', () => {
    it('width', () =>
      pipe(
        Canvas.width,
        Effect.map((width) => assert.equal(width, CANVAS_WIDTH))
      ))

    it('setWidth', () =>
      pipe(
        Canvas.setWidth(900),
        Effect.zipRight(Canvas.width),
        Effect.map((width) => assert.equal(width, 900))
      ))

    it('height', () =>
      pipe(
        Canvas.height,
        Effect.map((height) => assert.equal(height, CANVAS_HEIGHT))
      ))

    it('setHeight', () =>
      pipe(
        Canvas.setHeight(300),
        Effect.zipRight(Canvas.height),
        Effect.map((height) => assert.equal(height, 300))
      ))

    it('gets dimensions', () =>
      pipe(
        Canvas.dimensions,
        Effect.map(({ height, width }) =>
          assert.deepEqual({ width, height }, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT })
        )
      ))

    it('set dimensions', () =>
      pipe(
        Canvas.setDimensions({ width: 150, height: 200 }),
        Effect.zipRight(Canvas.dimensions),
        Effect.map(({ height, width }) => assert.deepEqual({ width, height }, { width: 150, height: 200 }))
      ))
  })

  describe('toDataURL', () => {
    it('should get a data URL for the canvas', () =>
      pipe(
        C.toDataURL,
        Effect.tap((_) => Effect.log(`The url is ${_}`)),
        Effect.map((dataURL) => assert.deepStrictEqual(dataURL, 'data:image/png;base64,00'))
      ))
  })

  describe('setFillStyle', () => {
    const fillStyle = '#0000ff'
    it('should set the current fill style', () =>
      pipe(
        Effect.zipLeft((C.Tag), C.setFillStyle(fillStyle)),
        Effect.map((ctx) => assert.equal(ctx.fillStyle, fillStyle))
      ))
  })

  describe('font', () => {
    it('should get the current font', () =>
      pipe(
        C.getFont(),
        Effect.zip((Canvas.Tag)),
        Effect.map(([font, ctx]) => assert.strictEqual(font, ctx.font))
      ))
    it('font', () =>
      pipe(
        C.getFont(),
        Effect.map((font) => assert.equal(font, '10px sans-serif'))
      ))
    it('setFont', () =>
      pipe(
        C.setFont('12px serif'),
        Effect.zipRight(Canvas.getFont()),
        Effect.map((font) => assert.equal(font, '12px serif'))
      ))
  })

  describe('globalAlpha', () => {
    it('globalAlpha', () =>
      pipe(
        Canvas.globalAlpha,
        Effect.map((globalAlpha) => assert.equal(globalAlpha, 1))
      ))
    it('setglobalAlpha', () =>
      pipe(
        Canvas.setGlobalAlpha(0.5),
        Effect.zipRight(Canvas.globalAlpha),
        Effect.map((globalAlpha) => assert.equal(globalAlpha, 0.5))
      ))
  })
  describe('globalCompositeOperation', () => {
    it('globalCompositeOperation', () =>
      pipe(
        Canvas.globalCompositeOperation,
        Effect.map((globalCompositeOperation) => assert.equal(globalCompositeOperation, 'source-over'))
      ))
    it('setglobalCompositeOperation', () =>
      pipe(
        Canvas.setGlobalCompositeOperation('color-burn'),
        Effect.zipRight(Canvas.globalCompositeOperation),
        Effect.map((globalCompositeOperation) => assert.equal(globalCompositeOperation, 'color-burn'))
      ))
  })

  describe('imageSmoothingEnabled', () => {
    it('imageSmoothingEnabled', () =>
      pipe(
        Canvas.imageSmoothingEnabled,
        Effect.map((imageSmoothingEnabled) => assert.equal(imageSmoothingEnabled, true))
      ))
    it('setImageSmoothingEnabled', () =>
      pipe(
        Canvas.setImageSmoothingEnabled(false),
        Effect.zipRight(Canvas.imageSmoothingEnabled),
        Effect.map((imageSmoothingEnabled) => assert.equal(imageSmoothingEnabled, false))
      ))
  })
  it('moveTo', () =>
    pipe(
      Canvas.moveTo(0, 0),
      Effect.flatMap((_) => (Canvas.Tag)),
      Effect.map((ctx) => expect(ctx.moveTo as Mock).to.have.toHaveBeenCalledWith(0, 0))
    ))
  it('lineTo', () =>
    pipe(
      Canvas.lineTo(0, 0),
      Effect.flatMap((_) => (Canvas.Tag)),
      Effect.map((ctx) => expect(ctx.lineTo as Mock).to.have.toHaveBeenCalledWith(0, 0))
    ))
  it('fill', () =>
    pipe(
      Canvas.fill(),
      Effect.zipRight((Canvas.Tag)),
      Effect.map((ctx) => expect(ctx.fill as Mock).to.have.toHaveBeenCalledWith())
    ))
  it('stroke', () =>
    pipe(
      Canvas.stroke(),
      Effect.flatMap((_) => (Canvas.Tag)),
      Effect.map((ctx) => expect(ctx.stroke as Mock).to.have.toHaveBeenCalledWith())
    ))

  describe('canvas stack', () => {
    it('save', () =>
      pipe(
        Canvas.save,
        Effect.flatMap((_) => (Canvas.Tag)),
        Effect.map((ctx) => expect(ctx.save as Mock).to.have.toHaveBeenCalledWith())
      ))
    it('restore', () =>
      pipe(
        Canvas.restore,
        Effect.flatMap((_) => (Canvas.Tag)),
        Effect.map((ctx) => expect(ctx.restore as Mock).to.have.toHaveBeenCalledWith())
      ))
    describe('withContext', () => {
      it('calls save, runs program then restore', () =>
        pipe(
          Effect.zipLeft((C.Tag), C.withContext(C.beginPath)),
          Effect.map((ctx) => {
            expect(ctx.save as Mock).to.have.toHaveBeenCalled()
            expect(ctx.beginPath as Mock).to.have.toHaveBeenCalled()
            expect(ctx.restore as Mock).to.have.toHaveBeenCalled()
          })
        ))

      it('restores context on defect', () =>
        pipe(
          Canvas.withContext(pipe(Canvas.beginPath, Effect.zipLeft(Effect.die(`Failure`)))),
          (effect) => Effect.catchAllDefect(effect, _ => pipe(
            Effect.logError(`failed running withContext effect`),
            Effect.zipRight((Canvas.Tag))
          )),
          Effect.zipRight((C.Tag)),
          Effect.map((ctx) => {
            expect(ctx.restore as Mock).to.have.toHaveBeenCalledOnce()
          })
        ))
    })
  })

  describe('globalAlpha', () => {
    testM('should set the current global alpha', () => {
      const globalAlpha = 0.5
      return pipe(
        C.setGlobalAlpha(globalAlpha),
        Effect.zipRight((C.Tag)),
        Effect.map((ctx) => assert.strictEqual(ctx.globalAlpha, globalAlpha))
      )
    })
  })

  describe('globalCompositeOperation', () => {
    testM('should set the current global composite operation', () => {
      const globalCompositeOperation = 'multiply'
      return pipe(
        C.setGlobalCompositeOperation(globalCompositeOperation),
        Effect.zipRight(C.globalCompositeOperation),
        Effect.map((op) => assert.strictEqual(op, globalCompositeOperation))
      )
    })
  })

  describe('imageSmoothingEnabled', () => {
    it('should set the image smoothing property', () => {
      const imageSmoothingEnabled = true
      return pipe(
        C.setImageSmoothingEnabled(imageSmoothingEnabled),
        Effect.zipRight(C.imageSmoothingEnabled),
        Effect.map((op) => assert.strictEqual(op, imageSmoothingEnabled))
      )
    })
  })
  describe('lineCap', () => {
    it('should set the current line cap', () => {
      const lineCap = 'round'
      return pipe(
        C.setLineCap(lineCap),
        Effect.zipRight(C.lineCap),
        Effect.map((op) => assert.strictEqual(op, lineCap))
      )
    })
  })

  describe('setLineDashOffset', () => {
    testM('should set the current line dash offset', () => {
      const expected = 4
      return pipe(
        C.setLineDashOffset(expected),
        Effect.zipRight(C.lineDashOffset),
        Effect.map((actual) => assert.strictEqual(actual, expected))
      )
    })
  })

  describe('setLineJoin', () => {
    testM('should set the current line join', () => {
      const expected = 'round'
      return pipe(
        C.setLineJoin(expected),
        Effect.zipRight(C.lineJoin),
        Effect.map((actual) => assert.strictEqual(actual, expected))
      )
    })
  })

  describe('setLineWidth', () => {
    testM('should set the current line width', () => {
      const expected = 5
      return pipe(
        C.setLineWidth(expected),
        Effect.zipRight(C.lineWidth),
        Effect.map((actual) => assert.strictEqual(actual, expected))
      )
    })
  })


  describe('setShadowBlur', () => {
    testM('should set the current shadow blur', () => {
      const expected = 10
      return pipe(
        C.setShadowBlur(expected),
        Effect.zipRight(C.shadowBlur),
        Effect.map((actual) => assert.strictEqual(actual, expected))
      )
    })
  })
  describe('setShadowColor', () => {
    testM('should set the current shadow Color', () => {
      const expected = '#0000ff'
      return pipe(
        C.setShadowColor(expected),
        Effect.zipRight(C.shadowColor),
        Effect.map((actual) => assert.strictEqual(actual, expected))
      )
    })
  })

  describe('setShadowOffsetX', () => {
    testM('should set the current shadow OffsetX', () => {
      const expected = 20
      return pipe(
        C.setShadowOffsetX(expected),
        Effect.zipRight(C.shadowOffsetX),
        Effect.map((actual) => assert.strictEqual(actual, expected))
      )
    })
  })

  describe('setShadowOffsetY', () => {
    testM('should set the current shadow OffsetY', () => {
      const expected = 20
      return pipe(
        C.setShadowOffsetY(expected),
        Effect.zipRight(C.shadowOffsetY),
        Effect.map((actual) => assert.strictEqual(actual, expected))
      )
    })
  })

  describe('setStrokeStyle', () => {
    testM('should set the current stroke style', () => {
      const expected = '#0000ff'
      return pipe(
        C.setStrokeStyle(expected),
        Effect.zipRight(C.strokeStyle),
        Effect.map((actual) => assert.strictEqual(actual, expected))
      )
    })
  })

  describe('textAlign', () => {
    testM('should get the current text align', () => {
      return pipe(
        C.textAlign,
        Effect.zip((C.Tag)),
        Effect.map(([actual, ctx]) => assert.strictEqual(actual, ctx.textAlign))
      )
    })
    testM('should set the current text align', () => {
      const expected = 'center'
      return pipe(
        C.setTextAlign(expected),
        Effect.zipRight(C.textAlign),
        Effect.map((actual) => assert.strictEqual(actual, expected))
      )
    })
  })

  describe('textBaseline', () => {
    testM('should get the current text baseline', () =>
      pipe(
        C.textBaseline,
        Effect.zip((C.Tag)),
        Effect.map(([actual, ctx]) => assert.strictEqual(actual, ctx.textBaseline))
      )
    )
    testM('should set', () => {
      const expected = 'hanging'
      return pipe(
        C.setTextBaseline(expected),
        Effect.zipRight(C.textBaseline),
        Effect.map((actual) => assert.strictEqual(actual, expected))
      )
    })
  })

  describe('painting', () => {
    let testCtx: CanvasRenderingContext2D
    beforeEach(() => {
      document.body.innerHTML = `
<canvas
id="${CANVAS_ID}"
width="${CANVAS_WIDTH}"
height="${CANVAS_HEIGHT}"
/>
<canvas
id="${TEST_CANVAS_ID}"
width="${CANVAS_WIDTH}"
height="${CANVAS_HEIGHT}"
/>
`
      const testCanvas = document.getElementById(TEST_CANVAS_ID) as HTMLCanvasElement
      testCtx = testCanvas.getContext('2d') as CanvasRenderingContext2D
    })
    describe('arc', () => {
      testM('should render an arc to the canvas', () => {
        const arc = S.arc(100, 75, 50, S.radians(0), S.radians(2 * Math.PI))
        // Test
        const expected = Effect.sync(() => {
          // Actual
          testCtx.arc(arc.x, arc.y, arc.r, arc.start, arc.end)
          return (testCtx as any).__getEvents()
        })

        return testCanvas(C.arc(arc.x, arc.y, arc.r, arc.start, arc.end), expected)
      })
      })

    describe('arcTo', () => {
      testM('should render an arc that is automatically connected to the latest point in the path', () => {
        const x1 = 200
        const y1 = 130
        const x2 = 50
        const y2 = 20
        const r = 40
        // Actual
        const expected = Effect.sync(() => {
          testCtx.arcTo(x1, y1, x2, y2, r)
          return (testCtx as any).__getEvents()
        })
        const sut = pipe(
          C.arcTo(x1, y1, x2, y2, r),
          Effect.zipRight((C.Tag))
        )
        return testCanvas(sut, expected)
      })
    })

    describe('beginPath', () => {
      testM('should begin drawing a path', () => {
        const actual = Effect.zipLeft((C.Tag), C.beginPath)
        const expected = Effect.sync(() => {
          testCtx.beginPath()
          return testCtx
        })
        return testCanvas(actual, expected)
      })
    })

    describe('bezierCurveTo', () => {
      testM('should render a cubic Bezier curve', () => {
        const point = S.point(50, 20)
        const cpx1 = 230
        const cpy1 = 30
        const cpx2 = 150
        const cpy2 = 80
        const x = 250
        const y = 100

        // Test
        const test = pipe(
          C.strokePath(
            Effect.all([
              C.beginPath,
              C.moveTo(point.x, point.y),
              C.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)
            ], { discard: true })
          ),
          Effect.zipRight((C.Tag)),
          Effect.map((ctx) => expect(ctx.bezierCurveTo as Mock).toHaveBeenCalledWith(cpx1, cpy1, cpx2, cpy2, x, y))
        )
        return test
      })
    })

    describe('clearRect', () => {
      testM('should render a filled rectangle to the canvas', () => {
        const rect = S.rect(10, 20, 150, 100)
        return pipe(
          C.clearRect(rect.x, rect.y, rect.width, rect.height),
          Effect.zipRight((Canvas.Tag)),
          Effect.map((ctx) => expect(ctx.clearRect as Mock).toHaveBeenCalledWith(rect.x, rect.y, rect.width, rect.height))
        )
      })
    })
    describe('clip', () => {
      testM('should clip a path', () => {
        // Test
        const sut = pipe(
          C.beginPath,
          Effect.zipRight(C.clip()),
          Effect.zipRight((Canvas.Tag)),
        )

        // Actual
        const expected = Effect.sync( () => {
          testCtx.beginPath()
          testCtx.clip()
          return (testCtx as any).__getEvents()
        })
        return testCanvas(sut, expected)
      })

      testM('should clip a path with a specified fill rule', () => {
        const fillRule = 'evenodd'
        // Test
        const sut = pipe(
          C.beginPath,
          Effect.zipRight(C.clip(fillRule)),
          Effect.zipRight((Canvas.Tag)),
        )

        // Actual
        const expected = Effect.sync( () => {
          testCtx.beginPath()
          testCtx.clip(fillRule)
          return (testCtx as any).__getEvents()
          // return testCtx
        })
        return testCanvas(sut, expected)
      })

      testM('should clip a specified path', () => {
        const fillRule = 'nonzero'
        const path = new Path2D()
        path.rect(10, 10, 100, 100)
        const sut = pipe(C.beginPath, Effect.zipRight(C.clip(fillRule, path)),
          Effect.zipRight((Canvas.Tag)),
        )
        const expected = Effect.sync(() => {
          testCtx.beginPath()
          testCtx.clip(path, fillRule)
          return testCtx
        })
        return testCanvas(sut, expected)
      })
    })


    describe('closePath', () => {
      testM('should close the current path', () => {
        const sut = pipe(
          C.beginPath,
          Effect.zipRight(C.stroke()),
          Effect.zipRight(C.closePath),
          Effect.zipRight((Canvas.Tag)),
        )
        const expected = Effect.sync(() => {
          testCtx.beginPath()
          testCtx.stroke()
          testCtx.closePath()
          return testCtx
        })
        return testCanvas(sut, expected)
      })
    })

    describe('createImageData', () => {
      testM('should create a new ImageData object', () => {
        const sw = 100
        const sh = 50
        const sut = C.createImageData(sw, sh)
        const expected = Effect.sync(() => {
          return testCtx.createImageData(sw, sh)
        })
        return pipe(
          sut,
          Effect.zip(expected),
          Effect.map(([sut, expected]) => assert.deepStrictEqual(sut, expected))
        )
      })
    })

    describe('createImageDataCopy', () => {
      testM('should create a copy of an ImageData object', () => {
        const sw = 100
        const sh = 50
        return pipe(
          C.createImageData(sw, sh),
          Effect.flatMap((d) => pipe(C.createImageDataCopy(d), Effect.zip(Effect.succeed(d)))),
          Effect.map(([copy, original]) => assert.deepStrictEqual(copy, original))
        )
      })
    })
  })
})
