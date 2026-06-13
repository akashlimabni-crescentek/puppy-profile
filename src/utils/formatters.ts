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
 * Coerces inputs because Supabase/PostgREST may return int columns as strings in JSON.
 * The single key metric on the card; rendered with the copper accent.
 */
export const formatProgramWeek = (current: number | string, total: number | string): string => {
  const week = Math.trunc(Number(current))
  const length = Math.trunc(Number(total))
  return `Week ${week} of ${length}`
}

/** Capitalizes first letter. e.g. "golden retriever" → "Golden retriever" */
export const capitalizeFirst = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Formats a snake_case status into calm sentence case for display.
 * e.g. "in_school" → "In school". Tone stays declarative (no shouting caps).
 */
export const formatStatus = (status: string): string => {
  if (!status) return ''
  const spaced = status.replace(/_/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}
