import { memo, useMemo } from 'react'
import { Avatar } from '@atoms/Avatar'
import { Badge, type BadgeVariant } from '@atoms/Badge'
import { Typography } from '@atoms/Typography'
import { InfoRow } from '@molecules/InfoRow'
import { StatChip } from '@molecules/StatChip'
import type { Puppy } from '@app-types/puppy.types'
import {
  formatAge,
  formatWeight,
  formatBirthday,
  capitalizeFirst,
  formatVaccinationStatus,
} from '@utils/formatters'

export interface PuppyProfileCardProps {
  /** The puppy data to display */
  puppy: Puppy
  /** Additional Tailwind classes for the card container */
  className?: string
}

/**
 * Maps vaccination status to Badge variant.
 * Memoized outside the component so it's not recreated on every render.
 */
const vaccinationVariantMap: Record<Puppy['vaccinationStatus'], BadgeVariant> = {
  'up-to-date': 'success',
  'due-soon': 'warning',
  overdue: 'error',
}

const vaccinationIconMap: Record<Puppy['vaccinationStatus'], string> = {
  'up-to-date': '✓',
  'due-soon': '⚠',
  overdue: '✗',
}

/**
 * Organism: PuppyProfileCard
 * The main card component. Composes atoms and molecules to render
 * the full puppy profile. Receives data as props — no Redux connection.
 *
 * useMemo on formatted values prevents recalculation on unrelated re-renders.
 * TODO: Update layout when client provides design spec.
 */
export const PuppyProfileCard = memo<PuppyProfileCardProps>(({ puppy, className = '' }) => {
  const formattedAge = useMemo(() => formatAge(puppy.ageMonths), [puppy.ageMonths])
  const formattedWeight = useMemo(() => formatWeight(puppy.weightKg), [puppy.weightKg])
  const formattedBirthday = useMemo(() => formatBirthday(puppy.birthday), [puppy.birthday])
  const vaccinationLabel = useMemo(
    () => formatVaccinationStatus(puppy.vaccinationStatus),
    [puppy.vaccinationStatus]
  )

  return (
    <article
      className={`
        bg-white rounded-3xl shadow-card overflow-hidden
        w-full max-w-sm mx-auto
        ${className}
      `}
      aria-label={`Puppy profile for ${puppy.name}`}
    >
      {/* Header banner — TODO: Replace gradient with client design spec */}
      <div className="bg-gradient-to-br from-primary-200 to-accent-200 h-24 relative" />

      {/* Avatar + badges */}
      <div className="px-6 -mt-12 flex justify-between items-end">
        <Avatar src={puppy.photoUrl} alt={`Photo of ${puppy.name}`} size="lg" />
        <div className="flex flex-wrap gap-2 pb-2 justify-end">
          <Badge
            label={capitalizeFirst(puppy.gender)}
            variant={puppy.gender === 'male' ? 'info' : 'neutral'}
            icon={puppy.gender === 'male' ? '♂' : '♀'}
          />
          <Badge
            label={vaccinationLabel}
            variant={vaccinationVariantMap[puppy.vaccinationStatus]}
            icon={vaccinationIconMap[puppy.vaccinationStatus]}
          />
        </div>
      </div>

      {/* Name + breed */}
      <div className="px-6 pt-4 pb-2">
        <Typography variant="h2" color="primary">
          {puppy.name}
        </Typography>
        <Typography variant="body" color="secondary" className="mt-0.5">
          {puppy.breed}
        </Typography>
      </div>

      {/* Stat chips */}
      <div className="px-6 py-4 flex gap-3 overflow-x-auto scrollbar-hide">
        <StatChip label="Age" value={formattedAge} icon="🎂" />
        <StatChip label="Weight" value={formattedWeight} icon="⚖️" />
        <StatChip label="Color" value={capitalizeFirst(puppy.color)} icon="🎨" />
      </div>

      {/* Details section */}
      <div className="px-6 pb-6">
        <InfoRow label="Birthday" value={formattedBirthday} icon="📅" />
        <InfoRow label="Gender" value={capitalizeFirst(puppy.gender)} icon="🐾" />
        <InfoRow
          label="Vaccination"
          icon="💉"
          value={
            <Badge
              label={vaccinationLabel}
              variant={vaccinationVariantMap[puppy.vaccinationStatus]}
              size="sm"
            />
          }
        />
        {puppy.microchipId && <InfoRow label="Microchip" value={puppy.microchipId} icon="📡" />}
        <InfoRow label="Family ID" value={puppy.familyId} icon="🏠" />
      </div>
    </article>
  )
})

PuppyProfileCard.displayName = 'PuppyProfileCard'
