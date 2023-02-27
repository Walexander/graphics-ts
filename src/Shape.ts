/**
 * Adapted from https://github.com/purescript-contrib/purescript-drawing
 *
 * @since 1.0.0
 */
import { Kind, TypeLambda } from '@effect/data/HKT'
import { Foldable } from '@effect/data/typeclass/Foldable'
import * as RA from '@effect/data/ReadonlyArray'
import * as M from '@effect/data/typeclass/Monoid'
import {pipe} from '@effect/data/Function'
import { ImageSource } from './Canvas/definition'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * Represents an angle specified in degrees.
 *
 * @category model
 * @since 1.0.0
 */
export interface Degrees {
  readonly _tag: 'Degrees'

  /**
   * The angle in degrees.
   */
  readonly degrees: number
}

/**
 * Represents an angle specified in radians.
 *
 * @category model
 * @since 1.0.0
 */
export interface Radians {
  readonly _tag: 'Radians'

  /**
   * The angle in radians.
   */
  readonly radians: number
}

/**
 * Represents an angle specified in either degrees or radians.
 *
 * @category model
 * @since 1.0.0
 */
export type Angle = Degrees | Radians

/**
 * A single point consisting of `x` and `y` coordinates on a two-dimensional plane.
 *
 * @category model
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
 * An arc with center coordinates `x` and `y`, radius `r`, starting and ending angles `start` and `end`,
 * and travels in the direction given by `anticlockwise` (defaulting to clockwise)
 *
 * @category model
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

  /**
   * If `true`, draws the `Arc` in a counter-clockwise direction. Defaults to `false` (clockwise).
   */
  readonly anticlockwise: boolean
}

/**
 * Represents a shape that is composed of several other shapes.
 *
 * @category model
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
 * An elliptical arc centered at (`x`, `y`) with the radii radiusX and radiusY specified by `rx` and `ry`.
 * The path starts at startAngle and ends at endAngle, specified by `start` and `end`, with the specified
 * `rotation` and travels in the direction given by `anticlockwise` (defaulting to clockwise).
 *
 * @category model
 * @since 1.0.0
 */
export interface Ellipse {
  readonly _tag: 'Ellipse'

  /**
   * The position of the center of the ellipse on the x-axis.
   */
  readonly x: number

  /**
   * The position of the center of the ellipse on the y-axis.
   */
  readonly y: number

  /**
   * The major-axis radius of the ellipse.
   */
  readonly rx: number

  /**
   * The minor-axis radius of the ellipse.
   */
  readonly ry: number

  /**
   * The starting angle of the arc.
   */
  readonly start: number

  /**
   * The ending angle of the arc.
   */
  readonly end: number

  /**
   * The rotation of the ellipse.
   */
  readonly rotation: number

  /**
   * If `true`, draws the `Ellipse` in a counter-clockwise direction. Defaults to `false` (clockwise).
   */
  readonly anticlockwise: boolean
}

/**
 * A path is a list of points joined by line segments.
 *
 * @category model
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
 * Represents a rectangle with top-left corner coordinates at `x` and `y`.
 *
 * @category model
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
 * Represents an `ImageSource` with a top-left corner at `x` and `y`,
 * a width and a height
*
* @category model
* @since 2.0.0
 */
export interface Image {
  readonly _tag: 'Image'

  /**
   * The position of the top-left corner on the x-axis.
   */
  readonly source: Point
  /**
   * The position of the top-left corner on the x-axis
   * of the source image
   */
  readonly dest?: Point
  /**
   * The source of the image data
   */
  readonly image: ImageSource
}

/**
 * Represents a shape that can be drawn.
 *
 * @category model
 * @since 1.0.0
 */
export type Shape = Arc | Composite | Ellipse | Path | Rect

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * Constructs an angle specified in degrees.
 *
 * @category constructors
 * @since 1.0.0
 */
export const degrees = (degrees: number): Degrees => ({ _tag: 'Degrees', degrees })

/**
 * Constructs an angle specified in degrees.
 *
 * @category constructors
 * @since 1.0.0
 */
export const radians = (radians: number): Radians => ({ _tag: 'Radians', radians })

/**
 * Converts an angle into radians for use with the canvas.
 *
 * @category constructors
 * @since 1.0.0
 */
