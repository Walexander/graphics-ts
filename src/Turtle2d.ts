/**
 * @since 2.0.0
 */
import * as IO from '@effect/io/Effect'
import * as Ref from '@effect/io/Ref'
import * as Context from '@effect/data/Context'
import { Drawable } from './Drawable/definition'
import { Tag as DrawsTurtlesTag } from './Drawable/Turtle2d'
import { pipe } from '@fp-ts/core/Function'

/**
* The classic 2D Turtle graphics api.  You can
* 1. Turn
* 2. DrawForward
 *
* @category model
 * @since 2.0.0
 */
export interface Turtle2d {
  drawForward: (length: number) => IO.Effect<never, never, TurtleState>
  turn: (angle: number) => IO.Effect<never, never, TurtleState>
}
/**
* The turtle's state
*
 * @category model
 * @since 2.0.0
 */
export interface TurtleState {
  theta: number
  position: readonly [x: number, y: number]
}
/**
* Summon a `Turtle2d` service
*
* @category tag
* @since 2.0.0
*
**/
export const Tag = Context.Tag<Turtle2d>()

/**
* Construct a live `Turtle2d` service with the provided `TurtleState`
* Requires a `Drawable<TurtleMove>` instance
*
*
* @category instance
* @since 2.0.0
*
**/
export function Live(state: TurtleState) {
  return IO.toLayer(
    IO.gen(function* ($) {
      const ref = yield* $(Ref.make(state))
      const draw = yield* $(IO.service(DrawsTurtlesTag))
      return new Turtle2dImpl(ref, draw)
    }),
    Tag
  )
}
/**
* Construct a turtle starting at the origin.
*
* @category instance
* @since 2.0.0
*/
export const fromOrigin = Live({ theta: 0, position: [0, 0] })

/**
* @category model
* @since 2.0.0
* Movement [from, to] a TurtleState['position'] type
*/
export type TurtleMove = [TurtleState['position'], TurtleState['position']]

class Turtle2dImpl implements Turtle2d {
  constructor(readonly state: Ref.Ref<TurtleState>, readonly draw: Drawable<TurtleMove>) {}
  drawForward(length: number): IO.Effect<never, never, TurtleState> {
    return pipe(
      Ref.get(this.state),
      IO.map(
        state0 =>
          [
            state0,
            <TurtleState>{
              theta: state0.theta,
              position: [
                state0.position[0] + length * Math.cos(state0.theta),
                state0.position[1] + length * Math.sin(state0.theta)
              ]
            }
          ] as const
      ),
      IO.tap(([s1, s2]) => this.draw(<TurtleMove>[s1.position, s2.position])),
      IO.flatMap(([, state1]) => IO.as(Ref.set(this.state, state1), state1))
    )
  }
  turn(angle: number): IO.Effect<never, never, TurtleState> {
    return Ref.updateAndGet(this.state, ({ theta, position }) => ({
      theta: theta + angle,
      position
    }))
  }
}
