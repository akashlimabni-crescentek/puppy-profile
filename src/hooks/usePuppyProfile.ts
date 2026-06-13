import { useCallback, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { fetchPuppyRequest, resetPuppy } from '@store/puppySlice'

/**
 * Fetches the puppy profile for the authenticated family.
 *
 * Duplicate-call prevention (requirement #15):
 * 1. Auto-fetch fires ONLY from `idle`. After a failure the status is `failed`
 *    (never `idle`), so the effect cannot re-fire itself — no retry loop.
 * 2. A ref guard makes the dispatch fire at most once per `idle` window. Under
 *    React StrictMode the mount effect runs twice synchronously with a stale
 *    `status` closure, so a status check alone would dispatch twice (and
 *    takeLatest can't recall the network request the cancelled task already
 *    sent). The ref is re-armed whenever status leaves `idle`, so an explicit
 *    retry (resetPuppy → idle) still fetches exactly once.
 * 3. takeLatest in the saga is the final safety net.
 *
 * RLS scopes the row to the authenticated user server-side, so no client id is
 * passed (see puppySaga). Net result: exactly one API call per session, plus
 * one per explicit user retry.
 */
export const usePuppyProfile = () => {
  const dispatch = useAppDispatch()
  const { data: puppy, familyName, status, error } = useAppSelector((state) => state.puppy)
  const hasRequestedRef = useRef(false)

  useEffect(() => {
    if (status === 'idle') {
      if (hasRequestedRef.current) return
      hasRequestedRef.current = true
      dispatch(fetchPuppyRequest())
    } else {
      // Left idle (loading/succeeded/failed) — re-arm for a future explicit retry.
      hasRequestedRef.current = false
    }
  }, [dispatch, status])

  // Explicit, user-driven retry: reset to idle → the effect above refetches once.
  const retry = useCallback(() => {
    dispatch(resetPuppy())
  }, [dispatch])

  return {
    puppy,
    familyName,
    isLoading: status === 'loading' || status === 'idle',
    isError: status === 'failed',
    error,
    retry,
  }
}
