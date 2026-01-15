/**
 * Design Tokens - Typography System
 * Type scale following 8pt grid and modular scale
 */

/**
 * FONT FAMILIES
 */
export const fontFamilies = {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
} as const

/**
 * FONT WEIGHTS
 * Limited set for consistency
 */
export const fontWeights = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
} as const

/**
 * TYPE SCALE
 * Following modular scale (1.25 ratio)
 * Base: 16px (1rem)
 */
export const typeScale = {
    // Display - only for marketing/landing
    display: {
        fontSize: '3.75rem',      // 60px
        lineHeight: '1.1',
        letterSpacing: '-0.02em',
        fontWeight: fontWeights.bold,
    },

    // Headings
    h1: {
        fontSize: '2.25rem',      // 36px
        lineHeight: '1.2',
        letterSpacing: '-0.01em',
        fontWeight: fontWeights.bold,
    },

    h2: {
        fontSize: '1.875rem',     // 30px
        lineHeight: '1.3',
        letterSpacing: '-0.01em',
        fontWeight: fontWeights.semibold,
    },

    h3: {
        fontSize: '1.5rem',       // 24px
        lineHeight: '1.4',
        fontWeight: fontWeights.semibold,
    },

    h4: {
        fontSize: '1.25rem',      // 20px
        lineHeight: '1.4',
        fontWeight: fontWeights.semibold,
    },

    // Body text
    'body-lg': {
        fontSize: '1.125rem',     // 18px
        lineHeight: '1.6',
        fontWeight: fontWeights.normal,
    },

    'body-md': {
        fontSize: '1rem',         // 16px - DEFAULT
        lineHeight: '1.5',
        fontWeight: fontWeights.normal,
    },

    'body-sm': {
        fontSize: '0.875rem',     // 14px
        lineHeight: '1.5',
        fontWeight: fontWeights.normal,
    },

    // UI elements
    caption: {
        fontSize: '0.75rem',      // 12px
        lineHeight: '1.4',
        letterSpacing: '0.01em',
        fontWeight: fontWeights.medium,
    },

    overline: {
        fontSize: '0.75rem',      // 12px
        lineHeight: '1.4',
        letterSpacing: '0.08em',
        fontWeight: fontWeights.semibold,
        textTransform: 'uppercase' as const,
    },
} as const

/**
 * TAILWIND FONT SIZE CONFIG
 * Maps to Tailwind's fontSize theme
 */
export const tailwindFontSizes = {
    xs: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
    sm: ['0.875rem', { lineHeight: '1.5' }],
    base: ['1rem', { lineHeight: '1.5' }],
    lg: ['1.125rem', { lineHeight: '1.6' }],
    xl: ['1.25rem', { lineHeight: '1.4' }],
    '2xl': ['1.5rem', { lineHeight: '1.4' }],
    '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
    '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
    '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
    '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
} as const
