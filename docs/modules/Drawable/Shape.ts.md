---
title: Drawable/Shape.ts
nav_order: 9
parent: Modules
---

## Shape overview

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [drawShape](#drawshape)
- [instances](#instances)
  - [Live](#live)
  - [withDelay](#withdelay)
- [tag](#tag)
  - [Tag](#tag)

---

# combinators

## drawShape

Renders a `Shape` via some `Drawable<Shape>` instance

**Signature**

```ts
export declare const drawShape: (shape: Shape) => IO.Effect<Drawable.Drawable<Shape>, never, void>
```

Added in v2.0.0

# instances

## Live

A `Drawable` instance for `Shape` that renders
to a `CanvasRenderingContext2D`

**Signature**

```ts
export declare const Live: Layer.Layer<CanvasRenderingContext2D, never, Drawable.Drawable<Shape>>
```

Added in v2.0.0

## withDelay

Modifies any `Drawable<Shape>` instance to pause
for `delay` after each shape is drawn

**Signature**

```ts
export declare const withDelay: (
  delay: Duration.Duration
) => <R, E, A>(self: IO.Effect<R, E, A>) => IO.Effect<Drawable.Drawable<Shape> | R, E, A>
```

Added in v2.0.0

# tag

## Tag

Summon a `Drawable` instance for `Shape`

**Signature**

```ts
export declare const Tag: Context.Tag<Drawable.Drawable<Shape>>
```

Added in v2.0.0
