'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastProps {
    id?: string
    variant?: 'success' | 'error' | 'warning' | 'info'
    title?: string
    message: string
    duration?: number
    onClose?: () => void
}

const variantConfig = {
    success: {
        icon: CheckCircle,
        className: 'bg-success-50 border-success-200 text-success-900 dark:bg-success-900/20 dark:border-success-800 dark:text-success-100',
        iconClassName: 'text-success-600 dark:text-success-400',
    },
    error: {
        icon: AlertCircle,
        className: 'bg-error-50 border-error-200 text-error-900 dark:bg-error-900/20 dark:border-error-800 dark:text-error-100',
        iconClassName: 'text-error-600 dark:text-error-400',
    },
    warning: {
        icon: AlertTriangle,
        className: 'bg-warning-50 border-warning-200 text-warning-900 dark:bg-warning-900/20 dark:border-warning-800 dark:text-warning-100',
        iconClassName: 'text-warning-600 dark:text-warning-400',
    },
    info: {
        icon: Info,
        className: 'bg-primary-50 border-primary-200 text-primary-900 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-100',
        iconClassName: 'text-primary-600 dark:text-primary-400',
    },
}

export function Toast({
    variant = 'info',
    title,
    message,
    onClose,
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)

    const config = variantConfig[variant]
    const Icon = config.icon

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => {
            setIsVisible(true)
        })
    }, [])

    const handleClose = () => {
        setIsLeaving(true)
        setTimeout(() => {
            onClose?.()
        }, 200) // Match animation duration
    }

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
                'min-w-[320px] max-w-md pointer-events-auto',
                'transition-all duration-200 ease-out',
                config.className,
                // Enter animation
                isVisible && !isLeaving && 'translate-y-0 opacity-100',
                !isVisible && '-translate-y-2 opacity-0',
                // Leave animation
                isLeaving && '-translate-y-2 opacity-0'
            )}
            role="alert"
            aria-live="polite"
        >
            {/* Icon */}
            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClassName)} />

            {/* Content */}
            <div className="flex-1 min-w-0">
                {title && (
                    <p className="font-semibold text-sm mb-1">
                        {title}
                    </p>
                )}
                <p className="text-sm">
                    {message}
                </p>
            </div>

            {/* Close Button */}
            <button
                onClick={handleClose}
                className={cn(
                    'flex-shrink-0 p-1 rounded-md transition-colors',
                    'hover:bg-black/5 dark:hover:bg-white/5',
                    'focus:outline-none focus:ring-2 focus:ring-offset-1',
                    variant === 'error' && 'focus:ring-error-500',
                    variant === 'success' && 'focus:ring-success-500',
                    variant === 'warning' && 'focus:ring-warning-500',
                    variant === 'info' && 'focus:ring-primary-500'
                )}
                aria-label="Закрыть"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}
