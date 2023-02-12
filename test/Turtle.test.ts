import * as IO from '@effect/io/Effect'
import * as Layer from '@effect/io/Layer'
import { pipe } from '@fp-ts/core/Function'
import { assert, it, expect, beforeEach, describe } from 'vitest'

import { Live as DrawsTurtlesLive } from '../src/Drawable/Turtle2d'
import * as T from '../src/Turtle2d'
import * as C from '../src/Canvas'
const CANVAS_ID = 'canvas'
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600
beforeEach(() => {
  document.body.innerHTML = `
    <canvas
      id="${CANVAS_ID}"
      width="${CANVAS_WIDTH}"
      height="${CANVAS_HEIGHT}"
    ></canvas>
  `
})
describe('Turtle2d', () => {

  const TurtleSurface = Layer.provideMerge(
    C.fromId(CANVAS_ID),
    DrawsTurtlesLive,
  )
  it('exists', () => {
    assert.ok(T.Tag)
  })

  describe('Live', () => {
    it('can be summoned', () => {
      const eff = pipe(
        IO.serviceWith(T.Tag, (turtle) => {
          assert.equal(typeof turtle, 'object')
        }),
        IO.provideSomeLayer(T.fromOrigin),
        IO.provideSomeLayer(TurtleSurface)
      )
      return IO.runPromise(eff)
    })
    it('accepts the initial state', () =>
      pipe(
        IO.serviceWith(T.Tag, (turtle) => {
          turtle.drawForward(0), assert.equal(typeof turtle, 'object')
        }),
        IO.provideSomeLayer(
          T.Live({
            theta: 0,
            position: [1, 1]
          })
        ),
        IO.provideSomeLayer(TurtleSurface),
        IO.runPromise
      ))

    describe('draw forward', () => {
      it('length 0', () =>
        pipe(
          IO.serviceWithEffect(T.Tag, (turtle) =>
            pipe(
              turtle.drawForward(0),
              IO.map((state) => assert.deepStrictEqual(state, { theta: 0, position: [0, 0] }))
            )
          ),
          IO.provideSomeLayer(T.fromOrigin),
          IO.provideSomeLayer(TurtleSurface),
          C.renderTo(CANVAS_ID),
          IO.runPromise
        ))
      it('draws by length provided', () =>
        pipe(
          IO.serviceWithEffect(T.Tag, (turtle) =>
            pipe(
              turtle.drawForward(10),
              IO.map((state) => assert.deepStrictEqual(state.position, [10, 0]))
            )
          ),
          IO.provideLayer(T.fromOrigin),
          IO.provideSomeLayer(TurtleSurface),
          IO.runPromise
        ))
      describe('length 1', () => {
        it('length 1', () =>
          pipe(
            IO.serviceWithEffect(T.Tag, (turtle) =>
              pipe(
                turtle.drawForward(1),
                IO.map((state) => assert.deepStrictEqual(state.position, [1, 0]))
              )
            ),
            IO.provideLayer(T.fromOrigin),
            IO.provideSomeLayer(TurtleSurface),
            IO.runPromise
          ))
      })
      it('writes to the canvas', () => {
        return pipe(
          IO.serviceWithEffect(T.Tag, (turtle) => turtle.drawForward(1)),
          IO.zipRight(
            IO.serviceWith(C.Tag, (ctx) => {
              expect(ctx.lineTo).toHaveBeenCalled()
              expect(ctx.moveTo).toHaveBeenCalled()
            })
          ),
          IO.provideSomeLayer(T.fromOrigin),
          IO.provideSomeLayer(TurtleSurface),
          IO.runPromise
        )
      })
    })
  })
})
