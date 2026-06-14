import { describe, it, expect } from 'vitest'
import {
  formatBirthday,
  formatProgramWeek,
  capitalizeFirst,
  formatStatus,
  formatUsDate,
} from './formatters'

describe('formatBirthday', () => {
  it('formats an ISO date to a readable string', () => {
    const result = formatBirthday('2026-03-14')
    expect(result).toContain('2026')
    expect(result).toContain('March')
    expect(result).toContain('14')
  })

  it('parses the date in local time so the day does not shift', () => {
    expect(formatBirthday('2026-03-14')).toBe('March 14, 2026')
  })
})

describe('formatUsDate', () => {
  it('formats a date-only string as US short by default', () => {
    expect(formatUsDate('2026-03-14')).toBe('03/14/2026')
  })

  it('parses date-only strings in local time so the day does not shift', () => {
    expect(formatUsDate('2026-03-14', 'long')).toBe('March 14, 2026')
  })

  it('formats a full timestamp as US date-time', () => {
    expect(formatUsDate('2026-03-14T17:30:00', 'datetime')).toBe('03/14/2026, 5:30 PM')
  })

  it('formats time-only in US 12-hour format', () => {
    expect(formatUsDate('2026-03-14T17:30:00', 'time')).toBe('5:30 PM')
  })

  it('returns an empty string for empty or invalid input', () => {
    expect(formatUsDate('')).toBe('')
    expect(formatUsDate('not-a-date')).toBe('')
  })
})

describe('formatProgramWeek', () => {
  it('formats current and total weeks into the spec string', () => {
    expect(formatProgramWeek(2, 4)).toBe('Week 2 of 4')
  })

  it('handles the first and final weeks', () => {
    expect(formatProgramWeek(1, 4)).toBe('Week 1 of 4')
    expect(formatProgramWeek(4, 4)).toBe('Week 4 of 4')
  })

  it('coerces string week values from Supabase JSON', () => {
    expect(formatProgramWeek('2', '4')).toBe('Week 2 of 4')
  })
})

describe('capitalizeFirst', () => {
  it('capitalizes the first character', () => {
    expect(capitalizeFirst('golden retriever')).toBe('Golden retriever')
  })

  it('returns empty string for empty input', () => {
    expect(capitalizeFirst('')).toBe('')
  })
})

describe('formatStatus', () => {
  it('converts a snake_case status to calm sentence case', () => {
    expect(formatStatus('in_school')).toBe('In school')
  })

  it('handles a single-word status', () => {
    expect(formatStatus('graduated')).toBe('Graduated')
  })

  it('returns empty string for empty input', () => {
    expect(formatStatus('')).toBe('')
  })
})
