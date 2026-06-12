import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import authReducer from './authSlice'
import puppyReducer from './puppySlice'
import { rootSaga } from './sagas/rootSaga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    auth: authReducer,
    puppy: puppyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Sagas handle all async — no thunks needed
      serializableCheck: {
        // Supabase Session contains Date objects — exclude from serializable check
        ignoredActions: ['auth/loginSuccess', 'auth/setSession'],
        ignoredPaths: ['auth.session'],
      },
    }).concat(sagaMiddleware),
  devTools: import.meta.env.DEV,
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
