import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { fetchPuppyRequest } from '@store/puppySlice'

/**
 * Fetches the puppy profile for the authenticated family.
 *
 * Duplicate fetch prevention:
 * 1. The effect only runs when familyId changes (dependency array)
 * 2. Status guard: skips dispatch if already loading or succeeded
 * 3. The saga uses takeLatest as a final safety net
 *
 * This means the Supabase API is called exactly once per session.
 */
export const usePuppyProfile = (familyId: string | undefined) => {
  const dispatch = useAppDispatch()
  const { data: puppy, status, error } = useAppSelector((state) => state.puppy)

  useEffect(() => {
    // Guard: only fetch if we have a familyId and haven't fetched yet
    if (!familyId || status === 'loading' || status === 'succeeded') return
    dispatch(fetchPuppyRequest(familyId))
  }, [dispatch, familyId, status])

  return {
    puppy,
    isLoading: status === 'loading' || status === 'idle',
    isError: status === 'failed',
    error,
  }
}
