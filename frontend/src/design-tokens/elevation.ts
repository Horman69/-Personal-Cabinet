/**
 * Design Tokens - Elevation System
 * Professional shadow system for depth and hierarchy
 */

/**
 * ELEVATION LEVELS
 * Subtle shadows for modern UI
 */
export const shadows = {
    // No shadow
    none: 'none',

    // Subtle elevation (cards, inputs)
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',

    // Default elevation (dropdowns, popovers)
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',

    // Higher elevation (modals, dialogs)
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

    // Inner shadow
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
} as const

/**
 * FOCUS RINGS
 * Accessibility-first focus indicators
 */
export const focusRings = {
    // Primary focus (default)
    primary: '0 0 0 3px rgba(59, 130, 246, 0.5)',

    // Semantic focus states
    success: '0 0 0 3px rgba(34, 197, 94, 0.5)',
    error: '0 0 0 3px rgba(239, 68, 68, 0.5)',
    warning: '0 0 0 3px rgba(245, 158, 11, 0.5)',

    // Offset (for dark backgrounds)
    'primary-offset': '0 0 0 2px #fff, 0 0 0 4px rgba(59, 130, 246, 0.5)',
} as const

/**
 * BORDER RADIUS
 * Consistent rounding scale
 */
export const borderRadius = {
    none: '0',
    sm: '0.25rem',     // 4px
    DEFAULT: '0.5rem', // 8px
    md: '0.5rem',      // 8px
    lg: '0.75rem',     // 12px
    xl: '1rem',        // 16px
    '2xl': '1.5rem',   // 24px
    '3xl': '2rem',     // 32px
    full: '9999px',
} as const
