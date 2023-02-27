/**
 * @since 2.0.0
 */
import * as IO from '@effect/io/Effect'
import * as Layer from '@effect/io/Layer'
import { fromNullable } from '@effect/data/Option'
import { liftPredicate } from '@effect/data/Either'
import { flow, pipe } from '@effect/data/Function'

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
export function renderTo(canvas: string | HTMLElement | CanvasRenderingContext2D) {
  const layer =
    typeof canvas == 'string'
      ? fromId(canvas)
      : canvas instanceof HTMLElement
      ? fromElement(canvas)
      : fromCanvas(canvas)
  return IO.provideSomeLayer(layer)
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
  return pipe(
    IO.sync(() => document.getElementById(id)),
    IO.flatMap(fromOption),
    IO.mapError(() => new CanvasError(`No such element with id ${id} exists`)),
    IO.flatMap(isCanvas)
  )
}
const fromOption = flow(fromNullable, IO.fromOption)
function getContext(element: HTMLCanvasElement) {
  return pipe(
    IO.sync(() => element.getContext('2d')),
    IO.flatMap(fromOption),
    IO.mapError((_) => new CanvasError(`${element.id} is not an instance of HTMLCanvasElement`))
  )
}

/**
 * Executes a `Render` effect for the given canvas
 *
 * @since 1.0.0
 */
export const renderToCanvas =
  (canvas: CanvasRenderingContext2D) => renderTo(canvas)

const isCanvas = flow(
  liftPredicate(
    (element): element is HTMLCanvasElement => element instanceof HTMLCanvasElement,
    () => new CanvasError(`element is not an instance of HTMLCanvasElement`)
  ),
  IO.fromEither
)

