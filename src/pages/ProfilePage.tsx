import { useNavigate } from 'react-router-dom'
import { PuppyProfileCard } from '@organisms/PuppyProfileCard'
import { PuppyCardSkeleton } from '@molecules/PuppyCardSkeleton'
import { Button } from '@atoms/Button'
import { Typography } from '@atoms/Typography'
import { CardErrorBoundary } from '@errors/CardErrorBoundary'
import { useAuth } from '@hooks/useAuth'
import { usePuppyProfile } from '@hooks/usePuppyProfile'

/**
 * Page: ProfilePage
 * Protected — only reachable when authenticated.
 * Fetches puppy data via usePuppyProfile (which dispatches to the saga).
 * Renders skeleton while loading, error state on failure, card on success.
 */
const ProfilePage = () => {
  const { user, logout } = useAuth()
  const { puppy, familyName, isLoading, isError, error, retry } = usePuppyProfile()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 p-4">
      {/* Header bar */}
      <header className="max-w-sm mx-auto flex items-center justify-between py-4 mb-6">
        <Typography variant="label" color="secondary">
          {user?.email}
        </Typography>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Sign out
        </Button>
      </header>

      {/* Card area */}
      <section aria-label="Puppy profile">
        {/* Loading state */}
        {isLoading && <PuppyCardSkeleton />}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-card p-8 text-center">
            <div className="text-4xl mb-3">😔</div>
            <Typography variant="h4" color="primary" className="mb-2">
              Could not load profile
            </Typography>
            <Typography variant="bodySmall" color="secondary" className="mb-4">
              {error?.message ?? 'An unexpected error occurred'}
            </Typography>
            <Button variant="primary" size="sm" onClick={retry}>
              Try again
            </Button>
          </div>
        )}

        {/* Success state — wrapped in CardErrorBoundary as a safety net */}
        {puppy && !isLoading && (
          <CardErrorBoundary fallbackMessage="Unable to display puppy profile">
            <PuppyProfileCard puppy={puppy} familyName={familyName} />
          </CardErrorBoundary>
        )}
      </section>
    </main>
  )
}

export default ProfilePage
