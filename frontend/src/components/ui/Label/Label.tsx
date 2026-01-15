'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface LabelProps {
    /**
     * Label text
     */
    children: ReactNode

    /**
     * Associated input ID
     */
    htmlFor?: string

    /**
     * Show required indicator
     */
    required?: boolean

    /**
     * Additional CSS classes
     */
    className?: string
}

/**
 * Label Component
 * 
 * Professional form label with optional required indicator
 */
export function Label({
    children,
    htmlFor,
    required,
    className,
}: LabelProps) {
    return (
        <label
            htmlFor={htmlFor}
            className={cn(
                'block text-sm font-semibold text-text-primary mb-1.5',
                className
            )}
        >
            {children}
            {required && (
                <span className="text-error-500 dark:text-error-400 ml-1" aria-label="required">
                    *
                </span>
            )}
        </label>
    )
}
