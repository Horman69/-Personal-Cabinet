import type { Config } from 'tailwindcss'

/**
 * Professional Tailwind Configuration
 * Following industry best practices
 * Inspired by: Stripe, Linear, Vercel
 */
const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],

    darkMode: 'class',

    theme: {
        extend: {
            // COLORS - Using semantic naming
            colors: {
                // Primary brand color
                primary: {
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

                // Neutral - the workhorse
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
                success: {
                    50: '#F0FDF4',
                    500: '#22C55E',
                    600: '#16A34A',
                    700: '#15803D',
                },

                error: {
                    50: '#FEF2F2',
                    500: '#EF4444',
                    600: '#DC2626',
                    700: '#B91C1C',
                },

                warning: {
                    50: '#FFFBEB',
                    500: '#F59E0B',
                    700: '#B45309',
                },

                // Theme-aware semantic tokens
                background: {
                    primary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
                    secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
                    tertiary: 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
                    inverse: 'rgb(var(--color-bg-inverse) / <alpha-value>)',
                },

                text: {
                    primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
                    secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
                    tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
                    inverse: 'rgb(var(--color-text-inverse) / <alpha-value>)',
                    link: 'rgb(var(--color-text-link) / <alpha-value>)',
                },

                border: {
                    DEFAULT: 'rgb(var(--color-border-default) / <alpha-value>)',
                    hover: 'rgb(var(--color-border-hover) / <alpha-value>)',
                    focus: 'rgb(var(--color-border-focus) / <alpha-value>)',
                },

                surface: {
                    primary: 'rgb(var(--color-surface-primary) / <alpha-value>)',
                    secondary: 'rgb(var(--color-surface-secondary) / <alpha-value>)',
                    tertiary: 'rgb(var(--color-surface-tertiary) / <alpha-value>)',
                },
            },

            // TYPOGRAPHY
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
            },

            fontSize: {
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
            },

            fontWeight: {
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
            },

            // SPACING - 4px base grid
            spacing: {
                px: '1px',
                0: '0',
                0.5: '0.125rem',
                1: '0.25rem',
                1.5: '0.375rem',
                2: '0.5rem',
                2.5: '0.625rem',
                3: '0.75rem',
                3.5: '0.875rem',
                4: '1rem',
                5: '1.25rem',
                6: '1.5rem',
                7: '1.75rem',
                8: '2rem',
                9: '2.25rem',
                10: '2.5rem',
                11: '2.75rem',
                12: '3rem',
                14: '3.5rem',
                16: '4rem',
                20: '5rem',
                24: '6rem',
                28: '7rem',
                32: '8rem',
                36: '9rem',
                40: '10rem',
                44: '11rem',
                48: '12rem',
                52: '13rem',
                56: '14rem',
                60: '15rem',
                64: '16rem',
                72: '18rem',
                80: '20rem',
                96: '24rem',
            },

            // BORDER RADIUS
            borderRadius: {
                none: '0',
                sm: '0.25rem',
                DEFAULT: '0.5rem',
                md: '0.5rem',
                lg: '0.75rem',
                xl: '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
                full: '9999px',
            },

            // SHADOWS - Subtle elevation
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
                none: '0 0 #0000',

                // Focus rings
                'focus-primary': '0 0 0 3px rgba(59, 130, 246, 0.5)',
                'focus-error': '0 0 0 3px rgba(239, 68, 68, 0.5)',
                'focus-success': '0 0 0 3px rgba(34, 197, 94, 0.5)',
            },

            // ANIMATIONS
            animation: {
                'fade-in': 'fadeIn 200ms ease-in-out',
                'fade-out': 'fadeOut 200ms ease-in-out',
                'slide-up': 'slideUp 200ms ease-out',
                'slide-down': 'slideDown 200ms ease-out',
                'scale-in': 'scaleIn 200ms ease-out',
                'scale-out': 'scaleOut 200ms ease-out',
            },

            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                scaleOut: {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '100%': { transform: 'scale(0.95)', opacity: '0' },
                },
            },
        },
    },

    plugins: [],
}

export default config
