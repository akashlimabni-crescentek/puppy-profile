import { memo, useState } from 'react'

export interface AvatarProps {
  /** Image source URL */
  src: string
  /** Alt text for the image — required for accessibility */
  alt: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Additional Tailwind classes */
  className?: string
}

const sizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-28 h-28',
  xl: 'w-36 h-36',
}

/**
 * Atom: Avatar
 * Circular image with paw emoji fallback on load error.
 * Used for puppy photos in the profile card.
 */
export const Avatar = memo<AvatarProps>(({ src, alt, size = 'lg', className = '' }) => {
  const [hasError, setHasError] = useState(false)

  return (
    <div
      className={`
        ${sizeClasses[size]} rounded-full overflow-hidden
        bg-neutral-100 ring-4 ring-white shadow-card flex-shrink-0
        ${className}
      `}
    >
      {hasError ? (
        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-2xl">
          🐾
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'
