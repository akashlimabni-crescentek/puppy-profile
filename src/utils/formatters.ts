/**
 * Pure formatter utilities.
 * All functions: camelCase names, no side effects, fully typed.
 * Used in components and Storybook stories.
 */

/**
 * Formats an ISO date-only string to a readable date. e.g. "2026-03-14" → "March 14, 2026".
 * Parses the date components in LOCAL time (not `new Date(isoDate)`, which treats
 * "YYYY-MM-DD" as UTC and can render the previous day in negative-offset zones).
 * Locale is 'en-US' to match the design spec's example output.
 */
export const formatBirthday = (isoDate: string): string => {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formats program progress as the spec string. e.g. (2, 4) → "Week 2 of 4".
 * The single key metric on the card; rendered with the copper accent.
 */
export const formatProgramWeek = (current: number, total: number): string =>
  `Week ${current} of ${total}`

/** Capitalizes first letter. e.g. "golden retriever" → "Golden retriever" */
export const capitalizeFirst = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
