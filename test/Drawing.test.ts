import * as assert from 'assert'
import * as IO from '@effect/io/Effect'
import * as M from '@fp-ts/core/typeclass/Monoid'
import * as O from '@fp-ts/core/Option'
import * as ROA from '@fp-ts/core/ReadonlyArray'
import { pipe } from '@fp-ts/core/Function'

import * as C from '../src/Canvas'
import * as Color from '../src/Color'
import * as D from '../src/Drawing'
import * as F from '../src/Font'
import * as S from '../src/Shape'
import { it as vit } from 'vitest'
const testM = (label: string, test: () => IO.Effect<CanvasRenderingContext2D, never, unknown>) =>
  vit(label, () => pipe(test(), IO.provideLayer(pipe(C.fromId('canvas'))), IO.runPromise))

const testCanvas = (
  eff: IO.Effect<CanvasRenderingContext2D, never, CanvasRenderingContext2D>,
  actual: IO.Effect<never, never, any>
) =>
  pipe(
    eff,
    IO.map((ctx) => (ctx as any).__getEvents()),
    IO.zip(actual),
    IO.map(([a, b]) => assert.deepStrictEqual(a, b))
  )

describe('Drawing', () => {
  describe('fillStyle', () => {
    it('should construct a fill style', () => {
      const color = Color.hsla(140, 0.3, 0.5, 0.9)

      assert.deepStrictEqual(D.fillStyle(color), {
        color: O.some(color)
      })
    })
  })

  describe('monoidFillStyle', () => {
    it('should combine fill styles', () => {
      const first = D.fillStyle(Color.black)
      const second = D.fillStyle(Color.white)

      assert.deepStrictEqual(D.monoidFillStyle.combineAll([first, second]), {
        color: O.some(Color.black)
      })
    })
  })

  describe('outlineColor', () => {
    it('should construct an outline style from a color', () => {
      const color = Color.hsla(140, 0.3, 0.5, 0.9)

      assert.deepStrictEqual(D.outlineColor(color), {
        color: O.some(color),
        lineWidth: O.none()
      })
    })
  })

  describe('lineWidth', () => {
    it('should construct an outline style from a lineWidth', () => {
      const lineWidth = 10

      assert.deepStrictEqual(D.lineWidth(lineWidth), {
        color: O.none(),
        lineWidth: O.some(lineWidth)
      })
    })
  })

  describe('monoidOutlineStyle', () => {
    it('should combine outline styles', () => {
      const color = Color.hsla(140, 0.3, 0.5, 0.9)
      const lineWidth = 10

      assert.deepStrictEqual(
        D.monoidOutlineStyle.combine(
          D.outlineColor(color),
          D.lineWidth(lineWidth)
        ), {
          color: O.some(color),
          lineWidth: O.some(lineWidth)
        }
      )
    })
  })

  describe('shadowBlur', () => {
    it('should construct a shadow from a blur radius', () => {
      const blur = 5

      assert.deepStrictEqual(D.shadowBlur(blur), {
        color: O.none(),
        blur: O.some(blur),
        offset: O.none()
      })
    })
  })

  describe('shadowColor', () => {
    it('should construct a shadow from a color', () => {
      const color = Color.hsla(140, 0.3, 0.5, 0.9)

      assert.deepStrictEqual(D.shadowColor(color), {
        color: O.some(color),
        blur: O.none(),
        offset: O.none()
      })
    })
  })

  describe('shadowOffset', () => {
    it('should construct a shadow from an offset point', () => {
      const offset = S.point(5, 5)

      assert.deepStrictEqual(D.shadowOffset(offset), {
        color: O.none(),
        blur: O.none(),
        offset: O.some(offset)
      })
    })
  })

  // describe('monoidShadow', () => {
  //   it('should combine shadow styles', () => {
  //     const color = Color.hsla(140, 0.3, 0.5, 0.9)
  //     const blur = 5
  //     const offset = S.point(5, 5)

  //     assert.deepStrictEqual(
  //       M.fold(D.monoidShadow)([D.shadowColor(color), D.shadowBlur(blur), D.shadowOffset(offset)]),
  //       {
  //         color: O.some(color),
  //         blur: O.some(blur),
  //         offset: O.some(offset)
  //       }
  //     )
  //   })
  // })

  describe('clipped', () => {
    it('should construct a clipped drawing', () => {
      const shape = S.rect(50, 50, 100, 100)
      const drawing = D.outline(S.rect(10, 20, 100, 200), D.outlineColor(Color.black))
      const clipped = D.clipped(shape, drawing)

      assert.deepStrictEqual(clipped, {
        _tag: 'Clipped',
        shape,
        drawing
      })
    })
  })

  describe('fill', () => {
    it('should construct a fill', () => {
      const color = Color.hsla(150, 0.5, 0.5, 0.8)
      const shape = S.rect(10, 20, 100, 200)
      const style = D.fillStyle(color)

      assert.deepStrictEqual(D.fill(shape, style), {
        _tag: 'Fill',
        shape,
        style
      })
    })
  })

  describe('many', () => {
    it('should construct an object containing many drawings', () => {
      const fill = D.fill(S.rect(10, 20, 100, 200), D.fillStyle(Color.white))
      const outline = D.outline(S.rect(10, 20, 100, 200), D.outlineColor(Color.black))
      const text = D.text(F.font('serif', 28), 10, 100, D.fillStyle(Color.black), 'Hello world!')

      assert.deepStrictEqual(D.many([fill, outline, text]), {
        _tag: 'Many',
        drawings: [fill, outline, text]
      })
    })
  })

  describe('outline', () => {
    it('should construct an outline', () => {
      const color = Color.hsla(150, 0.5, 0.5, 0.8)
      const shape = S.rect(10, 20, 100, 200)
      const style = D.outlineColor(color)

      assert.deepStrictEqual(D.outline(shape, style), {
        _tag: 'Outline',
        shape,
        style
      })
    })
  })

  describe('rotate', () => {
    it('should construct a rotated drawing', () => {
      const drawing = D.outline(S.rect(10, 20, 100, 200), D.outlineColor(Color.black))
      const rotate = D.rotate(90, drawing)

      assert.deepStrictEqual(rotate, {
        _tag: 'Rotate',
        angle: 90,
        drawing
      })
    })
  })

  describe('scale', () => {
    it('should construct a scaled drawing', () => {
      const drawing = D.outline(S.rect(10, 20, 100, 200), D.outlineColor(Color.black))
      const scale = D.scale(10, 20, drawing)

      assert.deepStrictEqual(scale, {
        _tag: 'Scale',
        scaleX: 10,
        scaleY: 20,
        drawing
      })
    })
  })

  describe('text', () => {
    it('should construct a text', () => {
      const font = F.font('serif', 28)
      const style = D.fillStyle(Color.black)

      assert.deepStrictEqual(D.text(font, 10, 100, style, 'Hello world!'), {
        _tag: 'Text',
        font,
        x: 10,
        y: 100,
        style,
        text: 'Hello world!'
      })
    })
  })

  describe('translate', () => {
    it('should construct a translated drawing', () => {
      const drawing = D.outline(S.rect(10, 20, 100, 200), D.outlineColor(Color.black))
      const translate = D.translate(10, 20, drawing)

      assert.deepStrictEqual(translate, {
        _tag: 'Translate',
        translateX: 10,
        translateY: 20,
        drawing
      })
    })
  })

  describe('withShadow', () => {
    it('should construct a drawing with a shadow', () => {
      const shadow = D.monoidShadow.combineAll([
        D.shadowColor(Color.black),
        D.shadowBlur(5),
        D.shadowOffset(S.point(5, 5))
      ])
      const drawing = D.outline(S.rect(10, 20, 100, 200), D.outlineColor(Color.black))
      const withShadow = D.withShadow(shadow, drawing)

      assert.deepStrictEqual(withShadow, {
        _tag: 'WithShadow',
        shadow,
        drawing
      })
    })
  })

  describe('monoidDrawing', () => {
    it('should combine several drawings', () => {
      const fill = D.fill(S.rect(10, 20, 100, 200), D.fillStyle(Color.white))
      const outline = D.outline(S.rect(10, 20, 100, 200), D.outlineColor(Color.black))
      const text = D.text(F.font('serif', 28), 10, 100, D.fillStyle(Color.black), 'Hello world!')
      const many = D.many([fill, outline])

      // concat(Drawing, Drawing)
      assert.deepStrictEqual(D.monoidDrawing.combine(fill, outline), {
        _tag: 'Many',
        drawings: [fill, outline]
      })

      // concat(Many, Drawing)
      assert.deepStrictEqual(D.monoidDrawing.combine(many, text), {
        _tag: 'Many',
        drawings: [fill, outline, text]
      })

      // concat(Drawing, Many)
      assert.deepStrictEqual(D.monoidDrawing.combine(text, many), {
        _tag: 'Many',
        drawings: [text, fill, outline]
      })

      // concat(Many, Many)
      assert.deepStrictEqual(D.monoidDrawing.combine(many, many), {
        _tag: 'Many',
        drawings: [fill, outline, fill, outline]
      })
    })
  })

  describe('render', () => {
    const CANVAS_ID = 'canvas'
    const TEST_CANVAS_ID = 'test-canvas'
    const CANVAS_WIDTH = 400
    const CANVAS_HEIGHT = 600

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

    // const render: <A>(fa: C.Render<A>) => IO.IO<A> = (fa) => pipe(canvas, C.getContext2D, IO.chain(fa))

    testM('should render a clipped drawing', () => {
      const mask = S.rect(50, 50, 50, 50)
      const outline = S.rect(10, 20, 20, 20)
      const color = D.outlineColor(Color.black)
      const outlineRect = D.outline(outline, color)
      const drawing = D.clipped(mask, outlineRect)
      const actual = IO.sync(() => {
        testCtx.save()
        testCtx.beginPath()
        testCtx.rect(mask.x, mask.y, mask.width, mask.height)
        testCtx.clip()
        testCtx.save()
        testCtx.strokeStyle = pipe(Color.black, Color.toCss)
        testCtx.beginPath()
        testCtx.rect(outline.x, outline.y, outline.width, outline.height)
        testCtx.stroke()
        testCtx.restore()
        testCtx.restore()
        return (testCtx as any).__getEvents()
      })
      return testCanvas(D.render(drawing), actual)
    })

    testM('should render an outlined drawing', () => {
      const shape = S.rect(50, 50, 100, 100)
      const drawing = D.outline(shape, D.outlineColor(Color.white))
      // Test

      // Actual
      const actual = IO.sync(() => {
        testCtx.save()
        testCtx.strokeStyle = pipe(Color.white, Color.toCss)
        testCtx.beginPath()
        testCtx.rect(shape.x, shape.y, shape.width, shape.height)
        testCtx.stroke()
        testCtx.restore()
        return (testCtx as any).__getEvents()
      })
      return pipe(
        D.render(drawing),
        IO.map((ctx) => (ctx as any).__getEvents()),
        IO.zip(actual),
        IO.map(([a, b]) => assert.deepStrictEqual(a, b))
      )
    })

    testM('should render a rotated drawing', () => {
      const shape = S.rect(50, 50, 100, 100)
      const drawing = D.rotate(90, D.outline(shape, D.outlineColor(Color.white)))

      // Test

      // Actual
      const actual = IO.sync(() => {
        testCtx.save()
        testCtx.rotate(90)
        testCtx.save()
        testCtx.strokeStyle = pipe(Color.white, Color.toCss)
        testCtx.beginPath()
        testCtx.rect(shape.x, shape.y, shape.width, shape.height)
        testCtx.stroke()
        testCtx.restore()
        testCtx.restore()
        return (testCtx as any).__getEvents()
      })
      return pipe(
        D.render(drawing),
        IO.map((ctx) => (ctx as any).__getEvents()),
        IO.zip(actual),
        IO.map(([a, b]) => assert.deepStrictEqual(a, b))
      )
    })

    testM('should render a scaled drawing', () => {
      const scaleX = 5
      const scaleY = 5
      const shape = S.arc(10, 20, 5, S.degrees(100), S.degrees(200))
      const drawing = D.scale(scaleX, scaleY, D.outline(shape, D.outlineColor(Color.white)))

      // Test
      const actual = IO.sync(() => {
        // Actual
        testCtx.save()
        testCtx.scale(scaleX, scaleY)
        testCtx.save()
        testCtx.strokeStyle = pipe(Color.white, Color.toCss)
        testCtx.beginPath()
        testCtx.arc(shape.x, shape.y, shape.r, shape.start, shape.end)
        testCtx.stroke()
        testCtx.restore()
        testCtx.restore()
        return (testCtx as any).__getEvents()
      })
      return pipe(
        D.render(drawing),
        IO.map((ctx) => (ctx as any).__getEvents()),
        IO.zip(actual),
        IO.map(([a, b]) => assert.deepStrictEqual(a, b))
      )
    })

    testM('should render text', () => {
      const x = 10
      const y = 100
      const text = 'Hello world!'
      const font = F.font('serif', 28)
      const style = D.fillStyle(Color.black)
      const drawing = D.text(font, x, y, style, text)
      // Test

      // Actual
      // con
      const actual = IO.sync(() => {
        testCtx.save()
        testCtx.font = pipe(font, F.showFont.show)
        testCtx.fillStyle = pipe(Color.black, Color.toCss)
        testCtx.fillText(text, x, y)
        testCtx.restore()
        return (testCtx as any).__getEvents()
      })
      return testCanvas(D.render(drawing), actual)
    })

    testM('should render a translated drawing', () => {
      const translateX = 5
      const translateY = 5
      const shape = S.rect(50, 50, 100, 100)
      const drawing = D.translate(translateX, translateY, D.outline(shape, D.outlineColor(Color.white)))

      // Test

      // Actual
      const actual = IO.sync(() => {
        testCtx.save()
        testCtx.translate(translateX, translateY)
        testCtx.save()
        testCtx.strokeStyle = pipe(Color.white, Color.toCss)
        testCtx.beginPath()
        testCtx.rect(shape.x, shape.y, shape.width, shape.height)
        testCtx.stroke()
        testCtx.restore()
        testCtx.restore()
        return (testCtx as any).__getEvents()
      })
      return testCanvas(D.render(drawing), actual)
    })

    testM('should render a drawing with a shadow', () => {
      const blurRadius = 10
      const offset = S.point(2, 2)
      const rect = S.rect(10, 20, 100, 200)
      const path = S.path(ROA.Foldable)([S.point(1, 2), S.point(3, 4), S.point(5, 6)])
      const shape = S.composite([rect, path])
      const shadow = D.monoidShadow.combineAll([
        D.shadowColor(Color.black),
        D.shadowBlur(blurRadius),
        D.shadowOffset(offset)
      ])
      const drawing = D.withShadow(shadow, D.outline(shape, D.outlineColor(Color.white)))

      // Test

      // Actual
      const actual = IO.sync(() => {
        testCtx.save()
        testCtx.shadowColor = pipe(Color.black, Color.toCss)
        testCtx.shadowBlur = blurRadius
        testCtx.shadowOffsetX = offset.x
        testCtx.shadowOffsetY = offset.y
        testCtx.save()
        testCtx.strokeStyle = pipe(Color.white, Color.toCss)
        testCtx.beginPath()
        testCtx.rect(rect.x, rect.y, rect.width, rect.height)
        testCtx.moveTo(1, 2)
        testCtx.lineTo(3, 4)
        testCtx.lineTo(5, 6)
        testCtx.stroke()
        testCtx.restore()
        testCtx.restore()
        return (testCtx as any).__getEvents()
      })
      return testCanvas(D.render(drawing), actual)
    })
  })
})
