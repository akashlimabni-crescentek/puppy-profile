import { memo, type ReactNode } from 'react'
import { Typography } from '@atoms/Typography/Typography'

export interface StatChipProps {
  /** Label describing the metric */
  label: string
  /** The metric value — rendered in copper as the card's single key metric */
  value: string
  /** Optional leading icon node (e.g. a Lucide icon) */
  icon?: ReactNode
  /** Additional Tailwind classes */
  className?: string
}

/**
 * Molecule: StatChip
 * The card's single copper-accented key metric (program week progress).
 * Layout mirrors InfoRow (label left, value right) so the week string aligns
 * with breed and birth date values. The value uses Jost bold in copper.
 */
export const StatChip = memo<StatChipProps>(({ label, value, icon, className = '' }) => (
  <div
    className={`
      flex items-center justify-between gap-3
      bg-white rounded-card border border-hairline p-4
      ${className}
    `}
  >
    <div className="flex items-center gap-2 min-w-0">
      {icon && (
        <span aria-hidden="true" className="flex shrink-0 items-center text-slate">
          {icon}
        </span>
      )}
      <Typography variant="label" color="secondary">
        {label}
      </Typography>
    </div>
    <span className="font-sans text-lg font-bold leading-none lining-nums tabular-nums text-copper-dark text-right shrink-0">
      {value}
    </span>
  </div>
))

StatChip.displayName = 'StatChip'
