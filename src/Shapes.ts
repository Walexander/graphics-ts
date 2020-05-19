/**
 * Adapted from https://github.com/purescript-contrib/purescript-drawing
 *
 * @since 1.0.0
 */
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT'
import { Foldable, Foldable1, Foldable2, Foldable3 } from 'fp-ts/lib/Foldable'
import * as ROA from 'fp-ts/lib/ReadonlyArray'
import * as M from 'fp-ts/lib/Monoid'

/**
 * Represents a shape that can be drawn.
 *
 * @since 1.0.0
 */
export type Shape = Path | Rect | Arc | Composite

/**
 * A single point consisting of `x` and `y` coordinates on a two-dimensional plane.
 *
 * @since 1.0.0
 */
export interface Point {
  /**
   * The x-axis coordinate.
   */
  readonly x: number

  /**
   * The y-axis coordinate.
   */
  readonly y: number
}

/**
 * Constructs a `Point` from x and y coordinates.
 *
 * @since 1.0.0
 */
export const point = (x: number, y: number): Point => ({ x, y })

/**
 * A path is a list of points joined by line segments.
 *
 * @since 1.0.0
 */
export interface Path {
  readonly _tag: 'Path'

  /**
   * Indicates if the path is closed or open.
   */
  readonly closed: boolean

  /**
   * The list of points that make up the path.
   */
  readonly points: ReadonlyArray<Point>
}

/**
 * The `Monoid` instance for a `Path`.
 *
 * @since 1.0.0
 */
export const monoidPath: M.Monoid<Path> = M.getStructMonoid({
  _tag: { concat: () => 'Path', empty: 'Path' },
  closed: M.monoidAny,
  points: ROA.getMonoid<Point>()
})

/**
 * Constructs an open `Path` shape from a `Foldable` of `Point`s.
 *
 * @since 1.0.0
 */
export function path<F extends URIS3>(foldable: Foldable3<F>): <E, A>(fa: Kind3<F, E, A, Point>) => Shape
export function path<F extends URIS2>(foldable: Foldable2<F>): <A>(fa: Kind2<F, A, Point>) => Shape
export function path<F extends URIS>(foldable: Foldable1<F>): (fa: Kind<F, Point>) => Shape
export function path<F>(F: Foldable<F>): (fa: HKT<F, Point>) => Shape
export function path<F>(F: Foldable<F>): (fa: HKT<F, Point>) => Shape {
  return (fa) =>
    F.reduce(fa, monoidPath.empty, (b, a) => ({
      _tag: 'Path',
      closed: false,
      points: ROA.snoc(b.points, a)
    }))
}

/**
 * Constructs a closed `Path` shape from a `Foldable` of `Point`s.
 *
 * @since 1.0.0
 */
export function closed<F extends URIS3>(foldable: Foldable3<F>): <E, A>(fa: Kind3<F, E, A, Point>) => Shape
export function closed<F extends URIS2>(foldable: Foldable2<F>): <A>(fa: Kind2<F, A, Point>) => Shape
export function closed<F extends URIS>(foldable: Foldable1<F>): (fa: Kind<F, Point>) => Path
export function closed<F>(F: Foldable<F>): (fa: HKT<F, Point>) => Shape
export function closed<F>(F: Foldable<F>): (fa: HKT<F, Point>) => Shape {
  return (fa) =>
    F.reduce(fa, monoidPath.empty, (b, a) => ({
      _tag: 'Path',
      closed: true,
      points: ROA.snoc(b.points, a)
    }))
}

/**
 * Represents a rectangle with top-left corner coordinates at `x` and `y`.
 *
 * @since 1.0.0
 */
export interface Rect {
  readonly _tag: 'Rect'

  /**
   * The position of the top-left corner of the rectangle on the x-axis.
   */
  readonly x: number

  /**
   * The position of the top-left corner of the rectangle on the x-axis.
   */
  readonly y: number

  /**
   * The width of the rectangle.
   */
  readonly width: number

  /**
   * The height of the rectangle.
   */
  readonly height: number
}

/**
 * Constructs a `Rectangle` shape.
 *
 * @since 1.0.0
 */
export const rect = (x: number, y: number, width: number, height: number): Shape => ({
  _tag: 'Rect',
  x,
  y,
  width,
  height
})

/**
 * An arc with center coordinates `x` and `y`, radius `r`, and starting and ending angles `start` and `end`.
 *
 * @since 1.0.0
 */
export interface Arc {
  readonly _tag: 'Arc'

  /**
   * The position of the center of the arc on the x-axis.
   */
  readonly x: number

  /**
   * The position of the center of the arc on the y-axis.
   */
  readonly y: number

  /**
   * The radius of the arc.
   */
  readonly r: number

  /**
   * The starting angle of the arc.
   */
  readonly start: number

  /**
   * The ending angle of the arc.
   */
  readonly end: number
}

/**
 * Constructs an `Arc` shape.
 *
 * @since 1.0.0
 */
export const arc = (x: number, y: number, r: number, start: number, end: number): Shape => ({
  _tag: 'Arc',
  x,
  y,
  r,
  start,
  end
})

/**
 * Constructs an `Arc` that forms a circle shape.
 *
 * @since 1.0.0
 */
export const circle = (x: number, y: number, r: number): Shape => ({
  _tag: 'Arc',
  x,
  y,
  r,
  start: 0,
  end: Math.PI * 2
})

/**
 * Represents a shape that is composed of several other shapes.
 *
 * @since 1.0.0
 */
export interface Composite {
  readonly _tag: 'Composite'

  /**
   * The list of shapes that compose the composite shape.
   */
  readonly shapes: ReadonlyArray<Shape>
}

/**
 * Constructs a `Composite` shape.
 *
 * @since 1.0.0
 */
export const composite = (shapes: ReadonlyArray<Shape>): Shape => ({
  _tag: 'Composite',
  shapes
})
