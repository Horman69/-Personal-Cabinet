import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Button Variants using CVA (Class Variance Authority)
 */
export const buttonVariants = cva(
    // Base styles
    [
        'inline-flex items-center justify-center gap-2',
        'font-semibold rounded-lg',
        'transition-all duration-200 ease-out',
        'transform-gpu', // GPU acceleration
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        // Hover animations
        'hover:scale-[1.02]',
        'active:scale-[0.98]',
    ],
    {
        variants: {
            variant: {
                primary: [
                    'bg-blue-600 text-white',
                    'hover:bg-blue-700 active:bg-blue-800',
                    'dark:bg-blue-500 dark:hover:bg-blue-600',
                    'focus:ring-blue-500',
                    'shadow-sm hover:shadow-md',
                    'hover:shadow-blue-500/50',
                ],
                secondary: [
                    'bg-neutral-100 text-neutral-900',
                    'hover:bg-neutral-200 active:bg-neutral-300',
                    'dark:bg-neutral-800 dark:text-neutral-100',
                    'dark:hover:bg-neutral-700 dark:active:bg-neutral-600',
                    'focus:ring-neutral-500',
                    'hover:shadow-sm',
                ],
                outline: [
                    'border-2 border-neutral-300 bg-transparent text-neutral-900',
                    'hover:bg-neutral-50 hover:border-neutral-400',
                    'dark:border-neutral-700 dark:text-neutral-300',
                    'dark:hover:bg-neutral-800 dark:hover:border-neutral-600',
                    'focus:ring-blue-500',
                ],
                ghost: [
                    'bg-transparent text-black',
                    'hover:bg-neutral-100',
                    'dark:text-neutral-300 dark:hover:bg-neutral-800',
                    'focus:ring-blue-500',
                ],
                danger: [
                    'bg-red-600 text-white',
                    'hover:bg-red-700 active:bg-red-800',
                    'focus:ring-red-500',
                    'shadow-sm hover:shadow-md',
                    'hover:shadow-red-500/50',
                ],
            },
            size: {
                sm: 'px-3 py-1.5 text-sm',
                md: 'px-4 py-2.5 text-base',
                lg: 'px-6 py-3 text-lg',
            },
            fullWidth: {
                true: 'w-full',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
