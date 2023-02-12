import * as IO from '@effect/io/Effect'
import * as Ref from '@effect/io/Ref'
import * as Context from '@fp-ts/data/Context'
import { Canvas } from './Canvas/definition'
import { Drawable } from './Drawable/definition'
import { Tag as DrawsTurtlesTag } from './Drawable/Turtle2d'
import { flow, pipe } from '@fp-ts/core/Function'

import * as C from './Canvas'
export interface TurtleState {
  theta: number
  position: readonly [x: number, y: number]
}
export interface Turtle2d {
  drawForward: (length: number) => IO.Effect<never, never, TurtleState>
  turn: (angle: number) => IO.Effect<never, never, TurtleState>
}

export const Tag = Context.Tag<Turtle2d>()
export function Live(state: TurtleState) {
  return IO.toLayer(
    IO.gen(function* ($) {
      const ref = yield* $(Ref.make(state))
      const draw = yield *$(IO.service(DrawsTurtlesTag))
      return new Turtle2dImpl(ref, draw)
    }),
    Tag
  )
}

export type TurtleMove = [TurtleState['position'], TurtleState['position']]
export const fromOrigin = Live({theta: 0, position: [0, 0]})

export class Turtle2dImpl implements Turtle2d {
  constructor(readonly state: Ref.Ref<TurtleState>,
    readonly draw: Drawable<TurtleMove>
  ) {}
  drawForward(length: number): IO.Effect<never, never, TurtleState> {
    return pipe(
      Ref.get(this.state),
      IO.map((state0) => [state0, <TurtleState>{
        theta: state0.theta,
        position: [
          state0.position[0] + length * Math.cos(state0.theta),
          state0.position[1] + length * Math.sin(state0.theta)
        ]
      }] as const),
      IO.tap(([s1, s2]) => this.draw(<TurtleMove>[s1.position, s2.position])),
      IO.flatMap(([, state1]) => IO.as(Ref.set(this.state, state1), state1)),
    )
  }
  turn(angle: number): IO.Effect<never, never, TurtleState> {
    return Ref.updateAndGet(this.state, ({ theta, position }) => ({
      theta: theta + angle,
      position
    }))
  }
}

export interface TurtleSurface extends Pick<Canvas, 'moveTo' | 'lineTo' | 'beginPath' | 'stroke'> {}
export const TurtleSurfaceTag = Context.Tag<TurtleSurface>()
export const TurtleSurfaceCanvas = IO.toLayer(
  IO.serviceWith(C.Tag, canvas => TurtleServiceLiveImpl(canvas)),
  TurtleSurfaceTag
)

function TurtleServiceLiveImpl(canvas: CanvasRenderingContext2D) {
  const provide = IO.provideService(C.Tag, canvas)
  return <TurtleSurface>{
    moveTo: flow(C.moveTo, provide),
    lineTo: flow(C.lineTo, provide),
    beginPath: provide(IO.as(C.beginPath, void null)),
    stroke: provide(IO.as(C.stroke(), void null))
  }
}
