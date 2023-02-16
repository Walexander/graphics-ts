---
title: Drawable/Turtle2d.ts
nav_order: 10
parent: Modules
---

## Turtle2d overview

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [tag](#tag)
  - [Live](#live)
  - [Tag](#tag)

---

# tag

## Live

A live instance of the `Turtle2d` service that draws to a
canvas.

**Signature**

```ts
export declare const Live: Layer.Layer<CanvasRenderingContext2D, never, Drawable.Drawable<TurtleMove>>
```

Added in v2.0.0

## Tag

Summon a Drawable<Turtle2d> instance

**Signature**

```ts
export declare const Tag: Context.Tag<Drawable.Drawable<TurtleMove>>
```

Added in v2.0.0
