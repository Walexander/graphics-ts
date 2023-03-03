import { liftPredicate } from '@effect/data/Option'
import * as IO from '@effect/io/Effect'
import * as Context from '@effect/data/Context'
import { pipe } from '@effect/data/Function'

export const RestartButton = Context.Tag<HTMLButtonElement>()
export const isButton = liftPredicate(
  (el: unknown): el is HTMLButtonElement => el instanceof HTMLButtonElement
)
export const liveRestartButton = pipe(
  IO.fromOption<HTMLButtonElement>(isButton(document.getElementById('restart'))),
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
