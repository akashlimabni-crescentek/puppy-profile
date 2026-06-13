import { memo } from 'react'
import { Skeleton } from '@atoms/Skeleton'

/**
 * Molecule: PuppyCardSkeleton
 * Animated loading state mirroring the PuppyProfileCard layout: a dark header
 * zone (avatar + name + status) over a cream content zone that leads with breed,
 * then the metric and two white inner blocks. Never a spinner.
 */
export const PuppyCardSkeleton = memo(() => (
  <div
    className="bg-cream rounded-card border border-hairline shadow-card overflow-hidden w-full max-w-sm mx-auto"
    aria-busy="true"
    aria-label="Loading puppy profile"
    role="status"
  >
    {/* Dark header zone — avatar + name + status */}
    <div className="flex flex-col items-center bg-ink px-6 pt-8 pb-7">
      <Skeleton circle width="w-28" height="h-28" />
      <Skeleton width="w-32" height="h-7" className="mt-4" />
      <Skeleton width="w-24" height="h-4" className="mt-2" />
    </div>

    {/* Cream content zone — breed + metric + two white inner blocks */}
    <div className="flex flex-col gap-3 bg-cream p-4">
      <div className="bg-white rounded-card border border-hairline p-4 flex justify-between">
        <Skeleton width="w-16" height="h-4" />
        <Skeleton width="w-32" height="h-4" />
      </div>
      <div className="bg-white rounded-card border border-hairline p-4">
        <Skeleton width="w-24" height="h-3" className="mb-2" />
        <Skeleton width="w-28" height="h-5" />
      </div>
      <div className="bg-white rounded-card border border-hairline p-4 flex justify-between">
        <Skeleton width="w-24" height="h-4" />
        <Skeleton width="w-28" height="h-4" />
      </div>
      <div className="bg-white rounded-card border border-hairline p-4">
        <Skeleton width="w-28" height="h-4" className="mb-2" />
        <Skeleton width="w-full" height="h-4" />
      </div>
    </div>
  </div>
))

PuppyCardSkeleton.displayName = 'PuppyCardSkeleton'
