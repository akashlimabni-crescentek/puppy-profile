import { memo } from 'react'
import { Skeleton } from '@atoms/Skeleton'

/**
 * Molecule: PuppyCardSkeleton
 * Animated loading state that mirrors the PuppyProfileCard layout exactly.
 * Shown while puppy data is fetching — pixel-matched to the real card.
 * Never use a spinner for this state — skeleton screens have better perceived performance.
 */
export const PuppyCardSkeleton = memo(() => (
  <div
    className="bg-white rounded-3xl shadow-card overflow-hidden w-full max-w-sm mx-auto"
    aria-busy="true"
    aria-label="Loading puppy profile"
    role="status"
  >
    {/* Header banner — matches card gradient header */}
    <div className="bg-gradient-to-br from-primary-100 to-accent-100 h-24" />

    {/* Avatar + badges row */}
    <div className="px-6 -mt-12 flex justify-between items-end">
      <Skeleton circle width="w-24" height="h-24" />
      <div className="flex gap-2 pb-2">
        <Skeleton width="w-16" height="h-6" />
        <Skeleton width="w-16" height="h-6" />
      </div>
    </div>

    {/* Name + breed */}
    <div className="px-6 pt-4 pb-2">
      <Skeleton width="w-40" height="h-7" className="mb-2" />
      <Skeleton width="w-28" height="h-5" />
    </div>

    {/* Stat chips row */}
    <div className="px-6 py-4 flex gap-3">
      <Skeleton width="w-20" height="h-16" className="rounded-2xl" />
      <Skeleton width="w-20" height="h-16" className="rounded-2xl" />
      <Skeleton width="w-20" height="h-16" className="rounded-2xl" />
    </div>

    {/* Info rows */}
    <div className="px-6 pb-6 flex flex-col gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between items-center py-1">
          <Skeleton width="w-24" height="h-4" />
          <Skeleton width="w-32" height="h-4" />
        </div>
      ))}
    </div>
  </div>
))

PuppyCardSkeleton.displayName = 'PuppyCardSkeleton'
