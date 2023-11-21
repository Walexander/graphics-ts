import { pipe } from 'effect/Function'
import { Layer, Effect as IO } from 'effect'
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
      const eff = T.Tag.pipe(
        IO.map((turtle) => {
          assert.equal(typeof turtle, 'object')
        }),
        IO.provide(T.fromOrigin),
        IO.provide(TurtleSurface)
      )
      return IO.runPromise(eff)
    })
    it('accepts the initial state', () =>
      T.Tag.pipe(
        IO.flatMap(turtle => turtle.drawForward(1)),
        IO.map((state) => assert.deepStrictEqual(state, { theta: 0, position: [2, 1] })),
        IO.provide(
          T.Live({
            position: [1, 1],
            theta: 0
          })
        ),
        IO.provide(TurtleSurface),
        IO.runPromise
      ))
    describe('draw forward', () => {
      it('length 0', () =>
        T.Tag.pipe(
          IO.flatMap(turtle =>
            pipe(
              turtle.drawForward(0),
              IO.map(state => assert.deepStrictEqual(state, { theta: 0, position: [0, 0] }))
            )
          ),
          IO.provide(T.fromOrigin),
          IO.provide(TurtleSurface),
          C.renderTo(CANVAS_ID),
          IO.runPromise
        ))
      it('draws by length provided', () => T.Tag.pipe(
          IO.flatMap((turtle) =>
            pipe(
              turtle.drawForward(10),
              IO.map((state) => assert.deepStrictEqual(state.position, [10, 0]))
            )
          ),
          IO.provide(T.fromOrigin),
          IO.provide(TurtleSurface),
          IO.runPromise
        ))
      describe('length 1', () => {
        it('length 1', () =>
          T.Tag.pipe(
            IO.flatMap(turtle => turtle.drawForward(1)),
            IO.map(state => assert.deepStrictEqual(state.position, [1, 0])),
            IO.provide(T.fromOrigin),
            IO.provide(TurtleSurface),
            IO.runPromise
          ))
      })
      it('writes to the canvas', () => {
        return T.Tag.pipe(
          IO.flatMap((turtle) => turtle.drawForward(1)),
          IO.zipRight(C.Tag.pipe(IO.map(
            (context) => {
              expect(context.lineTo).toHaveBeenCalled()
              expect(context.moveTo).toHaveBeenCalled()
            }
          ))),
          IO.provide(T.fromOrigin),
          IO.provide(TurtleSurface),
          IO.runPromise
        )
      })
    })
  })
})
