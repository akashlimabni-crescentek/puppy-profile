import { describe, it, expect } from 'vitest'
import {
  formatAge,
  formatWeight,
  formatBirthday,
  capitalizeFirst,
  formatVaccinationStatus,
} from './formatters'

describe('formatAge', () => {
  it('returns "Less than 1 month" for 0 months', () => {
    expect(formatAge(0)).toBe('Less than 1 month')
  })

  it('returns singular month for 1 month', () => {
    expect(formatAge(1)).toBe('1 month')
  })

  it('returns plural months for 6 months', () => {
    expect(formatAge(6)).toBe('6 months')
  })

  it('returns years only when no remaining months', () => {
    expect(formatAge(12)).toBe('1 year')
    expect(formatAge(24)).toBe('2 years')
  })

  it('returns years and months for mixed values', () => {
    expect(formatAge(14)).toBe('1 year 2 months')
    expect(formatAge(25)).toBe('2 years 1 month')
  })
})

describe('formatWeight', () => {
  it('formats weight with one decimal place', () => {
    expect(formatWeight(22.5)).toBe('22.5 kg')
    expect(formatWeight(10)).toBe('10.0 kg')
  })
})

describe('formatBirthday', () => {
  it('formats ISO date to readable string', () => {
    const result = formatBirthday('2023-04-10')
    expect(result).toContain('2023')
    expect(result).toContain('April')
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

describe('formatVaccinationStatus', () => {
  it('maps all statuses to display labels', () => {
    expect(formatVaccinationStatus('up-to-date')).toBe('Up to date')
    expect(formatVaccinationStatus('due-soon')).toBe('Due soon')
    expect(formatVaccinationStatus('overdue')).toBe('Overdue')
  })
})
