import { AlertCircle } from 'lucide-react'
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
  const { logout } = useAuth()
  const { puppy, familyName, isLoading, isError, error, retry } = usePuppyProfile()

  return (
    <main className="min-h-screen bg-parchment p-4">
      {/* Header bar */}
      <header className="max-w-sm mx-auto flex items-center justify-end py-4 mb-6">
        <Button variant="ghost" size="sm" onClick={logout}>
          Sign out
        </Button>
      </header>

      {/* Card area */}
      <section aria-label="Puppy profile">
        {/* Loading state */}
        {isLoading && <PuppyCardSkeleton />}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="max-w-sm mx-auto bg-white rounded-card border border-hairline shadow-card p-8 text-center">
            <div className="flex justify-center mb-3 text-slate">
              <AlertCircle size={32} strokeWidth={1.5} aria-hidden="true" />
            </div>
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
