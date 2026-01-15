'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
    className?: string
    variant?: 'text' | 'circular' | 'rectangular'
}

/**
 * Skeleton Component
 * 
 * Loading placeholder with shimmer animation
 */
export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse bg-gradient-to-r from-surface-secondary via-surface-tertiary to-surface-secondary',
                'bg-[length:200%_100%]',
                variant === 'text' && 'h-4 rounded',
                variant === 'circular' && 'rounded-full',
                variant === 'rectangular' && 'rounded-lg',
                className
            )}
            style={{
                animation: 'shimmer 2s infinite',
            }}
        />
    )
}

/**
 * ProfileSkeleton Component
 * 
 * Loading skeleton for profile page
 */
export function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center gap-6 p-6 bg-surface-primary rounded-xl border border-border/30">
                <Skeleton variant="circular" className="w-24 h-24" />
                <div className="flex-1 space-y-3">
                    <Skeleton variant="text" className="w-48 h-6" />
                    <Skeleton variant="text" className="w-64 h-4" />
                    <Skeleton variant="text" className="w-32 h-4" />
                </div>
            </div>

            {/* Cards Skeleton */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 bg-surface-primary rounded-xl border border-border/30 space-y-4">
                    <Skeleton variant="text" className="w-40 h-6" />
                    <Skeleton variant="text" className="w-full h-4" />
                    <Skeleton variant="text" className="w-3/4 h-4" />
                </div>
            ))}
        </div>
    )
}

// Add shimmer keyframes to globals.css
