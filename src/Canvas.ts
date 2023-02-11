/**
 * The `Canvas` module contains all the functions necessary to interact with the HTML
 * Canvas API. `graphics-ts` wraps all canvas operations in an `IO<A>` to allow for
 * chaining multiple effectful calls to the HTML Canvas API.
 *
 * For example, taking the example of [drawing a triangle](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes) from the MDN Web Docs, the code
 * without `graphics-ts` looks like this.
 *
 * ```ts
 * const draw = () => {
 *   var canvas = document.getElementById('canvas')
 *
 *   if (canvas.getContext) {
 *     var ctx = canvas.getContext('2d')
 *
 *     ctx.beginPath();
 *     ctx.fillStyle = 'black'
 *     ctx.moveTo(75, 50)
 *     ctx.lineTo(100, 75)
 *     ctx.lineTo(100, 25)
 *     ctx.fill()
 *   }
 * }
 * ```
 *
 * With `graphics-ts`, we can put the individual commands into an array
 * and call IO.collectAllDiscard to generate the effect.  Then we `renderTo(#id)`
 * to provide it with the canvas and, finally, run the effect to a Promise
 *
 * ```ts
 * import { pipe } from '@fp-ts/core/Function'
 * import * as E from '@effect/io/Effect'
 * import * as C from 'graphics-ts/Canvas'
 *
 * const triangle = IO.collectAllDiscard([
 *   C.beginPath,
 *   C.moveTo(75, 50),
 *   C.lineTo(100, 75),
 *   C.lineTo(100, 25),
 *   C.setFillStyle('black'),
 *   C.fill(),
 * ])
 *
 * IO.runPromise(pipe(
 *  triangle,
 *  C.renderTo('canvas'),
 *  IO.catchAll(error => Effect.logError(`Error rendering to #canvas: ${error.message}`))
 * ))
 *
 * ```
 *
 * While this may seem somewhat verbose compared to its non-functional counterpart above,
 * the real power of the `Canvas` module is apparent when it is abstracted away by the
 * `Drawing` module.
 *
 * Adapted from https://github.com/purescript-contrib/purescript-canvas.
 *
 * @since 1.0.0
 */
export * from './Canvas/definition'
export * from './Canvas/operations'
export * from './Canvas/layer'
