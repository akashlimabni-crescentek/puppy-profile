import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { lazy, Suspense, useEffect, useRef } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import { PuppyCardSkeleton } from '@molecules/PuppyCardSkeleton/PuppyCardSkeleton'
import { useAppDispatch } from '@store/hooks'
import { initializeAuth } from '@store/authSlice'

/**
 * Lazy-loaded pages — code split so login and profile are separate chunks.
 * Suspense fallback shows the skeleton while the chunk loads.
 */
const LoginPage = lazy(() => import('@pages/LoginPage'))
const ProfilePage = lazy(() => import('@pages/ProfilePage'))

/** Shared full-screen fallback used while a lazy page chunk loads. */
const pageFallback = (
  <main className="min-h-screen bg-parchment flex items-center justify-center p-4">
    <PuppyCardSkeleton />
  </main>
)

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={pageFallback}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Navigate to="/profile" replace /> },
      {
        path: 'profile',
        element: (
          <Suspense fallback={pageFallback}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },
  // Catch-all: unknown paths route back through the auth gate instead of blank.
  { path: '*', element: <Navigate to="/" replace /> },
])

export const AppRouter = () => {
  const dispatch = useAppDispatch()
  const hasInitializedRef = useRef(false)

  // Restore any persisted Supabase session into Redux exactly once on boot.
  // The ref guard keeps this to a single dispatch under React StrictMode, which
  // would otherwise run this mount effect twice and call getSession twice.
  useEffect(() => {
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true
    dispatch(initializeAuth())
  }, [dispatch])

  return <RouterProvider router={router} />
}