export const angle = (angle: Angle): number => {
  switch (angle._tag) {
    case 'Degrees':
      return angle.degrees * (Math.PI / 180)

    case 'Radians':
      return angle.radians
  }
}

/**
 * Constructs a `Point` from x and y coordinates.
 *
 * @category constructors
 * @since 1.0.0
 */
export const point = (x: number, y: number): Point => ({ x, y })

/**
 * Constructs an image `Shape`
 *
 * @category constructors
 * @since 2.0.0
 */
export const image = (image: ImageSource, source: Point, dest?: Point) => ({
  _tag: 'Image',
  image,
  source,
  dest
})

/**
 * Constructs an `Arc` shape.
 *
 * @category constructors
 * @since 1.0.0
 */
export const arc = (
  x: number,
  y: number,
  r: number,
  start: Angle,
  end: Angle,
  anticlockwise: boolean = false
): Arc => ({
  _tag: 'Arc',
  x,
  y,
  r,
  start: angle(start),
  end: angle(end),
  anticlockwise
})

/**
 * Constructs an `Arc` that forms a circle shape.
 *
 * @category constructors
 * @since 1.0.0
 */
export const circle = (x: number, y: number, r: number): Arc => ({
  _tag: 'Arc',
  x,
  y,
  r,
  start: angle(radians(0)),
  end: angle(radians(Math.PI * 2)),
  anticlockwise: false
})

/**
 * Constructs a `Composite` shape.
 *
 * @category constructors
 * @since 1.0.0
 */
export const composite = (shapes: ReadonlyArray<Shape>): Composite => ({
  _tag: 'Composite',
  shapes
})

/**
 * Constructs an `Ellipse` shape.
 *
 * @category constructors
 * @since 1.0.0
 */
export const ellipse = (
  x: number,
  y: number,
  rx: number,
  ry: number,
  rotation: Angle,
  start: Angle,
  end: Angle,
  anticlockwise: boolean = false
): Ellipse => ({
  _tag: 'Ellipse',
  x,
  y,
  rx,
  ry,
  rotation: angle(rotation),
  start: angle(start),
  end: angle(end),
  anticlockwise
})

/**
 * Constructs a closed `Path` shape from a `Foldable` of `Point`s.
 *
 * @category constructors
 * @since 1.0.0
 */
export function closed<F extends TypeLambda>(F: Foldable<F>): <R, O, E>(fa: Kind<F, R, O, E, Point>) => Path {
  return F.reduce(monoidPath.empty, (b, a) => ({
    _tag: 'Path',
    closed: true,
    points: RA.append(a)(b.points)
  }))
}

/**
 * Constructs an open `Path` shape from a `Foldable` of `Point`s.
 *
 * @category constructors
 * @since 1.0.0
 */
export function path<F extends TypeLambda>(F: Foldable<F>): <R, O, E>(fa: Kind<F, R, O, E,Point>) => Path {
  return F.reduce(monoidPath.empty, (b, a) => ({
    _tag: 'Path',
    closed: false,
    points: RA.append(a)(b.points)
  }))
}

/**
 * Constructs a `Rectangle` shape.
 *
 * @category constructors
 * @since 1.0.0
 */
export const rect = (x: number, y: number, width: number, height: number): Rect => ({
  _tag: 'Rect',
  x,
  y,
  width,
  height
})
/**
 * Create an equilateral polygon of `n` sides
 *
 * @category constructors
 * @since 2.0.0
 */
export const polygon = (sides: number): Shape => pipe(
  RA.range(0, sides - 1),
  RA.map((n) => pipe(n * Math.PI / (sides / 2), (theta) => point(Math.sin(theta), Math.cos(theta)))),
  closed(RA.Foldable)
)

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * The `Monoid` instance for a `Path`.
 *
 * @category instances
 * @since 1.0.0
 */
export const monoidPath: M.Monoid<Path> = M.struct({
  _tag: <M.Monoid<Path['_tag']>>{
    combineAll: () => 'Path' as const,
    combineMany: () => ('Path') as const,
    combine: () => ('Path') as const,
    empty: 'Path'
  },
  closed: M.booleanSome,
  points: RA.getMonoid<Point>()
})
