import { call, put, takeLatest } from 'redux-saga/effects'
import { supabase } from '@utils/supabaseClient'
import type { Family, FamilyRow, Puppy, PuppyRow } from '@app-types/puppy.types'
import { fetchPuppyRequest, fetchPuppySuccess, fetchPuppyFailure } from '@store/puppySlice'

/** The combined embed row: a family with its RLS-scoped puppies nested via the FK. */
type FamilyWithPuppiesRow = FamilyRow & { puppies: PuppyRow[] }

/**
 * Maps a Supabase snake_case `puppies` row to the camelCase Puppy type.
 * All DB-to-app field mapping happens here — nowhere else.
 */
const mapPuppyRow = (row: PuppyRow): Puppy => ({
  id: row.id,
  name: row.name,
  breed: row.breed,
  birthDate: row.birth_date,
  sire: row.sire,
  dam: row.dam,
  programType: row.program_type,
  programLengthWeeks: row.program_length_weeks,
  currentWeek: row.current_week,
  weeklyFocus: row.weekly_focus,
  photoUrl: row.photo_url,
  status: row.status,
  familyId: row.family_id,
  createdAt: row.created_at,
})

/** Maps a Supabase snake_case `families` row to the camelCase Family type. */
const mapFamilyRow = (row: FamilyRow): Family => ({
  id: row.id,
  authUserId: row.auth_user_id,
  familyName: row.family_name,
  email: row.email,
  createdAt: row.created_at,
})

/**
 * Fetches the authenticated family and its puppy in a single RLS-scoped read.
 *
 * Query shape — a DELIBERATE, DOCUMENTED deviation from the house standard.
 * CRESCENTEK-CODE-QUALITY-STANDARD §9/§19/§22 mandates an explicit
 * `.eq('family_id', familyId)` filter alongside RLS. Here we pass NO client-side
 * id: the `families` RLS policy (`auth_user_id = auth.uid()`) scopes the row, and
 * the nested `puppies` are scoped by their own `auth.uid()` subquery policy. There
 * is no `familyId` to filter on until after the family row is read via RLS anyway.
 * The client brief grades "RLS-respecting query patterns" and requires this shape;
 * the deviation is intentional. See DECISIONS.md §1.
 *
 * One combined embed (`families` → `puppies`) keeps this to a single round trip,
 * carrying the family name for the greeting. `.maybeSingle()` returns null (not an
 * error) for zero rows, so the friendly empty-state branch stays reachable.
 * takeLatest prevents duplicate fetches.
 */
function* handleFetchPuppy() {
  try {
    const { data, error } = yield call(() =>
      supabase.from('families').select('*, puppies(*)').maybeSingle()
    )

    if (error) {
      yield put(fetchPuppyFailure({ message: error.message, code: error.code }))
      return
    }

    if (!data) {
      yield put(fetchPuppyFailure({ message: 'No family record found for this account.' }))
      return
    }

    const familyRow = data as FamilyWithPuppiesRow
    const puppyRow = familyRow.puppies?.[0]

    if (!puppyRow) {
      yield put(fetchPuppyFailure({ message: 'No puppy record found for this family.' }))
      return
    }

    const family = mapFamilyRow(familyRow)
    yield put(fetchPuppySuccess({ puppy: mapPuppyRow(puppyRow), familyName: family.familyName }))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch puppy data'
    yield put(fetchPuppyFailure({ message }))
  }
}

export function* watchPuppy() {
  yield takeLatest(fetchPuppyRequest.type, handleFetchPuppy)
}
