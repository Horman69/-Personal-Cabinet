import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps {
    /**
     * Badge content
     */
    children: ReactNode

    /**
     * Badge variant
     */
    variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral'

    /**
     * Badge size
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * Show as dot only
     */
    dot?: boolean

    /**
     * Additional CSS classes
     */
    className?: string
}

const variantClasses = {
    success: 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400',
    error: 'bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-400',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400',
    info: 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400',
    neutral: 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300',
}

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
}

const dotClasses = {
    success: 'bg-success-500',
    error: 'bg-error-500',
    warning: 'bg-warning-500',
    info: 'bg-primary-500',
    neutral: 'bg-neutral-500',
}

/**
 * Badge Component
 * 
 * Status indicators and labels
 */
export function Badge({
    children,
    variant = 'neutral',
    size = 'md',
    dot = false,
    className,
}: BadgeProps) {
    if (dot) {
        return (
            <span className={cn('inline-flex items-center gap-1.5', className)}>
                <span className={cn('w-2 h-2 rounded-full', dotClasses[variant])} />
                <span className="text-sm text-text-secondary">{children}</span>
            </span>
        )
    }

    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-full',
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
        >
            {children}
        </span>
    )
}
