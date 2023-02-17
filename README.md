## Functional bindings for the HTML Canvas API

**Inspired by**

- [purescript-canvas](https://github.com/purescript-contrib/purescript-canvas)
- [purescript-free-canvas](https://github.com/paf31/purescript-free-canvas)
- [purescript-drawing](https://github.com/purescript-contrib/purescript-drawing)

# Installation

To install the stable version:

```
npm install graphics-ts @fp-ts/core @effect/core @effect/data
```

Note: `fp-ts` and `fp-ts-contrib` are peer dependencies for `graphics-ts`

# Documentation

- [API Reference](https://gcanti.github.io/graphics-ts/docs/modules)

## Getting started
Typically each program will
  1. Use the `C.*` methods to create an Effect for a canvas.
  2. Provide the effect a canvas via `C.renderTo(someCanvasContextElOrId)`
  3. Call `IO.run*` on the effect.

The simplest way to get started is with `Canvas.use` which runs a function inside an `Effect`.
Later, we can use `C.renderTo` to provide the real canvas. 

```ts
import * as C from 'graphics-ts/Canvas'
import * as IO from '@effect/io/Effect'
const rectangle = C.use((canvas) => {
  canvas.moveTo(50, 50)
  canvas.setFillStyle = 'magenta'
  canvas.fillRect(10, 10, 100, 100)
})
void IO.runPromise(C.renderTo('canvasId')(rectangle))
```

## Using
There are a few ways you can use this library, each building on top of the previous.
  1. Thread a canvas rendering context to your existing functions.
  2. Use ithe `Canvas` module methods directly.
  3. Use the `Drawing` and `Shape` modules.
  4. Create custom or enhance existing `Drawable` instances.

### Level 1: `Canvas.useContext`
This library (more specifically dependeny injection features of the `Effect` library)
can simplify providing a canvas to your existing code.  For example, you might have
functions such as
```ts
import * as C from 'graphics-ts/Canvas'
import * as IO from '@effect/io/Effect'
import { pipe } from '@fp-ts/core/Function'
function drawRect(canvas: CanvasRenderingContext2D) {
  canvas.fillStyle = 'magenta'
  canvas.fillRect(40, 40, 20, 20)
}
function drawCircle(canvas: CanvasRenderingContext2D) {
  canvas.fillStyle= 'purple'
  canvas.arc(50, 50, 5, 0, Math.PI * 2)
  canvas.fill()
}
```

You can pass these as functions to `C.use`, 

```ts
void IO.runPromise(pipe(
  IO.collectAllDiscard([C.use(drawCircle), C.use(drawRect)]),
  C.renderTo('canvas')
))
```
## Example

To run the example, clone the repository and run the following:

```
pnpm install
pnpm start
open http://localhost:5173/
```

<img alt="snowflake" src="./example/snowflake.png" style="display: block; width: 100%; max-width: 800px; margin-bottom: 1em;">

Adapted from https://github.com/purescript-contrib/purescript-drawing/blob/master/test/Main.purs
