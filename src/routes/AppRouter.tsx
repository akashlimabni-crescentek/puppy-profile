import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import { PuppyCardSkeleton } from '@molecules/PuppyCardSkeleton'

/**
 * Lazy-loaded pages — code split so login and profile are separate chunks.
 * Suspense fallback shows the skeleton while the chunk loads.
 */
const LoginPage = lazy(() => import('@pages/LoginPage'))
const ProfilePage = lazy(() => import('@pages/ProfilePage'))

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={null}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'profile',
        element: (
          <Suspense
            fallback={
              <main
                className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50
                               flex items-center justify-center p-4"
              >
                <PuppyCardSkeleton />
              </main>
            }
          >
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        index: true,
        element: (
          <Suspense fallback={null}>
            <LoginPage />
          </Suspense>
        ),
      },
    ],
  },
])

export const AppRouter = () => <RouterProvider router={router} />
