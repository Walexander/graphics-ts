import * as IO from '@effect/io/Effect'
import { pipe } from '@fp-ts/core/Function'
import { it as vit, assert } from 'vitest'
import * as DS from '../src/Drawable/Shape'
import * as DD from '../src/Drawable/Drawing'
import * as C from '../src/Canvas'
import type {Mock} from 'vitest'
import {Drawable} from 'src/Drawable'
import {Shape} from 'src/Shape'
import {Drawing} from 'src/Drawing'

/**
 * Asserts that the specified `fn` was called with the parameters specified in `params`.
 */
export const assertCalledWith = (fn: Mock, ...params: ReadonlyArray<any>): void => {
  const { calls } = fn.mock

  assert.deepStrictEqual(calls.length, 1)

  calls[0].forEach((p: any, i: any) => {
    assert.deepStrictEqual(p, params[i])
  })
}
export type Dependencies = Drawable<Shape> | Drawable<Drawing> | CanvasRenderingContext2D
export const testM = (
  label: string,
  test: () => IO.Effect<Dependencies, never, unknown>
) =>
  vit(label, () =>
    pipe(
      test(),
      IO.provideSomeLayer(DD.Live),
      IO.provideSomeLayer(DS.Live),
      C.renderTo('canvas'),
      IO.runPromise
    )
  )

export const testDrawing = (
  eff: IO.Effect<Drawable<Shape>|Drawable<Drawing>|CanvasRenderingContext2D, never, CanvasRenderingContext2D>,
  actual: IO.Effect<never, never, any>
) =>
  pipe(
    eff,
    IO.map((ctx) => (ctx as any).__getEvents()),
    IO.zip(pipe(
      actual,
      IO.map(ctx => '__getEvents' in ctx ? ctx.__getEvents() : ctx)
    )),
    IO.map(([a, b]) => assert.deepStrictEqual(a, b)),
  )

export const testCanvas = (
  eff: IO.Effect<CanvasRenderingContext2D, never, CanvasRenderingContext2D>,
  actual: IO.Effect<never, never, any>
) =>
  pipe(
    eff,
    IO.map((ctx) => (ctx as any).__getEvents()),
    IO.zip(pipe(
      actual,
      IO.map(ctx => '__getEvents' in ctx ? ctx.__getEvents() : ctx)
    )),
    IO.map(([a, b]) => assert.deepStrictEqual(a, b))
  )

