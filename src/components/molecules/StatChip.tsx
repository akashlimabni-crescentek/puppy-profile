import { memo, type ReactNode } from 'react'
import { Typography } from '@atoms/Typography'

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
 * The value uses Jost bold in copper — the one place copper signals importance.
 */
export const StatChip = memo<StatChipProps>(({ label, value, icon, className = '' }) => (
  <div
    className={`
      flex items-center gap-3
      bg-white rounded-card border border-hairline px-4 py-3
      ${className}
    `}
  >
    {icon && (
      <span aria-hidden="true" className="flex items-center text-copper">
        {icon}
      </span>
    )}
    <div className="flex flex-col">
      <Typography variant="caption" color="secondary">
        {label}
      </Typography>
      <span className="font-sans text-lg font-bold leading-none lining-nums tabular-nums text-copper-dark">
        {value}
      </span>
    </div>
  </div>
))

StatChip.displayName = 'StatChip'
