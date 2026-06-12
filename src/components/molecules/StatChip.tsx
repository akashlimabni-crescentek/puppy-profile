import { memo } from 'react'
import { Typography } from '@atoms/Typography'

export interface StatChipProps {
  /** Stat label shown below the value */
  label: string
  /** Stat value shown prominently */
  value: string
  /** Optional icon shown above the value */
  icon?: string
  /** Additional Tailwind classes */
  className?: string
}

/**
 * Molecule: StatChip
 * Compact stat block for key metrics (age, weight, color).
 * Used in a row in the card header area.
 */
export const StatChip = memo<StatChipProps>(({ label, value, icon, className = '' }) => (
  <div
    className={`
      flex flex-col items-center justify-center
      bg-neutral-50 rounded-2xl px-4 py-3 min-w-[80px]
      ${className}
    `}
  >
    {icon && (
      <span aria-hidden="true" className="text-xl mb-1">
        {icon}
      </span>
    )}
    <Typography variant="h4" color="primary" className="leading-none">
      {value}
    </Typography>
    <Typography variant="caption" color="muted" className="mt-1 text-center">
      {label}
    </Typography>
  </div>
))

StatChip.displayName = 'StatChip'
