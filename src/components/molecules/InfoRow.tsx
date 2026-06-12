import { memo, type ReactNode } from 'react'
import { Typography } from '@atoms/Typography'

export interface InfoRowProps {
  /** Row label text */
  label: string
  /** Row value — string or ReactNode (e.g. a Badge component) */
  value: ReactNode
  /** Optional leading icon (emoji) */
  icon?: string
  /** Additional Tailwind classes */
  className?: string
}

/**
 * Molecule: InfoRow
 * A label–value pair row for the profile card details section.
 * Accepts ReactNode as value so a Badge can be passed directly.
 * Bottom border on all rows except the last via Tailwind's last: variant.
 */
export const InfoRow = memo<InfoRowProps>(({ label, value, icon, className = '' }) => (
  <div
    className={`
      flex items-center justify-between py-3
      border-b border-neutral-100 last:border-0
      ${className}
    `}
  >
    <div className="flex items-center gap-2">
      {icon && (
        <span aria-hidden="true" className="text-base">
          {icon}
        </span>
      )}
      <Typography variant="label" color="secondary">
        {label}
      </Typography>
    </div>
    <div className="text-right max-w-[60%]">
      {typeof value === 'string' ? (
        <Typography variant="label" color="primary">
          {value}
        </Typography>
      ) : (
        value
      )}
    </div>
  </div>
))

InfoRow.displayName = 'InfoRow'
