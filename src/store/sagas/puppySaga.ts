import { call, put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
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
 * Fetches puppy record for the given familyId.
 * The Supabase RLS policy ensures users can only read their own family's record.
 * takeLatest prevents duplicate fetches if dispatched multiple times.
 *
 * TODO: Confirm table name and column name with client.
 */
function* handleFetchPuppy(action: PayloadAction<string>) {
  try {
    const familyId = action.payload

    const { data, error } = yield call(() =>
      supabase
        .from('puppies') // TODO: confirm table name with client
        .select('*')
        .eq('family_id', familyId) // TODO: confirm column name with client
        .single()
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
