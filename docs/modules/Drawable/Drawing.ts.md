---
title: Drawable/Drawing.ts
nav_order: 8
parent: Modules
---

## Drawing overview

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [instances](#instances)
  - [Live](#live)
  - [Tag](#tag)
- [operators](#operators)
  - [drawsDrawing](#drawsdrawing)
  - [renderDrawing](#renderdrawing)

---

# instances

## Live

A Live `Drawable` layer that renders to a `CanvasRenderingContext2D`

**Signature**

```ts
export declare const Live: Layer<Drawable<Shape> | CanvasRenderingContext2D, never, Drawable<Drawing>>
```

Added in v2.0.0

## Tag

The `Drawable` instance for a `Drawing` type

**Signature**

```ts
export declare const Tag: Context.Tag<Drawable<Drawing>>
```

Added in v2.0.0

# operators

## drawsDrawing

Draws a `Drawing` using a `Drawable<Drawing>`
from the context

**Signature**

```ts
export declare function drawsDrawing(drawing: Drawing): IO.Effect<Drawable<Drawing>, never, void>
```

Added in v2.0.0

## renderDrawing

Render a `Drawing` providing the Live `Drawable`
instances for both `Drawing` and `Shape`

**Signature**

```ts
export declare function renderDrawing(drawing: Drawing): IO.Effect<CanvasRenderingContext2D, never, void>
```

Added in v1.0.0
