import { Foldable } from '@effect/typeclass/data/ReadonlyArray'
import { pipe } from 'effect/Function'
import { Effect as IO, Option as O, Equal } from 'effect'
import { beforeEach, expect, describe, it, assert } from 'vitest'

import * as Color from '../src/Color'
import * as D from '../src/Drawing'
import * as C from '../src/Canvas'
import * as F from '../src/Font'
import * as S from '../src/Shape'
import { testM, testDrawing, testCanvas } from './utils'

describe('Drawing', () => {
  const getCanvas = IO.zipRight(C.Tag.pipe(IO.map((canvas) => canvas)))
  const sampleDrawing = D.fill(S.rect(0, 0, 100, 100), D.outlineColor(Color.black))
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

      assert(D.monoidFillStyle.combineAll([first, second]).color[Equal.symbol](O.some(Color.black)))
    })

    describe('example', () => {
      it('should work', () => {
        const expected = {
          color: O.some(Color.black),
          lineWidth: O.some(5)
        }
        const actual = D.monoidOutlineStyle.combineAll([
          D.outlineColor(Color.black),
          D.outlineColor(Color.white),
          D.lineWidth(5)
        ])
        assert(actual.color[Equal.symbol](expected.color))
        assert(actual.lineWidth[Equal.symbol](expected.lineWidth))
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
  describe('clipped', () => {
    it('should construct a clipped drawing', () => {
      const shape = S.rect(50, 50, 100, 100)
      const drawing = D.outline(S.rect(10, 20, 100, 200), D.outlineColor(Color.black))
      const clipped = D.clipped(shape)(drawing)

      assert.deepStrictEqual(clipped, {
        _tag: 'Clipped',
        shape,
        drawing
      })
    })
  })

  describe('fill', () => {
    const color = Color.hsla(150, 0.5, 0.5, 0.8)
    const shape = S.rect(10, 20, 100, 200)
    const style = D.fillStyle(color)
    const expected = {
      _tag: 'Fill', 
      shape,
      style
    }
    it('should construct a fill', () => assert.deepStrictEqual(D.fill(shape, style), expected))
    it('should support data-last a fill', () =>
      expect(D.fill(style)(shape)).to.deep.equal(expected))
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
    describe('dual api', () => {
      it('should support data-last', () =>
        expect(
          D.outline(S.rect(10, 10, 100, 100), D.outlineColor(Color.black))
        ).to.be.ok
      )
      it('should support data-last', () =>
        expect(
          D.outline(D.outlineColor(Color.black))(S.rect(10, 10, 100, 100))
        ).to.be.ok
      )
    })
  })

  describe('rotate', () => {
    it('should construct a rotated drawing', () => {
      const drawing = D.outline(S.rect(10, 20, 100, 200), D.outlineColor(Color.black))
      const rotate = D.rotate(90)(drawing)

      assert.deepStrictEqual(rotate, {
        _tag: 'Rotate',
        angle: 90,
        drawing
      })
    })

    it('should support data-first', () => 
      expect(D.rotate(sampleDrawing, 90)).to.deep.equal({
        _tag: 'Rotate',
        angle: 90,
        drawing: sampleDrawing,
      })
    )
  })

  describe('scale', () => {
    const drawing = D.outline(S.rect(10, 20, 100, 200), D.outlineColor(Color.black)),
      scaleX = 10,
      scaleY = 20,
      expected = {
        _tag: 'Scale',
        scaleX,
        scaleY,
        drawing
      }
    it('should construct a scaled drawing', () =>
      assert.deepStrictEqual(D.scale(scaleX, scaleY)(drawing), expected))
    it('should support data-lasta scaled drawing', () =>
      assert.deepStrictEqual(D.scale(drawing, scaleX, scaleY), expected))
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
    const drawing = D.outline(S.rect(10, 20, 100, 200), D.outlineColor(Color.black))
    const expected = {
      _tag: 'Translate',
      translateX: 10,
      translateY: 20,
      drawing

    }

    it('should construct a translated drawing', () => {
      const translate = D.translate(10, 20)(drawing)
      assert.deepStrictEqual(translate, expected)
    })
    it('supports data first', () => expect(D.translate(drawing, 10, 20)).to.deep.equal(expected))
  })

  describe('withShadow', () => {
    const drawing = D.outline(S.rect(10, 20, 100, 200), D.outlineColor(Color.black))
    const shadow = D.monoidShadow.combineAll([
      D.shadowColor(Color.black),
      D.shadowBlur(5),
      D.shadowOffset(S.point(5, 5))
    ])
    const expected = {
        _tag: 'WithShadow',
        shadow,
        drawing
      }
    it('should construct a drawing with a shadow', () => {
      const withShadow = D.withShadow(shadow)(drawing)
      assert.deepStrictEqual(withShadow, expected)
    })
    it('should support data-first', () => {
      expect(D.withShadow(drawing, shadow)).to.deep.equal(expected)
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


  describe('destructors', () => {
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

    describe('render()', () => {
      const shape = S.rect(50, 50, 100, 100)
      const drawing = D.outline(shape, D.outlineColor(Color.black))
      it('should provide live shape and draw layers', () => {
        const expected = IO.sync(() => {
          testCtx.save()
          testCtx.strokeStyle = pipe(Color.black, Color.toCss)
          testCtx.beginPath()
          testCtx.rect(shape.x, shape.y, shape.width, shape.height)
          testCtx.stroke()
          testCtx.restore()
          return (testCtx as any).__getEvents()
        })
        const test =  testCanvas(
          IO.zipRight(D.render(drawing), C.Tag),
          expected,
        )
        return IO.runPromise(C.renderTo(CANVAS_ID)(test))
      })
    })

    describe('draw()', () => {
      testM('should draw a clipped drawing', () => {
        const mask = S.rect(50, 50, 50, 50)
        const outline = S.rect(10, 20, 20, 20)
        const color = D.outlineColor(Color.black)
        const outlineRect = D.outline(outline, color)
        const drawing = D.clipped(mask)(outlineRect)
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
        return testDrawing(IO.zipRight(C.Tag)(D.draw(drawing)).pipe(getCanvas), actual)
      })

      describe('outlined', () => {
        testM('should draw an outlined drawing', () => {
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
          const eff =  D.draw(drawing).pipe(
            IO.zipRight(C.Tag.pipe(
              IO.map((canvas: any) => canvas.__getEvents()),
            )),
            IO.zip(actual),
            IO.map(([a, b]) => assert.deepStrictEqual(a, b))
          )
          return eff
        })

      })

      testM('should draw a rotated drawing', () => {
        const shape = S.rect(50, 50, 100, 100)
        const drawing = D.rotate(90)(D.outline(shape, D.outlineColor(Color.white)))

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
        return testDrawing(
          D.draw(drawing).pipe(getCanvas),
          actual,
        )
      })

      testM('should draw a scaled drawing', () => {
        const scaleX = 5
        const scaleY = 5
        const shape = S.arc(10, 20, 5, S.degrees(100), S.degrees(200))
        const drawing = pipe(
          D.outline(shape, D.outlineColor(Color.white)),
          D.scale(scaleX, scaleY)
        )
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
        return testDrawing(D.draw(drawing).pipe(getCanvas), actual)
      })

      testM('should draw text', () => {
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
        return testDrawing(D.draw(drawing).pipe(getCanvas), actual)
      })

      testM('should draw a translated drawing', () => {
        const translateX = 5
        const translateY = 5
        const shape = S.rect(50, 50, 100, 100)
        const drawing = D.translate(translateX, translateY)(D.outline(shape, D.outlineColor(Color.white)))

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
        return testDrawing(
          IO.zipRight(C.Tag)(D.draw(drawing)).pipe(getCanvas),
          actual)
      })

      testM('should draw a drawing with a shadow', () => {
        const blurRadius = 10
        const offset = S.point(2, 2)
        const rect = S.rect(10, 20, 100, 200)
        const path = S.path(Foldable)([S.point(1, 2), S.point(3, 4), S.point(5, 6)])
        const shape = S.composite([rect, path])
        const shadow = D.monoidShadow.combineAll([
          D.shadowColor(Color.black),
          D.shadowBlur(blurRadius),
          D.shadowOffset(offset)
        ])
        const drawing = D.withShadow(shadow)(D.outline(shape, D.outlineColor(Color.white)))

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
        return testDrawing(IO.zipRight(C.Tag)(D.draw(drawing))
          .pipe(getCanvas), actual)
      })
    })
  })
})
