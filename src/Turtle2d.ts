/**
 * @since 2.0.0
 */
import * as IO from '@effect/io/Effect'
import * as Layer from '@effect/io/Layer'
import * as Ref from '@effect/io/Ref'
import * as Context from '@effect/data/Context'
import { Drawable } from './Drawable/definition'
import { Tag as DrawsTurtlesTag } from './Drawable/Turtle2d'
import { pipe } from '@effect/data/Function'
import {dimensions} from './Canvas'

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
* @category instance
* @since 2.0.0
*
**/
export function Live(state: TurtleState): Layer.Layer<Drawable<TurtleMove>, never, Turtle2d> {
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
* Construct a turtle starting at the center of a canvas.
*
* @category instance
* @since 2.0.0
*/
export function centeredLive(theta = 0): Layer.Layer<Drawable<TurtleMove> | CanvasRenderingContext2D, never, Turtle2d> {
  return Layer.effect(Tag, IO.gen(function *($){
    const {width, height} = yield *$(dimensions)
    const position = [width / 2, height /2] as const
    const ref = yield * $(Ref.make<TurtleState>({ theta, position }))
    const draw = yield* $(IO.service(DrawsTurtlesTag))
    return new Turtle2dImpl(ref, draw)
  }))
}
/**
* Construct a turtle starting at the origin.
*
* @category instance
* @since 2.0.0
*/
export const fromOrigin: Layer.Layer<Drawable<TurtleMove>, never, Turtle2d> = Live({ theta: 0, position: [0, 0] })

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
      IO.map(state0 => [state0, move(state0, length)] as const),
      IO.tap(([s1, p2]) => this.draw(<TurtleMove>[s1.position, p2])),
      IO.map(([{theta}, position]) => ({theta, position})),
      IO.flatMap((updated) => IO.as(Ref.set(this.state, updated), updated))
    )
  }
  turn(angle: number): IO.Effect<never, never, TurtleState> {
    return Ref.updateAndGet(this.state, ({ theta, position }) => ({
      theta: theta + angle,
      position
    }))
  }
}
function move({ position: [x, y], theta }: TurtleState, length: number) {
  return <TurtleState['position']>[x + length * Math.cos(theta), y + length * Math.sin(theta)]
}
