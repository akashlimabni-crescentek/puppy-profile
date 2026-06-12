/**
 * Pure formatter utilities.
 * All functions: camelCase names, no side effects, fully typed.
 * Used in components and Storybook stories.
 */

/** Converts age in months to human-readable string. e.g. 14 → "1 year 2 months" */
export const formatAge = (ageMonths: number): string => {
  if (ageMonths < 1) return 'Less than 1 month'
  if (ageMonths < 12) return `${ageMonths} month${ageMonths === 1 ? '' : 's'}`
  const years = Math.floor(ageMonths / 12)
  const months = ageMonths % 12
  if (months === 0) return `${years} year${years === 1 ? '' : 's'}`
  return `${years} year${years === 1 ? '' : 's'} ${months} month${months === 1 ? '' : 's'}`
}

/** Formats weight in kg. e.g. 8.5 → "8.5 kg" */
export const formatWeight = (weightKg: number): string => `${weightKg.toFixed(1)} kg`

/**
 * Formats an ISO date-only string to a readable birthday. e.g. "2023-03-15" → "March 15, 2023".
 * Parses the date components in LOCAL time (not `new Date(isoDate)`, which treats
 * "YYYY-MM-DD" as UTC and can render the previous day in negative-offset zones).
 * Locale is 'en-US' to match the example output; revisit once the design spec lands.
 */
export const formatBirthday = (isoDate: string): string => {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Capitalizes first letter. e.g. "golden retriever" → "Golden retriever" */
export const capitalizeFirst = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Maps vaccination status to display label */
export const formatVaccinationStatus = (status: 'up-to-date' | 'due-soon' | 'overdue'): string => {
  const labels: Record<typeof status, string> = {
    'up-to-date': 'Up to date',
    'due-soon': 'Due soon',
    overdue: 'Overdue',
  }
  return labels[status]
}
