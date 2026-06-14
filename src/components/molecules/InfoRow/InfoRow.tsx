import { memo, type ReactNode } from 'react'
import { Typography } from '@atoms/Typography/Typography'

export interface InfoRowProps {
  /** Row label text */
  label: string
  /** Row value — string or ReactNode (e.g. a nested element) */
  value: ReactNode
  /** Optional leading icon node (e.g. a Lucide icon) */
  icon?: ReactNode
  /** Additional Tailwind classes */
  className?: string
}

/**
 * Molecule: InfoRow
 * A label–value pair row for the profile card content zone.
 * Accepts ReactNode for both the value and the leading icon.
 * Bottom border on all rows except the last via Tailwind's last: variant.
 */
export const InfoRow = memo<InfoRowProps>(({ label, value, icon, className = '' }) => (
  <div
    className={`
      flex items-center justify-between py-4
      border-b border-hairline last:border-0
      ${className}
    `}
  >
    <div className="flex items-center gap-2">
      {icon && (
        <span aria-hidden="true" className="flex items-center text-slate">
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
