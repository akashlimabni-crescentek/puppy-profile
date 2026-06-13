import { memo, useState } from 'react'
import { Dog } from 'lucide-react'

export interface AvatarProps {
  /** Image source URL, or null when the family has not added a photo yet */
  src: string | null
  /** Alt text / accessible name for the avatar — required */
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
 * Circular puppy photo with a tasteful Lucide line placeholder (on a
 * tan-light ground) when there is no photo or the image fails to load.
 * A null photo is the default visible state for the staging seed.
 *
 * @example
 * <Avatar src={puppy.photoUrl} alt={`Photo of ${puppy.name}`} size="lg" />
 */
export const Avatar = memo<AvatarProps>(({ src, alt, size = 'lg', className = '' }) => {
  const [hasError, setHasError] = useState(false)
  const showPlaceholder = !src || hasError

  return (
    <div
      className={`
        ${sizeClasses[size]} rounded-full overflow-hidden
        bg-tan-light ring-4 ring-cream shadow-card flex-shrink-0
        ${className}
      `}
    >
      {showPlaceholder ? (
        <div
          role="img"
          aria-label={alt}
          className="w-full h-full flex items-center justify-center bg-tan-light text-copper-dark"
        >
          <Dog aria-hidden="true" className="w-1/2 h-1/2" strokeWidth={1.5} />
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
