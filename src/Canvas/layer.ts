/**
 * @since 2.0.0
 */
import { Effect as IO, Context, Layer, Option, Either } from 'effect'
import { CanvasError, Tag } from './definition'

/**
 * Provide a CanvasRendering layer to
 * a `Render` effect.
 * Argument is either an `id`, `HTMLCanvasElement`
 * or a raw `CanvasRenderingContext2D`.
 *
 * Can fail with `CanvasError` when 
 * 1 the element does not exist
 * 2 the element is *not* an HTMLCanvasElement 
 * 3 failure to obtain the context
 *
 * @since 1.0.0
 * @category layer
 */

export const CanvasRenderingContext2DSettings = Context.Tag<CanvasRenderingContext2DSettings>()
export function renderTo(canvas: string | HTMLElement | CanvasRenderingContext2D) {
  const layer =
    typeof canvas == 'string'
      ? fromId(canvas)
      : canvas instanceof HTMLElement
      ? fromElement(canvas)
      : fromCanvas(canvas)
  return IO.provide(layer.pipe(Layer.tapError(() => IO.log(`i got an error for ${canvas}`))))
}

/**
* @category layer
* @since 2.0.0
*/
export function fromId(id: string): Layer.Layer<never, CanvasError, CanvasRenderingContext2D> {
  return Layer.effect(Tag, getContextById(id))
}
/**
* @category layer
* @since 2.0.0
*/
export function fromCanvas(
  context2d: CanvasRenderingContext2D
): Layer.Layer<never, CanvasError, CanvasRenderingContext2D> {
  return Layer.succeed(Tag, context2d)
}
/**
* @category layer
* @since 2.0.0
*/
export function fromElement(
  element: HTMLElement
): Layer.Layer<never, CanvasError, CanvasRenderingContext2D> {
  
  return Layer.effect(Tag, IO.flatMap(isCanvas(element), getContext))
}
function getContextById(id: string): IO.Effect<never, CanvasError, CanvasRenderingContext2D> {
  return IO.flatMap(elementById(id), getContext)
}
/**
* @category layer
* @since 2.0.0
*/
export function elementById(id: string): IO.Effect<never, CanvasError, HTMLCanvasElement> {
  return IO.sync(() => document.getElementById(id)).pipe(
    IO.flatMap(Option.fromNullable),
    IO.mapError(() => new CanvasError(`No such element with id ${id} exists`)),
    IO.flatMap(isCanvas)
  )
}
function getContext(element: HTMLCanvasElement) {
  return IO.serviceOption(CanvasRenderingContext2DSettings).pipe(
    IO.flatMap(
      Option.match({
        onNone: () => IO.sync(() => element.getContext('2d')),
        onSome: settings => IO.sync(() => element.getContext('2d', settings))
      })
    ),
    IO.flatMap(IO.fromNullable),
    IO.mapError(_ => new CanvasError(`Cannot get 2d rendering context from "${element.id}"`))
  )
}

/**
 * Executes a `Render` effect for the given canvas
 *
 * @since 1.0.0
 */
export const renderToCanvas =
  (canvas: CanvasRenderingContext2D) => renderTo(canvas)
const isCanvas = (canvas: unknown): Either.Either<CanvasError, HTMLCanvasElement> =>  
  canvas instanceof HTMLCanvasElement ? Either.right(canvas) : Either.left(
    new CanvasError(`element is not an instance of HTMLCanvasElement`)
  )
