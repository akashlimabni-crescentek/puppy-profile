/**
 * Domain types for the Stokeshire families + puppies schema.
 *
 * Two tables, RLS-enabled, select-only for the family user:
 *   families (id, auth_user_id, family_name, email, created_at)
 *   puppies  (id, family_id, name, breed, birth_date, sire, dam,
 *             program_type, program_length_weeks, current_week,
 *             weekly_focus, photo_url, status, created_at)
 *
 * Each table has a camelCase app type and a snake_case DB-row type.
 * Mapping between the two happens in exactly one place: the puppy saga.
 */

/** A puppy enrolled in a Stokeshire program (app shape, camelCase). */
export interface Puppy {
  id: string
  name: string
  breed: string
  /** ISO date string, e.g. "2026-03-14". */
  birthDate: string
  /** Father's registered name; nullable in the schema. */
  sire: string | null
  /** Mother's registered name; nullable in the schema. */
  dam: string | null
  /** Program identifier, e.g. "doodle_school". */
  programType: string
  /** Total length of the program in weeks, e.g. 4. */
  programLengthWeeks: number
  /** Current week within the program, 1..programLengthWeeks. */
  currentWeek: number
  /** This week's focus copy; nullable → render a calm empty state. */
  weeklyFocus: string | null
  /** Photo URL; nullable → render the Lucide avatar placeholder. */
  photoUrl: string | null
  /** Lifecycle status, e.g. "in_school". */
  status: string
  /** Owning family id (FK to families.id). */
  familyId: string
  createdAt: string
}

/**
 * Raw `puppies` row from Supabase (snake_case, mirrors DB columns exactly).
 * Mapped to {@link Puppy} in the saga before entering the store.
 */
export interface PuppyRow {
  id: string
  name: string
  breed: string
  birth_date: string
  sire: string | null
  dam: string | null
  program_type: string
  program_length_weeks: number | string
  current_week: number | string
  weekly_focus: string | null
  photo_url: string | null
  status: string
  family_id: string
  created_at: string
}

/** A family account (app shape, camelCase). */
export interface Family {
  id: string
  authUserId: string
  familyName: string
  email: string
  createdAt: string
}

/**
 * Raw `families` row from Supabase (snake_case, mirrors DB columns exactly).
 * Mapped to {@link Family} in the saga.
 */
export interface FamilyRow {
  id: string
  auth_user_id: string
  family_name: string
  email: string
  created_at: string
}
