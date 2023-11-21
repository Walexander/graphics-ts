import { Effect } from 'effect'
import { pipe } from 'effect/Function'
import { it, beforeEach, describe, expect } from 'vitest'
import * as Shape from '../../src/Shape'
import * as C from '../../src/Canvas'
import * as DS from '../../src/Drawable/Shape'
import { Foldable } from '@effect/typeclass/data/ReadonlyArray'


describe('Drawable/Shape', () => {
  const CANVAS_ID = 'canvas'
  const CANVAS_WIDTH = 400
  const CANVAS_HEIGHT = 600

  beforeEach(() => {
    document.body.innerHTML = `<canvas id="${CANVAS_ID}" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" /> `
  })

  function testM(shape: Shape.Shape, assertion: (ctx: CanvasRenderingContext2D) => void) {
    return pipe(
      DS.drawShape(shape),
      Effect.zipRight(Effect.map(C.Tag, assertion))),
      Effect.provide(DS.Live),
      C.renderTo(CANVAS_ID),
      Effect.orDie,
      Effect.runPromise
  }

  describe('circle', () => {
    it('should draw a whole circle, duh!', () => {
      return pipe(
        testM(Shape.circle(5, 5, 25), (canvas) => {
          expect(canvas.arc).toHaveBeenCalledWith(5, 5, 25, 0, Math.PI * 2, false)
        })
      )
    })
  })
  describe('Rect', () => {
    it('should draw a rectangle', () => {
      return pipe(
        testM(Shape.rect(5, 5, 25, 25), (canvas) => {
          expect(canvas.rect).toHaveBeenCalledWith(5, 5, 25, 25)
        })
      )
    })
  })

  describe('Rect', () => {
    it('should draw a rectangle', () => {
      return pipe(
        testM(Shape.rect(5, 5, 25, 25), (canvas) => {
          expect(canvas.rect).toHaveBeenCalledWith(5, 5, 25, 25)
        })
      )
    })
  })
  describe('Ellipse', () => {
    it('should draw an ellipse', () => {
      const ellipse = Shape.ellipse(
        5,
        6,
        7,
        8,
        Shape.radians(9),
        Shape.radians(10),
        Shape.radians(11),
        true
      )
      return testM(ellipse, (canvas) => {
        expect(canvas.ellipse).toHaveBeenCalledWith(
          ellipse.x,
          ellipse.y,
          ellipse.rx,
          ellipse.ry,
          ellipse.rotation,
          ellipse.start,
          ellipse.end,
          ellipse.anticlockwise
        )
      })
    })
  })

  describe('Path', () => {
    const path = [
      { x: 0, y: 1 },
      { x: 2, y: 3 }
    ]
    const closed = Shape.closed(Foldable)(path)
    it('should move to the head of the path', () => {
      return pipe(
        testM(closed, (canvas) => {
          expect(canvas.moveTo).toHaveBeenCalledWith(path[0].x, path[0].y)
        })
      )
    })
    it('should line to the next element', () => {
      return pipe(
        testM(closed, (canvas) => {
          expect(canvas.lineTo).toHaveBeenCalledWith(path[1].x, path[1].y)
        })
      )
    })
    describe('closed', () => {
      it('should call closePath', () => {
        return pipe(
          testM(closed, (canvas) => {
            expect(canvas.closePath).toHaveBeenCalledWith()
          })
        )
      })
    })
    describe('open', () => {
      it('should not close open path', () => {
        return pipe(
          testM(closed, (canvas) => {
            expect(canvas.closePath).not.toHaveBeenCalled()
          })
        )
      })
    })
  })

  describe.skip('Image', async () => {
    // const img = await createImageBitmap(new ImageData(CANVAS_WIDTH, CANVAS_HEIGHT))
    it.skip('should draw an image', () => {
      // const image = Shape.image(img, Shape.point(0,0))
      // return testM(image, canvas => expect(canvas.drawImage).toHaveBeenCalledWith(img, 0, 0))
    })
  })

})
