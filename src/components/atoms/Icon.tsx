import { memo } from 'react'
import {
  AlertCircle,
  Calendar,
  Check,
  Dog,
  GraduationCap,
  PawPrint,
  Target,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'

/**
 * The single registry of Lucide glyphs used across the app.
 * This is the ONLY place `lucide-react` may be imported — every other file
 * renders icons through <Icon name="…" />. To add a glyph, register it here.
 */
const iconRegistry = {
  alertCircle: AlertCircle,
  calendar: Calendar,
  check: Check,
  dog: Dog,
  graduationCap: GraduationCap,
  paw: PawPrint,
  target: Target,
  triangleAlert: TriangleAlert,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof iconRegistry
export type IconTone = 'inherit' | 'brand' | 'muted' | 'error'

export interface IconProps {
  /** Registered glyph name — the only way to select an icon */
  name: IconName
  /** Pixel size of the glyph. Defaults to 16, or 28 when framed. */
  size?: number
  /** Stroke weight */
  strokeWidth?: number
  /**
   * Colour tone. `inherit` (default) uses the parent's currentColor — correct
   * when the icon sits inside an already-coloured container (rows, error text).
   */
  tone?: IconTone
  /** Wrap the glyph in a circular tinted medallion (e.g. a brand mark) */
  framed?: boolean
  /**
   * Accessible name. When provided, the icon is exposed to assistive tech as an
   * image with this label; when omitted, the icon is decorative (aria-hidden).
   */
  label?: string
  /** Additional Tailwind classes on the rendered element */
  className?: string
}

const toneText: Record<IconTone, string> = {
  inherit: '',
  brand: 'text-copper',
  muted: 'text-slate',
  error: 'text-error',
}

const toneFrame: Record<IconTone, string> = {
  inherit: 'bg-tan-light',
  brand: 'bg-tan-light',
  muted: 'bg-tan-light',
  error: 'bg-error/15',
}

/**
 * Atom: Icon
 * The project's single icon surface — a thin wrapper over a registry of Lucide
 * glyphs that standardises size, stroke, tone, and accessibility. Use `framed`
 * for a circular tinted medallion (e.g. the login brand mark); leave it off for
 * a bare glyph that inherits its colour from the surrounding container.
 *
 * @example
 * <Icon name="paw" tone="brand" framed label="Stokeshire" />
 * <Icon name="calendar" size={16} strokeWidth={1.75} />
 */
export const Icon = memo<IconProps>(
  ({ name, size, strokeWidth = 1.75, tone = 'inherit', framed = false, label, className = '' }) => {
    const Glyph = iconRegistry[name]
    const glyphSize = size ?? (framed ? 28 : 16)
    const accessibility = label
      ? { role: 'img' as const, 'aria-label': label }
      : { 'aria-hidden': true }

    if (framed) {
      return (
        <div
          className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${toneFrame[tone]} ${toneText[tone]}
            ${className}
          `}
          {...accessibility}
        >
          <Glyph size={glyphSize} strokeWidth={strokeWidth} aria-hidden="true" />
        </div>
      )
    }

    return (
      <Glyph
        size={glyphSize}
        strokeWidth={strokeWidth}
        className={`${toneText[tone]} ${className}`.trim()}
        {...accessibility}
      />
    )
  }
)

Icon.displayName = 'Icon'
