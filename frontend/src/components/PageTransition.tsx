'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'

interface PageTransitionProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode
}

/**
 * PageTransition Component
 * 
 * Wraps page content with smooth fade + slide animations
 */
export function PageTransition({ children, ...props }: PageTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1], // cubic-bezier easing
            }}
            {...props}
        >
            {children}
        </motion.div>
    )
}
