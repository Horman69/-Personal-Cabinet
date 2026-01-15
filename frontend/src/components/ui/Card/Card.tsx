import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps {
    /**
     * Card content
     */
    children: ReactNode

    /**
     * Additional CSS classes
     */
    className?: string

    /**
     * Card variant
     */
    variant?: 'default' | 'bordered' | 'elevated'

    /**
     * Make card clickable
     */
    onClick?: () => void
}

export interface CardHeaderProps {
    children: ReactNode
    className?: string
}

export interface CardTitleProps {
    children: ReactNode
    className?: string
}

export interface CardDescriptionProps {
    children: ReactNode
    className?: string
}

export interface CardContentProps {
    children: ReactNode
    className?: string
}

export interface CardFooterProps {
    children: ReactNode
    className?: string
}

/**
 * Card Component
 * 
 * Container component for content sections
 */
export function Card({ children, className, variant = 'default', onClick }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-xl bg-surface-primary transition-all duration-200',
                'border border-border/30',  // Softer borders - 30% opacity
                variant === 'bordered' && 'border-border/50',
                variant === 'elevated' && 'shadow-lg border-border/40',
                onClick && 'cursor-pointer hover:border-primary-500/50 hover:shadow-md',
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

/**
 * CardHeader Component
 */
export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={cn('p-6 pb-4', className)}>
            {children}
        </div>
    )
}

/**
 * CardTitle Component
 */
export function CardTitle({ children, className }: CardTitleProps) {
    return (
        <h3 className={cn('text-xl font-semibold text-text-primary', className)}>
            {children}
        </h3>
    )
}

/**
 * CardDescription Component
 */
export function CardDescription({ children, className }: CardDescriptionProps) {
    return (
        <p className={cn('text-sm text-text-secondary mt-1', className)}>
            {children}
        </p>
    )
}

/**
 * CardContent Component
 */
export function CardContent({ children, className }: CardContentProps) {
    return (
        <div className={cn('px-6 pb-6', className)}>
            {children}
        </div>
    )
}

/**
 * CardFooter Component
 */
export function CardFooter({ children, className }: CardFooterProps) {
    return (
        <div className={cn('px-6 pb-6 pt-4 flex items-center gap-3', className)}>
            {children}
        </div>
    )
}
