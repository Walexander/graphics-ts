---
title: Turtle2d.ts
nav_order: 15
parent: Modules
---

## Turtle2d overview

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [instance](#instance)
  - [Live](#live)
  - [centeredLive](#centeredlive)
  - [fromOrigin](#fromorigin)
- [model](#model)
  - [Turtle2d (interface)](#turtle2d-interface)
  - [TurtleMove (type alias)](#turtlemove-type-alias)
  - [TurtleState (interface)](#turtlestate-interface)
- [tag](#tag)
  - [Tag](#tag)

---

# instance

## Live

Construct a live `Turtle2d` service with the provided `TurtleState`
Requires a `Drawable<TurtleMove>` instance

**Signature**

```ts
export declare function Live(state: TurtleState): Layer.Layer<Drawable<TurtleMove>, never, Turtle2d>
```

Added in v2.0.0

-

## centeredLive

Construct a turtle starting at the center of a canvas.

**Signature**

```ts
export declare function centeredLive(
  theta = 0
): Layer.Layer<Drawable<TurtleMove> | CanvasRenderingContext2D, never, Turtle2d>
```

Added in v2.0.0

## fromOrigin

Construct a turtle starting at the origin.

**Signature**

```ts
export declare const fromOrigin: Layer.Layer<Drawable<TurtleMove>, never, Turtle2d>
```

Added in v2.0.0

# model

## Turtle2d (interface)

The classic 2D Turtle graphics api. You can

1. Turn
2. DrawForward

**Signature**

```ts
export interface Turtle2d {
  drawForward: (length: number) => Effect.Effect<never, never, TurtleState>
  turn: (angle: number) => Effect.Effect<never, never, TurtleState>
}
```

Added in v2.0.0

## TurtleMove (type alias)

**Signature**

```ts
export type TurtleMove = [TurtleState['position'], TurtleState['position']]
```

Added in v2.0.0
Movement [from, to] a TurtleState['position'] type

## TurtleState (interface)

The turtle's state

**Signature**

```ts
export interface TurtleState {
  theta: number
  position: readonly [x: number, y: number]
}
```

Added in v2.0.0

# tag

## Tag

Summon a `Turtle2d` service

**Signature**

```ts
export declare const Tag: Context.Tag<Turtle2d, Turtle2d>
```

Added in v2.0.0

-
