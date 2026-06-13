import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Puppy } from '@app-types/puppy.types'
import type { AsyncState, ApiError } from '@app-types/common.types'

/**
 * Puppy state reuses AsyncState<Puppy> and adds the family name for the card
 * greeting (fetched from the RLS-scoped family row in the same query).
 */
interface PuppyState extends AsyncState<Puppy> {
  familyName: string | null
}

/** Success payload: the puppy plus the family name for the greeting. */
export interface FetchPuppySuccessPayload {
  puppy: Puppy
  familyName: string
}

const initialState: PuppyState = {
  data: null,
  status: 'idle',
  error: null,
  familyName: null,
}

const puppySlice = createSlice({
  name: 'puppy',
  initialState,
  reducers: {
    fetchPuppyRequest(state) {
      state.status = 'loading'
      state.error = null
    },
    fetchPuppySuccess(state, action: PayloadAction<FetchPuppySuccessPayload>) {
      state.status = 'succeeded'
      state.data = action.payload.puppy
      state.familyName = action.payload.familyName
      state.error = null
    },
    fetchPuppyFailure(state, action: PayloadAction<ApiError>) {
      state.status = 'failed'
      state.error = action.payload
    },
    resetPuppy(state) {
      state.data = null
      state.status = 'idle'
      state.error = null
      state.familyName = null
    },
  },
})

export const { fetchPuppyRequest, fetchPuppySuccess, fetchPuppyFailure, resetPuppy } =
  puppySlice.actions

export default puppySlice.reducer
