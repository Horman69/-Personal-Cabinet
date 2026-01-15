'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface PasswordStrengthProps {
    password: string
    className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
    const strength = useMemo(() => {
        if (!password) return { level: 0, label: '', color: '' }

        let score = 0

        // Length check
        if (password.length >= 8) score++
        if (password.length >= 12) score++

        // Character variety
        if (/\d/.test(password)) score++
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++

        // Normalize to 1-4 scale
        const level = Math.min(Math.ceil(score / 1.25), 4)

        if (level === 1) return { level: 1, label: 'Слабый', color: 'text-error-600 dark:text-error-400' }
        if (level === 2) return { level: 2, label: 'Средний', color: 'text-warning-600 dark:text-warning-400' }
        if (level === 3) return { level: 3, label: 'Хороший', color: 'text-primary-600 dark:text-primary-400' }
        return { level: 4, label: 'Отличный', color: 'text-success-600 dark:text-success-400' }
    }, [password])

    if (!password) return null

    return (
        <div className={cn('space-y-1.5', className)}>
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">
                    Надежность пароля
                </span>
                <span className={cn('text-xs font-semibold', strength.color)}>
                    {strength.label}
                </span>
            </div>

            <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={cn(
                            'h-1.5 flex-1 rounded-full transition-all duration-300',
                            level <= strength.level
                                ? strength.level === 1
                                    ? 'bg-error-500'
                                    : strength.level === 2
                                        ? 'bg-warning-500'
                                        : strength.level === 3
                                            ? 'bg-primary-500'
                                            : 'bg-success-500'
                                : 'bg-neutral-200 dark:bg-neutral-700'
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
