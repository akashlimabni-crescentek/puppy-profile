/**
 * Puppy types
 * TODO: Update ALL fields when the client provides the Supabase table schema.
 * After updating, TypeScript will flag every place that needs updating.
 * Follow the compiler errors — they are your audit trail.
 */

export interface Puppy {
  id: string
  name: string
  breed: string
  ageMonths: number
  weightKg: number
  photoUrl: string
  familyId: string
  gender: 'male' | 'female'
  color: string
  vaccinationStatus: 'up-to-date' | 'due-soon' | 'overdue'
  microchipId?: string
  birthday: string // ISO date string e.g. "2023-04-10"
  createdAt: string
  updatedAt: string
}

/**
 * Raw row shape returned from Supabase (snake_case columns).
 * Mapped to camelCase Puppy in the saga before entering the store.
 * TODO: Update column names when client provides schema.
 */
export interface PuppyRow {
  id: string
  name: string
  breed: string
  age_months: number
  weight_kg: number
  photo_url: string
  family_id: string
  gender: 'male' | 'female'
  color: string
  vaccination_status: 'up-to-date' | 'due-soon' | 'overdue'
  microchip_id?: string
  birthday: string
  created_at: string
  updated_at: string
}

export type VaccinationStatus = Puppy['vaccinationStatus']
export type Gender = Puppy['gender']
