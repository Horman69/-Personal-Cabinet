'use client'

import { type ReactNode } from 'react'
import { Label } from '../Label'
import { Input, type InputProps } from '../Input'
import { cn } from '@/lib/utils'

export interface FormFieldProps extends Omit<InputProps, 'id' | 'error'> {
    /**
     * Field label
     */
    label?: string

    /**
     * Field ID (auto-generated if not provided)
     */
    id?: string

    /**
     * Error state (for visual indication only, no text display)
     */
    error?: boolean

    /**
     * Helper text to display below input
     */
    helperText?: string

    /**
     * Required field indicator
     */
    required?: boolean

    /**
     * Additional CSS classes for wrapper
     */
    className?: string
}

/**
 * FormField Component
 * 
 * A complete form field with label, input, and optional helper text.
 * Errors are shown via Toast notifications, not inline.
 * 
 * @example
 * ```tsx
 * <FormField
 *   label="Email"
 *   type="email"
 *   helperText="We'll never share your email"
 *   required
 * />
 * ```
 */
export function FormField({
    label,
    id,
    error,
    helperText,
    required,
    className,
    ...inputProps
}: FormFieldProps) {
    const fieldId = id || `field-${label?.toLowerCase().replace(/\s+/g, '-')}`

    return (
        <div className={cn('w-full space-y-2', className)}>
            {label && (
                <Label htmlFor={fieldId} required={required}>
                    {label}
                </Label>
            )}

            <Input
                id={fieldId}
                error={error}
                aria-invalid={error}
                aria-describedby={helperText ? `${fieldId}-helper` : undefined}
                {...inputProps}
            />

            {helperText && (
                <p
                    id={`${fieldId}-helper`}
                    className="text-xs text-text-tertiary"
                >
                    {helperText}
                </p>
            )}
        </div>
    )
}
