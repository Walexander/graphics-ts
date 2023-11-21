import { Effect as IO, pipe, Chunk, Option as O, Duration, Stream } from 'effect'
import * as Num from '@effect/typeclass/data/Number'

import * as Shape from '../src/Shape'
import * as Canvas from '../src/Canvas'
import * as Color from '../src/Color'
import * as Drawing from '../src/Drawing'
import { randomAngle, nextCircle, randomDistance, collides } from './point-cloud'
export function main() {
  return void pipe(
    IO.log(`starting`),
    IO.zipRight(Canvas.dimensions),
    IO.tap(_ => IO.forEach([
      draw(0.5, 60, 40, Shape.point(-200, -200)),
      draw(0.5, 30, 20, Shape.point(200, -200)),
      draw(0.5, 20, 20, Shape.point(-200, 200)),
      draw(0.5, 10, 30, Shape.point(200, 200))
    ], fn => fn(_), { discard: true, concurrency: 'unbounded'})),
    Canvas.renderTo('canvas4'),
    IO.runPromise
  )
}
function draw(bounds: number, minDistance: number, retries = 10, offset = Shape.point(0, 0)) {
  retries = Num.MonoidMax.combine(retries, 5)

  return (dimensions: Canvas.CanvasDimensions) => {
    const left = Math.floor(dimensions.width / 2)
    const top = Math.floor(dimensions.height / 2)
    const min = Shape.point(left * -bounds, top * -bounds)
    const max = Shape.point(left * bounds, top * bounds)
    const xlate = Drawing.translate(left + offset.x, top + offset.y)
    const start = Shape.point(max.x + min.x, max.y + min.y)
    const scale = Drawing.scale(1, 1)
    const walls = xlate(
      scale(
        Drawing.outline(
          Shape.rect(min.x, min.y, max.x - min.x, max.y - min.y),
          Drawing.outlineColor(Color.black)
        )
      )
    )

    return pipe(
      Drawing.render(walls),
      IO.zipRight(
        pipe(
          pointCloudStream(min, max, start, retries, minDistance + 2, minDistance / 2),
          Stream.map(_ => xlate(scale(_))),
          Stream.grouped(16),
          Stream.map(IO.forEach(Drawing.render, { discard: true })),
          Stream.map(IO.delay(Duration.millis(100))),
          Stream.tap(_ => _),
          Stream.catchAll(_ => Stream.succeed(_)),
          Stream.runLast,
          IO.timed
        )
      ),
      IO.tap(([duration, count]) =>
        IO.log(
          `-- time taken: ${Duration.match(duration, {
            onMillis: _ => _ + 'ms',
            onNanos: _ => (_ / BigInt(1e6)) + 'ms',
          })} -- total points: ${O.getOrElse(() => 0)(count)} --`
        )
      )
    )
  }
}

function pointCloudStream(
  min: Shape.Point,
  max: Shape.Point,
  start: Shape.Point,
  retries: number,
  minDistance: number,
  radius = 10
) {
  const halfMin = minDistance / 2
  const inBounds = Shape.pointWithin(
    Shape.point(min.x + halfMin, min.y + halfMin),
    Shape.point(max.x - halfMin, max.y - halfMin)
  )
  const seed: readonly [number, Chunk.Chunk<Shape.Point>] = [0, Chunk.of(start)]

  return pipe(
    Stream.repeatValue(null),
    Stream.mapAccumEffect(seed, ([source, previous], _) => {
      return pipe(
        // IO.log(`starting iteration from index ${source} / ${i}`),
        IO.unit,
        IO.zipRight(mapper([source, previous])),
        IO.map(
          ([index, { point, drawing }]) =>
            [[index, Chunk.append(previous, point)], drawing] as const
        )
      )
    })
  )
  function mapper(state: typeof seed) {
    const [source, previous] = state
    return go(source)

    function go(
      index: number
    ): IO.Effect<
      never,
      number,
      readonly [number, { point: Shape.Point; drawing: Drawing.Drawing }]
    > {
      const size = Chunk.size(previous)
      return index >= size
        ? IO.fail(size)
        : pipe(
            makeNext(Chunk.unsafeGet(index)(previous), previous),
            IO.retryN(retries),
            IO.map(_ => [index, _] as const),
            IO.catchAll(_ => pipe(IO.unit, IO.zipRight(mapper([index + 1, previous]))))
          )
    }
    function makeNext(last: Shape.Point, previous: Chunk.Chunk<Shape.Point>) {
      const isColliding = collides(minDistance)(previous)
      return pipe(
        IO.all([randomAngle, randomDistance(minDistance, minDistance + minDistance * 0.5)]),
        IO.map(_ => nextCircle(last, ..._)),
        IO.flatMap(({ point, color }) =>
          !inBounds(point) || isColliding(point)
            ? IO.fail({ candidate: point })
            : IO.succeed({
                point,
                drawing: drawCircle(Shape.circle(point.x, point.y, radius), color)
              })
        )
      )
    }
  }
}

function drawCircle(shape: Shape.Arc, fillColor: Color.Color): Drawing.Drawing {
  return Drawing.combine(
    Drawing.outline(shape, Drawing.outlineColor(Color.black)),
    Drawing.fill(shape, Drawing.fillStyle(fillColor))
  )
}
