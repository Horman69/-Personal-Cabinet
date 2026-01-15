'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from './Button.variants'

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
    /**
     * Loading state - shows spinner and disables button
     */
    loading?: boolean

    /**
     * Icon to display on the left side
     */
    leftIcon?: ReactNode

    /**
     * Icon to display on the right side
     */
    rightIcon?: ReactNode

    /**
     * Additional CSS classes
     */
    className?: string

    /**
     * Button content
     */
    children?: ReactNode
}

/**
 * Button Component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 * 
 * <Button variant="outline" leftIcon={<Icon />} loading>
 *   Loading...
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant,
            size,
            fullWidth,
            loading = false,
            disabled = false,
            leftIcon,
            rightIcon,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || loading

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={cn(buttonVariants({ variant, size, fullWidth }), className)}
                {...props}
            >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {!loading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
                {children}
                {!loading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
            </button>
        )
    }
)

Button.displayName = 'Button'
