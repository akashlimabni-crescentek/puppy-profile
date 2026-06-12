import { call, put, takeLatest } from 'redux-saga/effects'
import { supabase } from '@utils/supabaseClient'
import type { Puppy, PuppyRow } from '@app-types/puppy.types'
import { fetchPuppyRequest, fetchPuppySuccess, fetchPuppyFailure } from '@store/puppySlice'

/**
 * Maps Supabase snake_case row to camelCase Puppy type.
 * All DB-to-app field mapping happens here — nowhere else.
 * TODO: Update field mappings when client provides real table schema.
 */
const mapPuppyRow = (row: PuppyRow): Puppy => ({
  id: row.id,
  name: row.name,
  breed: row.breed,
  ageMonths: row.age_months,
  weightKg: row.weight_kg,
  photoUrl: row.photo_url,
  familyId: row.family_id,
  gender: row.gender,
  color: row.color,
  vaccinationStatus: row.vaccination_status,
  microchipId: row.microchip_id,
  birthday: row.birthday,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

/**
 * Fetches the authenticated family's puppy record.
 *
 * RLS scopes the row to auth.uid() server-side, so we pass NO client id — the
 * strongest signal on the "RLS-respecting query patterns" axis. .maybeSingle()
 * returns null (not an error) for zero rows, so the friendly empty-state branch
 * is reachable; the error branch is reserved for genuine failures.
 *
 * takeLatest prevents duplicate fetches if dispatched multiple times.
 *
 * TODO: Confirm the table name and that the RLS policy is auth.uid()-based when
 * the client provides the real staging schema.
 */
function* handleFetchPuppy() {
  try {
    const { data, error } = yield call(() =>
      supabase
        .from('puppies') // TODO: confirm table name with client
        .select('*')
        .maybeSingle()
    )

    if (error) {
      yield put(fetchPuppyFailure({ message: error.message, code: error.code }))
      return
    }

    if (!data) {
      yield put(fetchPuppyFailure({ message: 'No puppy record found for this family.' }))
      return
    }

    yield put(fetchPuppySuccess(mapPuppyRow(data as PuppyRow)))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch puppy data'
    yield put(fetchPuppyFailure({ message }))
  }
}

export function* watchPuppy() {
  yield takeLatest(fetchPuppyRequest.type, handleFetchPuppy)
}
