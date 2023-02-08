import * as Effect from '@effect/io/Effect'
import * as Context from '@fp-ts/data/Context'

export interface Drawable<A> {
  draw: (a: A) => Effect.Effect<CanvasRenderingContext2D, never, void>
}
export const Tag = <A, K extends string = string>(key: K) =>
  Context.Tag<Drawable<A>>(`~/services/Drawable<${key}>`)

