'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('system')
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        // Load theme from localStorage
        const stored = localStorage.getItem('theme') as Theme | null
        if (stored) {
            setThemeState(stored)
        }
    }, [])

    useEffect(() => {
        const root = window.document.documentElement

        // Remove previous theme classes
        root.classList.remove('light', 'dark')

        // Determine resolved theme
        let resolved: 'light' | 'dark'
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            resolved = systemTheme
        } else {
            resolved = theme
        }

        // Apply theme
        root.classList.add(resolved)
        setResolvedTheme(resolved)

        // Save to localStorage
        localStorage.setItem('theme', theme)
    }, [theme])

    // Listen for system theme changes
    useEffect(() => {
        if (theme !== 'system') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
            const systemTheme = mediaQuery.matches ? 'dark' : 'light'
            setResolvedTheme(systemTheme)
            window.document.documentElement.classList.remove('light', 'dark')
            window.document.documentElement.classList.add(systemTheme)
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
