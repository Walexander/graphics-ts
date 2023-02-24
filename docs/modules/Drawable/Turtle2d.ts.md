---
title: Drawable/Turtle2d.ts
nav_order: 10
parent: Modules
---

## Turtle2d overview

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [instances](#instances)
  - [Live](#live)
  - [TurtleSurfaceCanvas](#turtlesurfacecanvas)
- [model](#model)
  - [TurtleSurface (interface)](#turtlesurface-interface)
  - [TurtleSurfaceTag](#turtlesurfacetag)
- [tag](#tag)
  - [Tag](#tag)

---

# instances

## Live

A live instance of the `Drawable<Turtle2d>`. Delegates
drawing to a `TurtleSurface`

**Signature**

```ts
export declare const Live: Layer.Layer<CanvasRenderingContext2D, never, Drawable.Drawable<TurtleMove>>
```

Added in v2.0.0

## TurtleSurfaceCanvas

A `TurtleSurface` that provides a real canvas

**Signature**

```ts
export declare const TurtleSurfaceCanvas: Layer.Layer<CanvasRenderingContext2D, never, Drawable.turtle2d.TurtleSurface>
```

Added in v2.0.0

# model

## TurtleSurface (interface)

Drawing operations required by our Turtle

**Signature**

```ts
export interface TurtleSurface extends Pick<Canvas2d, 'moveTo' | 'lineTo' | 'beginPath' | 'stroke'> {}
```

Added in v2.0.0

## TurtleSurfaceTag

Tagged `TurtleSurface` service

**Signature**

```ts
export declare const TurtleSurfaceTag: Context.Tag<Drawable.turtle2d.TurtleSurface>
```

Added in v2.0.0

# tag

## Tag

Summon a `Drawable<Turtle2d>` instance

**Signature**

```ts
export declare const Tag: Context.Tag<Drawable.Drawable<TurtleMove>>
```

Added in v2.0.0
