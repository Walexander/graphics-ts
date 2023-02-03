import * as IO from '@effect/io/Effect'
import { pipe } from '@fp-ts/core/Function'
import * as assert from 'assert'
import { it as vit } from 'vitest'
import * as C from '../src/Canvas'
import type {Mock} from 'vitest'

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
export const testM = (label: string, test: () => IO.Effect<CanvasRenderingContext2D, never, unknown>) =>
  vit(label, () => pipe(test(), C.renderTo('canvas'), IO.runPromise))

export const testCanvas = (
  eff: IO.Effect<CanvasRenderingContext2D, never, CanvasRenderingContext2D>,
  actual: IO.Effect<never, never, any>
) =>
  pipe(
    eff,
    IO.map((ctx) => (ctx as any).__getEvents()),
    IO.zip(actual),
    IO.map(([a, b]) => assert.deepStrictEqual(a, b))
  )

