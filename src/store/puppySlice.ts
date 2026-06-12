import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Puppy } from '@app-types/puppy.types'
import type { AsyncState, ApiError } from '@app-types/common.types'

type PuppyState = AsyncState<Puppy>

const initialState: PuppyState = {
  data: null,
  status: 'idle',
  error: null,
}

const puppySlice = createSlice({
  name: 'puppy',
  initialState,
  reducers: {
    fetchPuppyRequest(state, _action: PayloadAction<string>) {
      state.status = 'loading'
      state.error = null
    },
    fetchPuppySuccess(state, action: PayloadAction<Puppy>) {
      state.status = 'succeeded'
      state.data = action.payload
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
    },
  },
})

export const { fetchPuppyRequest, fetchPuppySuccess, fetchPuppyFailure, resetPuppy } =
  puppySlice.actions

export default puppySlice.reducer
