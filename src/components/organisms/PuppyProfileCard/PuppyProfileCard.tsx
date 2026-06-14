import { memo, useMemo } from 'react'
import { Avatar } from '@atoms/Avatar/Avatar'
import { Icon } from '@atoms/Icon/Icon'
import { Typography } from '@atoms/Typography/Typography'
import { InfoRow } from '@molecules/InfoRow/InfoRow'
import { StatChip } from '@molecules/StatChip/StatChip'
import type { Puppy } from '@app-types/puppy.types'
import { formatProgramWeek, formatStatus, formatUsDate } from '@utils/formatters'

/** Shown when a puppy has no weekly focus set yet (nullable column). */
const WEEKLY_FOCUS_EMPTY = "This week's focus will appear here."

/** Lucide line-icon sizing for the card's UI contexts (spec: 13–17px, stroke 1.5–2). */
const ICON_SIZE = 16
const ICON_STROKE = 1.75

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
 * Renders the authenticated family's puppy: name, breed, status, birth date,
 * program progress, weekly focus, and the family greeting.
 *
 * Layout follows the Stokeshire spec: a dark header zone (puppy name in
 * Cormorant Garamond with the status as plain text on ink — no copper), then a cream content
 * zone whose white inner blocks lead with breed, then program progress, birth
 * date, and weekly focus. Copper appears once — the program-week metric.
 * Receives data as props only.
 *
 * useMemo on formatted values prevents recalculation on unrelated re-renders.
 */
export const PuppyProfileCard = memo<PuppyProfileCardProps>(
  ({ puppy, familyName, className = '' }) => {
    const formattedBirthDate = useMemo(
      () => formatUsDate(puppy.birthDate, 'long'),
      [puppy.birthDate]
    )
    const programWeek = useMemo(
      () => formatProgramWeek(puppy.currentWeek, puppy.programLengthWeeks),
      [puppy.currentWeek, puppy.programLengthWeeks]
    )
    const formattedStatus = useMemo(() => formatStatus(puppy.status), [puppy.status])
    const hasWeeklyFocus = Boolean(puppy.weeklyFocus)

    return (
      <article
        className={`
          bg-cream rounded-card border border-hairline shadow-card overflow-hidden
          w-full max-w-sm mx-auto
          ${className}
        `}
        aria-label={`Puppy profile for ${puppy.name}`}
      >
        {/* Dark header zone — puppy name + status on ink */}
        <header className="flex flex-col items-center text-center bg-ink px-6 pt-8 pb-7">
          <Avatar src={puppy.photoUrl} alt={`Photo of ${puppy.name}`} size="lg" />
          <Typography as="h2" variant="h1" color="inverse" className="mt-4">
            {puppy.name}
          </Typography>
          <Typography variant="bodySmall" color="inverse" className="mt-2">
            {formattedStatus}
          </Typography>
        </header>

        {/* Family greeting */}
        {familyName && (
          <Typography variant="bodySmall" color="secondary" className="pt-4 text-center">
            Welcome, the {familyName} family
          </Typography>
        )}

        {/* Cream content zone — scrolls internally when content exceeds the available space */}
        <div className="flex flex-col gap-3 bg-cream p-4 max-h-[60vh] overflow-y-auto">
          {/* White inner card: breed */}
          <div className="bg-white rounded-card border border-hairline px-4">
            <InfoRow
              label="Breed"
              value={puppy.breed}
              icon={<Icon name="paw" size={ICON_SIZE} strokeWidth={ICON_STROKE} />}
            />
          </div>

          {/* Single copper-accented key metric: program progress */}
          <StatChip
            label="Program progress"
            value={programWeek}
            icon={<Icon name="graduationCap" size={ICON_SIZE} strokeWidth={ICON_STROKE} />}
          />

          {/* White inner card: birth date */}
          <div className="bg-white rounded-card border border-hairline px-4">
            <InfoRow
              label="Birth date"
              value={formattedBirthDate}
              icon={<Icon name="calendar" size={ICON_SIZE} strokeWidth={ICON_STROKE} />}
            />
          </div>

          {/* White inner card: weekly focus (calm empty state when null) */}
          <div className="bg-white rounded-card border border-hairline p-4">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="flex items-center text-slate">
                <Icon name="target" size={ICON_SIZE} strokeWidth={ICON_STROKE} />
              </span>
              <Typography variant="label" color="secondary">
                Weekly focus
              </Typography>
            </div>
            <Typography
              variant="body"
              color={hasWeeklyFocus ? 'primary' : 'secondary'}
              className="mt-2"
            >
              {puppy.weeklyFocus ?? WEEKLY_FOCUS_EMPTY}
            </Typography>
          </div>
        </div>
      </article>
    )
  }
)

PuppyProfileCard.displayName = 'PuppyProfileCard'
