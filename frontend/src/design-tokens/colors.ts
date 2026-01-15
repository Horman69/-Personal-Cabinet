/**
 * Design Tokens - Color System
 * Following industry best practices for token architecture
 * Inspired by: Stripe, Linear, Vercel
 */

/**
 * PRIMITIVE COLORS (Base palette)
 * These are the raw color values - never use directly in components
 */
export const primitiveColors = {
    // Blue - Primary brand
    blue: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        300: '#93C5FD',
        400: '#60A5FA',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
        800: '#1E40AF',
        900: '#1E3A8A',
    },

    // Neutral - Foundation
    neutral: {
        0: '#FFFFFF',
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
        950: '#030712',
    },

    // Semantic colors
    green: {
        50: '#F0FDF4',
        500: '#22C55E',
        600: '#16A34A',
        700: '#15803D',
    },

    red: {
        50: '#FEF2F2',
        500: '#EF4444',
        600: '#DC2626',
        700: '#B91C1C',
    },

    amber: {
        50: '#FFFBEB',
        500: '#F59E0B',
        700: '#B45309',
    },
} as const

/**
 * SEMANTIC TOKENS (What designers actually use)
 * Map primitive colors to semantic meaning
 */
export const semanticColors = {
    // Brand/Primary - main actions, links, focus states
    primary: primitiveColors.blue,

    // Semantic states
    success: primitiveColors.green,
    error: primitiveColors.red,
    warning: primitiveColors.amber,
    info: primitiveColors.blue,

    // Neutral - the workhorse (90% of UI)
    neutral: primitiveColors.neutral,
} as const

/**
 * THEME TOKENS (Light/Dark specific)
 * These are what components actually consume
 */
export const lightTheme = {
    background: {
        primary: primitiveColors.neutral[0],      // #FFFFFF
        secondary: primitiveColors.neutral[50],   // #F9FAFB
        tertiary: primitiveColors.neutral[100],   // #F3F4F6
        inverse: primitiveColors.neutral[900],    // #111827
    },

    text: {
        primary: primitiveColors.neutral[900],    // #111827
        secondary: primitiveColors.neutral[600],  // #4B5563
        tertiary: primitiveColors.neutral[400],   // #9CA3AF
        inverse: primitiveColors.neutral[0],      // #FFFFFF
        link: primitiveColors.blue[600],          // #2563EB
    },

    border: {
        default: primitiveColors.neutral[200],    // #E5E7EB
        hover: primitiveColors.neutral[300],      // #D1D5DB
        focus: primitiveColors.blue[500],         // #3B82F6
    },

    surface: {
        primary: primitiveColors.neutral[0],      // Cards, modals
        secondary: primitiveColors.neutral[50],   // Subtle backgrounds
        tertiary: primitiveColors.neutral[100],   // Disabled states
    },
} as const

export const darkTheme = {
    background: {
        primary: primitiveColors.neutral[950],    // #030712
        secondary: primitiveColors.neutral[900],  // #111827
        tertiary: primitiveColors.neutral[800],   // #1F2937
        inverse: primitiveColors.neutral[0],      // #FFFFFF
    },

    text: {
        primary: primitiveColors.neutral[50],     // #F9FAFB
        secondary: primitiveColors.neutral[400],  // #9CA3AF
        tertiary: primitiveColors.neutral[600],   // #4B5563
        inverse: primitiveColors.neutral[900],    // #111827
        link: primitiveColors.blue[400],          // #60A5FA
    },

    border: {
        default: primitiveColors.neutral[800],    // #1F2937
        hover: primitiveColors.neutral[700],      // #374151
        focus: primitiveColors.blue[500],         // #3B82F6
    },

    surface: {
        primary: primitiveColors.neutral[900],    // Cards, modals
        secondary: primitiveColors.neutral[800],  // Subtle backgrounds
        tertiary: primitiveColors.neutral[700],   // Disabled states
    },
} as const

/**
 * CSS VARIABLE MAPPING
 * For use in Tailwind config and CSS
 */
export const cssVariables = {
    light: {
        '--color-bg-primary': '255 255 255',
        '--color-bg-secondary': '249 250 251',
        '--color-bg-tertiary': '243 244 246',
        '--color-bg-inverse': '17 24 39',

        '--color-text-primary': '17 24 39',
        '--color-text-secondary': '75 85 99',
        '--color-text-tertiary': '156 163 175',
        '--color-text-inverse': '255 255 255',
        '--color-text-link': '37 99 235',

        '--color-border-default': '229 231 235',
        '--color-border-hover': '209 213 219',
        '--color-border-focus': '59 130 246',

        '--color-surface-primary': '255 255 255',
        '--color-surface-secondary': '249 250 251',
        '--color-surface-tertiary': '243 244 246',
    },

    dark: {
        '--color-bg-primary': '3 7 18',
        '--color-bg-secondary': '17 24 39',
        '--color-bg-tertiary': '31 41 55',
        '--color-bg-inverse': '255 255 255',

        '--color-text-primary': '249 250 251',
        '--color-text-secondary': '156 163 175',
        '--color-text-tertiary': '75 85 99',
        '--color-text-inverse': '17 24 39',
        '--color-text-link': '96 165 250',

        '--color-border-default': '31 41 55',
        '--color-border-hover': '55 65 81',
        '--color-border-focus': '59 130 246',

        '--color-surface-primary': '17 24 39',
        '--color-surface-secondary': '31 41 55',
        '--color-surface-tertiary': '55 65 81',
    },
} as const
