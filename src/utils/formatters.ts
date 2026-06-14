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

/** US (en-US) date/time presentation styles, all month-before-day ordering. */
export type DateStyle = 'short' | 'long' | 'datetime' | 'time'

const dateStyleOptions: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  short: { year: 'numeric', month: '2-digit', day: '2-digit' }, // 03/14/2026
  long: { year: 'numeric', month: 'long', day: 'numeric' }, // March 14, 2026
  datetime: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  }, // 03/14/2026, 5:30 PM
  time: { hour: 'numeric', minute: '2-digit' }, // 5:30 PM
}

/**
 * Normalizes accepted date inputs to a Date.
 * A date-only ISO string ("YYYY-MM-DD") is parsed in LOCAL time — `new Date(str)`
 * would treat it as UTC and can render the previous day in negative-offset zones.
 * Returns null for empty or unparseable input.
 */
const toDate = (value: string | number | Date): Date | null => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value === 'number') {
    const fromNumber = new Date(value)
    return Number.isNaN(fromNumber.getTime()) ? null : fromNumber
  }
  if (typeof value === 'string' && value.trim()) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
      const [year, month, day] = value.trim().split('-').map(Number)
      return new Date(year, month - 1, day)
    }
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

/**
 * Formats a date or date-time to US (en-US) format. e.g.
 *   formatUsDate('2026-03-14')         → "03/14/2026"
 *   formatUsDate('2026-03-14', 'long') → "March 14, 2026"
 *   formatUsDate(ts, 'datetime')       → "03/14/2026, 5:30 PM"
 * Returns '' for empty/invalid input so callers can fall back gracefully.
 */
export const formatUsDate = (value: string | number | Date, style: DateStyle = 'short'): string => {
  const date = toDate(value)
  if (!date) return ''
  return date.toLocaleString('en-US', dateStyleOptions[style])
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
