'use client'

import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
    /**
     * Whether modal is open
     */
    open: boolean

    /**
     * Callback when modal should close
     */
    onClose: () => void

    /**
     * Modal content
     */
    children: ReactNode

    /**
     * Additional CSS classes
     */
    className?: string

    /**
     * Size of modal
     */
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface ModalHeaderProps {
    children: ReactNode
    className?: string
}

export interface ModalTitleProps {
    children: ReactNode
    className?: string
}

export interface ModalContentProps {
    children: ReactNode
    className?: string
}

export interface ModalFooterProps {
    children: ReactNode
    className?: string
}

const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
}

/**
 * Modal Component
 * 
 * Accessible modal dialog with backdrop
 */
export function Modal({ open, onClose, children, className, size = 'md' }: ModalProps) {
    // Close on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [open, onClose])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [open])

    if (!open) return null

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className={cn(
                    'relative w-full bg-surface-primary rounded-xl shadow-2xl',
                    'border border-border/30',
                    'animate-in fade-in-0 zoom-in-95 duration-200',
                    sizeClasses[size],
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {children}
            </div>
        </div>,
        document.body
    )
}

/**
 * ModalHeader Component
 */
export function ModalHeader({ children, className }: ModalHeaderProps) {
    return (
        <div className={cn('p-6 pb-4', className)}>
            {children}
        </div>
    )
}

/**
 * ModalTitle Component
 */
export function ModalTitle({ children, className }: ModalTitleProps) {
    return (
        <h2 className={cn('text-2xl font-bold text-text-primary pr-8', className)}>
            {children}
        </h2>
    )
}

/**
 * ModalContent Component
 */
export function ModalContent({ children, className }: ModalContentProps) {
    return (
        <div className={cn('px-6 pb-6', className)}>
            {children}
        </div>
    )
}

/**
 * ModalFooter Component
 */
export function ModalFooter({ children, className }: ModalFooterProps) {
    return (
        <div className={cn('px-6 pb-6 pt-4 flex items-center justify-end gap-3', className)}>
            {children}
        </div>
    )
}
