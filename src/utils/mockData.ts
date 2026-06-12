import type { Puppy } from '@app-types/puppy.types'

/**
 * Mock fixtures for Storybook stories and unit tests.
 * TODO: Update field values when the client provides the real schema.
 * These are the only place mock data lives — never inline in stories or tests.
 */
export const mockPuppy: Puppy = {
  id: 'mock-puppy-001',
  name: 'Biscuit',
  breed: 'Golden Retriever',
  ageMonths: 14,
  weightKg: 22.5,
  photoUrl: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=400&h=400&fit=crop',
  familyId: 'mock-family-001',
  gender: 'male',
  color: 'Golden',
  vaccinationStatus: 'up-to-date',
  microchipId: 'MC-9876543210',
  birthday: '2023-04-10',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-06-01T08:30:00Z',
}

export const mockPuppyFemale: Puppy = {
  ...mockPuppy,
  id: 'mock-puppy-002',
  name: 'Luna',
  breed: 'Labrador',
  gender: 'female',
  color: 'Black',
  vaccinationStatus: 'due-soon',
  ageMonths: 8,
  weightKg: 15.2,
  photoUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=400&fit=crop',
}

export const mockPuppyOverdue: Puppy = {
  ...mockPuppy,
  id: 'mock-puppy-003',
  name: 'Max',
  breed: 'Beagle',
  gender: 'male',
  color: 'Tricolor',
  vaccinationStatus: 'overdue',
  ageMonths: 24,
  weightKg: 10.8,
}
