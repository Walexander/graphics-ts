---
title: Home
nav_order: 1
---

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
  canvas.fillStyle = 'magenta'
  canvas.translate(50, 50)
  canvas.fillRect(-20, -20, 40, 40)
})
void IO.runPromise(C.renderTo('canvasId')(rectangle))
```

## Using

There are a few ways you can use this library, each building on top of the previous.
  1. Thread a canvas rendering context to your existing functions.
  2. Using the `Canvas` methods directly.
  3. Use `Drawing` / `Shape` modules


View these [simple examples](examples/).

### Level 1: `Canvas.use`
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

You can pass these to `C.use`
```ts
void IO.runPromise(pipe(
  C.use(drawRect),
  C.renderTo('canvas')
))
```
and you can use `Effect` functions to combine them

```ts
const demoUse = IO.collectAllDiscard([C.use(drawCircle), C.use(drawRect)])
IO.runPromise(C.renderTo('canvas')(demoUse))
```

### Level 2: `Canvas` methods
Instead of operating directly on a canvas with `C.use()`, you can
use the methods from the `Canvas` to compose these operations.

```ts
const drawNestedRect = IO.collectAll([
  C.setFillStyle('magenta'),
  C.fillRect(-20, -20, 40, 40),
  C.setFillStyle(Color.toCss(Color.hsla(180, 0.5, 0.5, 0.5))),
  C.fillPath(C.rect(-5, -5, 10, 10)),
])
```

With this drawing function, we can use `IO.loopDiscard` to rotate the canvas 360 degrees.
By delaying each call by 16 ms, we can animate this rotation

```ts
function rotatesAndDrawsRect(rads: number) {
  return C.withContext(
    IO.collectAllDiscard([C.clearRect(-50, -50, 100, 100), C.rotate(rads), drawNestedRect])
  )
}
const drawDirect = C.withContext(
  IO.collectAll([
    C.translate(50, 50),
    loopCircle(z => IO.delay(rotatesAndDrawsRect(z), Duration.millis(16)))
  ])
)
```

### Level 3: `Drawing` and `Shape`
The above code works, but it's difficult to reason about a bunch of strokes on a canvas.  Instead, the high-level API provided by the `Drawing` and `Shape` modules make it easy to construct pure data structures which can later be rendered to the canvas.

These pure structures are easier to reason about, test, duplicate and transform than chicken scratch on a canvas.

Here we use a static `nestedRectangleDrawing` and `rotateRectDrawing(angle)`  to create the `Drawing`.  Calling `D.render` will actually render the drawing to the canvas.

```ts
const nestedRectDrawing = D.combineAll([
  D.fill(
    S.rect(-50, -50, 100, 100),
    D.fillStyle(Color.white),
  ),
  D.fill(
    S.rect(-20, -20, 40, 40),
    D.fillStyle(Color.hsla(-180, 0.5, 0.5, 1))
  ),
  D.outline(
    S.rect(-5, -5, 10, 10),
    D.outlineColor(Color.hsla(-180, 0.5, 0.25, 1))
  ),
])

const rotateRectDrawing = (z: number) => pipe(
  nestedRectDrawing,
  D.rotate(z),
  D.translate(50, 50)
)
const withDrawing = C.withContext(
  loopCircle(z => IO.delay(
    D.render(rotateRectDrawing(z)),
    Duration.millis(16)
  ))
)
void IO.runPromise(C.renderTo('canvas3')(withDrawing))
```

## Example

To run the examples, clone the repository and run the following.

```
pnpm install
pnpm start
open http://localhost:5173/
```
* [Example source](example/)
* [Running](https://walexander.github.io/graphics-ts/example/)

### Snowflakes
<img alt="snowflake" src="./snowflake.png" style="display: block; width: 100%; max-width: 800px; margin-bottom: 1em;">

### Prime Spiral
<img alt="prime spiral" src="./spiral.png" style="display: block; width: 100%; max-width: 800px; margin-bottom: 1em;">

