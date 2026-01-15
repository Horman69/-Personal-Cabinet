'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    /**
     * Error state - shows red border and error styling
     */
    error?: boolean

    /**
     * Additional CSS classes
     */
    className?: string
}

/**
 * Input Component
 * 
 * A styled input field with error state and smooth animations.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', error, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'w-full px-4 py-2.5 rounded-lg',
                    'bg-surface-primary text-neutral-900',
                    'border-2 border-border',
                    'placeholder:text-neutral-500 dark:placeholder:text-neutral-400',
                    'transition-all duration-200 ease-out',
                    'focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20',
                    'hover:border-border-hover',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)

Input.displayName = 'Input'
