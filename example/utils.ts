import { Effect as IO, Option, Layer, Context } from 'effect'

export const RestartButton = Context.Tag<HTMLButtonElement>()
export const isButton = (el: unknown): Option.Option<HTMLButtonElement> =>
  el instanceof HTMLButtonElement ? Option.some(el as HTMLButtonElement) : Option.none()

export const liveRestartButton = Layer.effect(RestartButton,
  IO.sync(() => document.getElementById('restart')).pipe(
    IO.flatMap(Option.fromNullable),
    IO.orDie,
    IO.flatMap(isButton)
  ))

export const toggleButton = (handler: () => void) => (button: HTMLButtonElement) =>
  IO.sync(() => {
    button.disabled
      ? button.addEventListener('click', handler)
      : button.removeEventListener('click', handler)
    button.disabled = !button.disabled
  })

export function loopCircle<R, E, A>(f: (z: number) => IO.Effect<R, E, A>) {
  return IO.loop(0, {
    while: _ => _ <= 360,
    step: z => z + 5,
    body: z => f((-z * Math.PI) / 180)
  })
}
