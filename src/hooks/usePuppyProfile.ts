import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { fetchPuppyRequest, resetPuppy } from '@store/puppySlice'

/**
 * Fetches the puppy profile for the authenticated family.
 *
 * Duplicate-call prevention (requirement #15):
 * 1. Auto-fetch fires ONLY from `idle`. After a failure the status is `failed`
 *    (never `idle`), so the effect cannot re-fire itself — no retry loop.
 * 2. takeLatest in the saga is the final safety net.
 *
 * RLS scopes the row to the authenticated user server-side, so no client id is
 * passed (see puppySaga). Net result: exactly one API call per session, plus
 * one per explicit user retry.
 */
export const usePuppyProfile = () => {
  const dispatch = useAppDispatch()
  const { data: puppy, status, error } = useAppSelector((state) => state.puppy)

  useEffect(() => {
    if (status !== 'idle') return
    dispatch(fetchPuppyRequest())
  }, [dispatch, status])

  // Explicit, user-driven retry: reset to idle → the effect above refetches once.
  const retry = useCallback(() => {
    dispatch(resetPuppy())
  }, [dispatch])

  return {
    puppy,
    isLoading: status === 'loading' || status === 'idle',
    isError: status === 'failed',
    error,
    retry,
  }
}
