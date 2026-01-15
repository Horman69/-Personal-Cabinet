'use client'

import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
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
 * PasswordInput Component
 * 
 * Password input with show/hide toggle and smooth animations
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ error, className, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false)

        return (
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    className={cn(
                        'w-full px-4 py-2.5 pr-12 rounded-lg',
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

                {/* Toggle Button */}
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors duration-200 focus:outline-none"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>
        )
    }
)

PasswordInput.displayName = 'PasswordInput'
