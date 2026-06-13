import { memo, useMemo } from 'react'
import { Avatar } from '@atoms/Avatar'
import { Typography } from '@atoms/Typography'
import { InfoRow } from '@molecules/InfoRow'
import type { Puppy } from '@app-types/puppy.types'
import { formatBirthday, formatProgramWeek } from '@utils/formatters'

/** Shown when a puppy has no weekly focus set yet (nullable column). */
const WEEKLY_FOCUS_EMPTY = "This week's focus will appear here."

export interface PuppyProfileCardProps {
  /** The puppy data to display */
  puppy: Puppy
  /** The family name for the greeting line, e.g. "Testerson" */
  familyName: string | null
  /** Additional Tailwind classes for the card container */
  className?: string
}

/**
 * Organism: PuppyProfileCard
 * Renders the six required fields for the authenticated family's puppy: name,
 * breed, birth date, program progress, weekly focus, and the family greeting.
 * Receives data as props — no Redux connection.
 *
 * useMemo on formatted values prevents recalculation on unrelated re-renders.
 */
export const PuppyProfileCard = memo<PuppyProfileCardProps>(
  ({ puppy, familyName, className = '' }) => {
    const formattedBirthDate = useMemo(() => formatBirthday(puppy.birthDate), [puppy.birthDate])
    const programWeek = useMemo(
      () => formatProgramWeek(puppy.currentWeek, puppy.programLengthWeeks),
      [puppy.currentWeek, puppy.programLengthWeeks]
    )

    return (
      <article
        className={`bg-white rounded-card shadow-card overflow-hidden w-full max-w-sm mx-auto ${className}`}
        aria-label={`Puppy profile for ${puppy.name}`}
      >
        <div className="flex flex-col items-center px-6 pt-6">
          <Avatar src={puppy.photoUrl ?? ''} alt={`Photo of ${puppy.name}`} size="lg" />
          <Typography variant="h2" color="primary" className="mt-4">
            {puppy.name}
          </Typography>
          <Typography variant="body" color="secondary" className="mt-0.5">
            {puppy.breed}
          </Typography>
        </div>

        <div className="px-6 pb-6 pt-4">
          <InfoRow label="Birth date" value={formattedBirthDate} />
          <InfoRow label="Program" value={programWeek} />
          <InfoRow label="Weekly focus" value={puppy.weeklyFocus ?? WEEKLY_FOCUS_EMPTY} />
        </div>

        {familyName && (
          <div className="px-6 pb-6">
            <Typography variant="bodySmall" color="secondary">
              Welcome, the {familyName} family
            </Typography>
          </div>
        )}
      </article>
    )
  }
)

PuppyProfileCard.displayName = 'PuppyProfileCard'
