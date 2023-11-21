import * as Shape from '../src/Shape'
import * as Canvas from '../src/Canvas'
import { Effect as IO, pipe, Exit, Chunk, Option as O, Duration, Stream } from 'effect'

import * as Color from '../src/Color'
import * as Drawing from '../src/Drawing'

export function pointCloud() {
  const MIN_DISTANCE = 40
  const POINT_GROUP = 1
  const RETRIES = 15
  const BOUNDS = Shape.rect(-150, -150, 300, 300)
  const min = Shape.point(BOUNDS.x, BOUNDS.y)
  const max = Shape.point(min.x + BOUNDS.width, min.y + BOUNDS.height)
  const boundedBy = (point: Shape.Point) =>
    point.x > min.x && point.y > min.y && point.x < max.x && point.y < max.y
  const withinDistance = collides(MIN_DISTANCE)
  const isGoodPoint = (previous: Chunk.Chunk<Shape.Point>) => {
    const collisionTest = withinDistance(previous)
    return (candidate: Shape.Point) => boundedBy(candidate) && !collisionTest(candidate)
  }
  const initial: { remaining: number; currentIndex: number; accum: Chunk.Chunk<Shape.Point> } = {
    currentIndex: 0,
    remaining: RETRIES,
    accum: Chunk.of(Shape.point(0, 0))
  }
  const scaledDrawing = Drawing.scale(1.5, 1.5)
  const drawBoundary = IO.gen(function* (_) {
    const centered = yield* _(centeredCanvas)
    const bounded = Shape.rect(
      BOUNDS.x - MIN_DISTANCE,
      BOUNDS.y - MIN_DISTANCE,
      BOUNDS.width + MIN_DISTANCE * 2,
      BOUNDS.height + MIN_DISTANCE * 2
    )
    const bounds = Drawing.outline(bounded, Drawing.outlineColor(Color.black))
    const drawing = centered(scaledDrawing(bounds))
    return yield* _(Drawing.render(drawing))
  })

  type State = typeof initial
  type A = {
    readonly seed: Shape.Point
    readonly good: Chunk.Chunk<Shape.Point>
  }
  type Rnd = readonly [Shape.Degrees, number]
  type F = IO.Effect<never, string, readonly [State, A]>
  function mapRandomPoints({ currentIndex, remaining, accum }: State, shapes: Chunk.Chunk<Rnd>): F {
    const eff = 
      pipe(
        Chunk.get(accum, currentIndex),
        O.map(
          current =>
            [
              pipe(
                Chunk.map(shapes,
                ([angle, distance]) => nextCircle(current, angle, distance).point),
                Chunk.filter(isGoodPoint(accum)),
              ),
              current
            ] as const
        ),
        O.map(
          ([good, seed]) => [good, seed, remaining - (POINT_GROUP - Chunk.size(good))] as const
        ),
        O.map(
          ([good, seed, remaining]) =>
            [
              <State>{
                currentIndex: remaining > 0 ? currentIndex : currentIndex + 1,
                remaining: remaining > 0 ? remaining : RETRIES,
                accum: Chunk.append(accum, good)
              },
              <A>{ seed, good }
            ] as const
        ),
      )
    const eff_ = IO.orElse(eff, () => IO.fail(``))
    return eff_
  }
  function makeDrawings(previous: Chunk.Chunk<Shape.Point>, { seed, good }: A) {
    const size = Chunk.size(previous)
    const pct = size / 50
    const angle = pct < 1 ? 0 : size / (Math.PI * 2)
    return [
      Chunk.appendAll(previous, good),
      Drawing.combine(
        Drawing.combineAll(
          Chunk.map(good, _ =>
            pipe(
              Drawing.combine(
                Drawing.fill(
                  Shape.circle(_.x, _.y, 10),
                  Drawing.fillStyle(Color.hsl(angle, 0.25, 0.5))
                ),
                Drawing.outline(Shape.circle(_.x, _.y, 10), Drawing.outlineColor(Color.black))
              ),
              point =>
                Drawing.combine(
                  Drawing.combine(
                    Drawing.fill(
                      Shape.circle(_.x, _.y, 20),
                      Drawing.fillStyle(Color.hsl(0, 0, 0.5))
                    ),
                    Drawing.outline(Shape.circle(_.x, _.y, 20), Drawing.outlineColor(Color.black))
                  ),
                  point
                )
            )
          )
        ),
        Drawing.fill(Shape.circle(seed.x, seed.y, 10), Drawing.fillStyle(Color.hsl(180, 0.25, 0.1)))
      )
    ] as const
  }
  return pipe(
    Stream.repeatEffect(IO.all([randomAngle, randomDistance(MIN_DISTANCE, MIN_DISTANCE * 1.2)])),
    Stream.grouped(POINT_GROUP),
    Stream.mapAccumEffect(initial, mapRandomPoints),
    Stream.mapAccum(Chunk.empty<Shape.Point>(), makeDrawings),
    Stream.grouped(1),
    Stream.mapEffect(drawings =>
      IO.gen(function* ($) {
        const centered = yield* $(centeredCanvas)
        const drawing = centered(scaledDrawing(Drawing.combineAll(drawings)))
        yield* $(IO.delay(Drawing.render(drawing), Duration.millis(1e2)))
      })
    ),
    Stream.catchAll(_ => Stream.succeed(Exit.succeed(_))),
    Stream.runDrain,
    IO.timed,
    IO.tap(([duration]) => IO.log(`-- time taken: ${duration.value}ms --`)),
    IO.zip(drawBoundary, { concurrent: true }),
    Canvas.renderTo('canvas'),
    IO.runPromise
  )
}
export function collides(minDistance: number) {
  const tester = collidesWith(minDistance)
  return (previous: Chunk.Chunk<Shape.Point>) => (candidate: Shape.Point) =>
    Chunk.some(previous, tester(candidate))
}
export const centeredCanvas = pipe(
  Canvas.dimensions,
  IO.map(({ width, height }) => Drawing.translate(width / 2, height / 2))
)
function collidesWith(minDistance: number) {
  const d2 = minDistance * minDistance
  return (a: Shape.Point) => (b: Shape.Point) => {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return dx * dx + dy * dy < d2
  }
}

export const randomAngle = pipe(
  IO.random,
  // IO.flatMap(_ => _.nextIntBetween(0, 360)),
  IO.flatMap(_ => _.nextIntBetween(0, 360)),
  IO.map(Shape.degrees)
)
export const randomDistance = (min: number, max: number) =>
  pipe(
    IO.random,
    IO.flatMap(_ => _.nextIntBetween(min, max))
  )

export function nextCircle(shape: Shape.Point, angle: Shape.Degrees, distance: number) {
  const angle_ = Shape.angle(angle)
  const x_ = shape.x + distance * Math.cos(angle_)
  const y_ = shape.y + distance * Math.sin(angle_)
  const next = Shape.point(x_, y_)
  return { point: next, color: Color.hsl(angle.degrees, 0.5, 0.5) }
}
