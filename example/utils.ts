import { liftPredicate } from '@fp-ts/core/Option'
import * as IO from '@effect/io/Effect'
import * as Context from '@effect/data/Context'
import { pipe } from '@fp-ts/core/Function'

export const RestartButton = Context.Tag<HTMLButtonElement>()
export const isButton = liftPredicate(
  (el: unknown): el is HTMLButtonElement => el instanceof HTMLButtonElement
)
export const liveRestartButton = pipe(
  IO.sync(() => isButton(document.getElementById('restart'))),
  IO.flatMap(IO.fromOption),
  IO.orDie,
  IO.toLayer(RestartButton)
)

export const toggleButton = (handler: () => void) => (button: HTMLButtonElement) =>
  IO.sync(() => {
    button.disabled ?
      button.addEventListener('click', handler)
      : button.removeEventListener('click', handler)
    button.disabled = !button.disabled
  })

export function loopCircle<R, E, A>(f: (z: number) => IO.Effect<R, E, A>) {
  return IO.loopDiscard(
    0,
    _ => _ <= 360,
    z => z + 5,
    z => f((-z * Math.PI) / 180)
  )
}
