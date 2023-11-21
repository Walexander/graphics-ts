/** @since 2.0.0 */
import { Effect, Context } from 'effect'

/**
 * Represents the ability to `draw` a value of type `A`
 * This could represent the ability to render to
 * a `CanvasRenderingContext2D`, console, etc
 *
 * @category model
 * @since 2.0.0
 */
export interface Drawable<A> {
  (a: A): Effect.Effect<never, never, void>
}
/**
 * The service tag constructor.
 *
 * @category tag
 * @since 2.0.0
 */
export const Tag = <A, K extends string = string>(key: K) =>
  Context.Tag<Drawable<A>>(`~/services/Drawable<${key}>`)
