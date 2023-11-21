/**
 * @since 1.0.0
 */
import { Option as O } from 'effect'
import { isEmpty } from 'effect/String'
import { not } from 'effect/Boolean'
import { flow, constant } from 'effect/Function'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * Represents the `font-family` CSS property.
 *
 * The `font-family` CSS property specifies a prioritized list of one or more
 * font family names and/or generic family names for the selected element.
 *
 * @category model
 * @since 1.0.0
 */
export type FontFamily = string

/**
 * Represents optional values for modifying the style of a font.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/font
 *
 * @category model
 * @since 1.0.0
 */
export interface FontOptions {
  /**
   * Represents the `font-style` CSS property.
   *
   * The `font-style` CSS property sets whether a font should be styled with a normal,
   * italic, or oblique face from its * font-family.
   */
  readonly style: O.Option<string>

  /**
   * Represents the `font-variant` CSS property.
   *
   * The `font-variant` CSS property is a shorthand for the longhand properties `font-variant-caps`,
   * `font-variant-numeric`, `font-variant-alternates`, `font-variant-ligatures`, and `font-variant-east-asian`.
   */
  readonly variant: O.Option<string>

  /**
   * Represnts the `font-weight` CSS property.
   *
   * The `font-weight` CSS property sets the weight (or boldness) of the font.
   */
  readonly weight: O.Option<string>
}

/**
 * Represents the `font` CSS property.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/font
 *
 * @category model
 * @since 1.0.0
 */
export interface Font {
  /**
   * Represents the `font-family` CSS property.
   *
   * The `font-family` CSS property specifies a prioritized list of one or more
   * font family names and/or generic family names for the selected element.
   */
  readonly fontFamily: FontFamily

  /**
   * Represents the `font-size` CSS property.
   *
   * The `font-size` CSS property sets the size of the font.
   */
  readonly size: number

  /**
   * Represents optional values for modifying the style of a font.
   */
  readonly fontOptions: FontOptions
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * Constructs a new `FontOptions` object.
 *
 * @category constructors
 * @since 1.0.0
 */
export const fontOptions = ({
  style,
  variant,
  weight
}: {
  readonly style?: string
  readonly variant?: string
  readonly weight?: string
}): FontOptions => ({
  style: O.fromNullable(style),
  variant: O.fromNullable(variant),
  weight: O.fromNullable(weight)
})

/**
 * Constructs a new `Font`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const font = (fontFamily: FontFamily, size: number, options?: FontOptions): Font => ({
  fontFamily,
  size,
  fontOptions: typeof options === 'object' ? options : fontOptions({})
})

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * The `Show` instance for `FontOptions`.
 *
 * @category instances
 * @since 1.0.0
 */
export const showFontOptions = {
  show: (o: FontOptions) =>
    [o.style, o.variant, o.weight]
      .filter(O.isSome)
      .map(O.getOrElse(constant('')))
      .join(' ')
}

const isNotEmpty = flow(isEmpty, not)
/**
 * The `Show` instance for `Font`.
 *
 * @category instances
 * @since 1.0.0
 */
export const showFont = {
  show: ({ fontFamily, size, fontOptions }: Font) =>
    [showFontOptions.show(fontOptions), `${size}px`, fontFamily].filter(isNotEmpty).join(' ')
}
