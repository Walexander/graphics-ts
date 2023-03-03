import * as Stream from '@effect/stream/Stream'
import * as C from '@effect/data/Chunk'
import * as IO from '@effect/io/Effect'
import * as O from '@effect/data/Option'
import { pipe } from '@effect/data/Function'
import * as Debug from '@effect/io/Debug'
console.dir(Debug.runtimeDebug)


pipe(
  // C.unfold(1, s => s > 10_000 ? O.none() : O.some([true, s + 1])),
  // (c) => console.log(c.toReadonlyArray())
  // Stream.range(2, Number.MAX_SAFE_INTEGER),
  Stream.repeatForever(1),
  Stream.tap(_ => (_ % 100 == 0 ? IO.log(`counted ${_}`) : IO.unit())),
  Stream.tap(IO.unit),
  Stream.tap(IO.unit),
  Stream.take(2_500),
  Stream.runDrain,
  IO.zipRight(IO.log(`FINISHED!`)),
  IO.runSync
)
