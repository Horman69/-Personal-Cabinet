'use client'

import { useTheme } from './ThemeProvider'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background-secondary hover:bg-background-tertiary border border-border transition-colors"
            title={resolvedTheme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
        >
            {resolvedTheme === 'dark' ? (
                <>
                    <Sun className="w-4 h-4" />
                    <span className="text-sm font-medium">Светлая</span>
                </>
            ) : (
                <>
                    <Moon className="w-4 h-4" />
                    <span className="text-sm font-medium">Темная</span>
                </>
            )}
        </button>
    )
}
