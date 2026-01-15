import { type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    /**
     * Image source URL
     */
    src?: string | null

    /**
     * Fallback text (usually initials)
     */
    fallback?: string

    /**
     * Alt text
     */
    alt?: string

    /**
     * Avatar size
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'

    /**
     * Additional CSS classes
     */
    className?: string
}

const sizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
}

/**
 * Avatar Component
 * 
 * User profile picture with fallback to initials
 */
export function Avatar({
    src,
    fallback,
    alt = 'Avatar',
    size = 'md',
    className,
    ...props
}: AvatarProps) {
    const hasImage = src && src.trim() !== ''

    if (hasImage) {
        return (
            <img
                src={src}
                alt={alt}
                className={cn(
                    'rounded-full object-cover',
                    sizeClasses[size],
                    className
                )}
                {...props}
            />
        )
    }

    // Fallback to initials
    return (
        <div
            className={cn(
                'rounded-full bg-primary-500 text-white font-semibold flex items-center justify-center',
                sizeClasses[size],
                className
            )}
        >
            {fallback || '?'}
        </div>
    )
}
