import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

/**
 * Always use these typed hooks instead of the raw react-redux hooks.
 * Full TypeScript inference on all state selectors and dispatched actions.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
