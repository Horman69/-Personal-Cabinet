'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { ThemeToggle } from '../ThemeToggle'

export interface AuthLayoutProps {
    /**
     * Page title
     */
    title: string

    /**
     * Subtitle/description
     */
    subtitle?: string | ReactNode

    /**
     * Show back to home link
     */
    showBackLink?: boolean

    /**
     * Form content
     */
    children: ReactNode
}

/**
 * AuthLayout Component
 * 
 * Professional layout for all authentication pages
 */
export function AuthLayout({
    title,
    subtitle,
    showBackLink = true,
    children,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary px-4 py-12 relative overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-500/5 pointer-events-none" />

            {/* Theme Toggle - Fixed Position */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Card */}
                <div className="bg-surface-primary rounded-2xl shadow-xl border border-border/50 p-8 sm:p-10 backdrop-blur-sm relative">
                    {/* Close Button - Inside Card */}
                    {showBackLink && (
                        <Link
                            href="/"
                            className="absolute top-5 left-5 inline-flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-all"
                            aria-label="Закрыть"
                        >
                            <X className="w-6 h-6" strokeWidth={2.5} />
                        </Link>
                    )}

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3 tracking-tight">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-base text-text-secondary leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>
    )
}
