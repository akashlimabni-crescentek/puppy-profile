import type { Puppy } from '@app-types/puppy.types'

/**
 * Mock fixtures for Storybook stories and unit tests.
 * Modelled on the staging seed row ("Maple", Testerson family).
 * This is the only place mock data lives — never inline in stories or tests.
 */

/** Canonical puppy — every field populated. */
export const mockPuppy: Puppy = {
  id: 'mock-puppy-001',
  name: 'Maple',
  breed: 'F1 Australian Mountain Dog',
  birthDate: '2026-03-14',
  sire: 'Stokeshire Atlas',
  dam: 'Stokeshire Willow',
  programType: 'doodle_school',
  programLengthWeeks: 4,
  currentWeek: 2,
  weeklyFocus: 'Settling into crate routines and first gentle leash walks.',
  photoUrl: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=400&h=400&fit=crop',
  status: 'in_school',
  familyId: 'mock-family-001',
  createdAt: '2026-05-30T09:00:00Z',
}

/** Edge case: no weekly focus set → the card shows a calm empty line. */
export const mockPuppyNoFocus: Puppy = {
  ...mockPuppy,
  id: 'mock-puppy-002',
  weeklyFocus: null,
}

/**
 * Edge case: no photo (matches the real staging seed) → the card shows the
 * Lucide avatar placeholder. This is the default visible state in staging.
 */
export const mockPuppyNoPhoto: Puppy = {
  ...mockPuppy,
  id: 'mock-puppy-003',
  photoUrl: null,
}
