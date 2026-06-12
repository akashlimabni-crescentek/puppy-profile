import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import authReducer from './authSlice'
import puppyReducer from './puppySlice'
import { rootSaga } from './sagas/rootSaga'

/**
 * Builds a fully-wired store instance (reducers + saga middleware running).
 * The app uses the `store` singleton below; tests call makeStore() to get an
 * isolated store with fresh state and its own saga runtime.
 */
export const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware()

  const store = configureStore({
    reducer: {
      auth: authReducer,
      puppy: puppyReducer,
    },
    middleware: (getDefaultMiddleware) =>
      // Redux holds only the minimal serializable AuthUser; the Supabase client
      // owns the live Session. No serializableCheck ignore-list is needed.
      getDefaultMiddleware({
        thunk: false, // Sagas handle all async — no thunks needed
      }).concat(sagaMiddleware),
    devTools: import.meta.env.DEV,
  })

  sagaMiddleware.run(rootSaga)
  return store
}

export const store = makeStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
