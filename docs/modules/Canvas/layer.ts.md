---
title: Canvas/layer.ts
nav_order: 3
parent: Modules
---

## layer overview

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [layer](#layer)
  - [elementById](#elementbyid)
  - [fromCanvas](#fromcanvas)
  - [fromElement](#fromelement)
  - [fromId](#fromid)
  - [renderTo](#renderto)
- [utils](#utils)
  - [renderToCanvas](#rendertocanvas)

---

# layer

## elementById

**Signature**

```ts
export declare function elementById(id: string): IO.Effect<never, CanvasError, HTMLCanvasElement>
```

Added in v2.0.0

## fromCanvas

**Signature**

```ts
export declare function fromCanvas(
  context2d: CanvasRenderingContext2D
): Layer.Layer<never, CanvasError, CanvasRenderingContext2D>
```

Added in v2.0.0

## fromElement

**Signature**

```ts
export declare function fromElement(element: HTMLElement): Layer.Layer<never, CanvasError, CanvasRenderingContext2D>
```

Added in v2.0.0

## fromId

**Signature**

```ts
export declare function fromId(id: string): Layer.Layer<never, CanvasError, CanvasRenderingContext2D>
```

Added in v2.0.0

## renderTo

Provide a CanvasRendering layer to
a `Render` effect.
Argument is either an `id`, `HTMLCanvasElement`
or a raw `CanvasRenderingContext2D`.

Can fail with `CanvasError` when
1 the element does not exist
2 the element is _not_ an HTMLCanvasElement
3 failure to obtain the context

**Signature**

```ts
export declare function renderTo(canvas: string | HTMLElement | CanvasRenderingContext2D)
```

Added in v1.0.0

# utils

## renderToCanvas

Executes a `Render` effect for the given canvas

**Signature**

```ts
export declare const renderToCanvas: (
  canvas: CanvasRenderingContext2D
) => <R, E, A>(self: IO.Effect<R, E, A>) => IO.Effect<Exclude<R, CanvasRenderingContext2D>, CanvasError | E, A>
```

Added in v1.0.0
