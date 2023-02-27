import * as IO from '@effect/io/Effect'
import { pipe } from '@fp-ts/core/Function'

import { renderTo } from '../src/Canvas'
import { snowFlakes } from './snowflake'
import { clippingDemo } from './clipping-demo'

import { toggleButton, RestartButton, liveRestartButton } from './utils'
const CANVAS_ONE_ID = 'canvas1'
const CANVAS_TWO_ID = 'canvas2'

// The `clippingDemo` in parallel with our `snowflake` animation Effect
const canvasDemo = pipe(
  // some button management
  IO.serviceWithEffect(RestartButton, toggleButton(main)),
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
  IO.zipLeft(IO.serviceWithEffect(RestartButton, toggleButton(main))),
  IO.provideSomeLayer(liveRestartButton)
)

export function main() { IO.runPromise(canvasDemo) }
