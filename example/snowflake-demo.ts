import { Effect as IO } from 'effect'

import { renderTo } from '../src/Canvas'
import { snowFlakes } from './snowflake'
import { clippingDemo } from './clipping-demo'

import { toggleButton, RestartButton, liveRestartButton } from './utils'
const CANVAS_ONE_ID = 'canvas1'
const CANVAS_TWO_ID = 'canvas2'

// const _eff = renderTo(CANVAS_TWO_ID)(clippingDemo)
// const _eff2 = renderTo(CANVAS_ONE_ID)(snowFlakes(3))
// The `clippingDemo` in parallel with our `snowflake` animation Effect
const canvasDemo =
  // some button management
  RestartButton.pipe(_ =>
    IO.flatMap(_, toggleButton(main)),
    IO.zipRight(
      // `raceAll` will run these effects in parallel
      // our clipping demo runs forever, but `raceAll`
      // will interrupt when the first effect finishes
      IO.raceAll([
        // Since we want these to render to separate canvases
        // we provide them individually
        renderTo(CANVAS_TWO_ID)(clippingDemo),
        renderTo(CANVAS_ONE_ID)(snowFlakes(6)),
      ])
    ),
    IO.zipRight(RestartButton.pipe(IO.flatMap(toggleButton(main)))),
    IO.provide(liveRestartButton)
  )

export function main() {
  IO.runPromise(canvasDemo)
}
