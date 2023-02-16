---
title: Drawable/definition.ts
nav_order: 7
parent: Modules
---

## definition overview

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [model](#model)
  - [Drawable (interface)](#drawable-interface)
- [tag](#tag)
  - [Tag](#tag)

---

# model

## Drawable (interface)

Represents the ability to `draw` a value of type `A`
This could represent the ability to render to
a `CanvasRenderingContext2D`, console, etc

**Signature**

```ts
export interface Drawable<A> {
  (a: A): Effect.Effect<never, never, void>
}
```

Added in v2.0.0

# tag

## Tag

The service tag constructor.

**Signature**

```ts
export declare const Tag: <A, K extends string = string>(key: K) => Context.Tag<Drawable<A>>
```

Added in v2.0.0
