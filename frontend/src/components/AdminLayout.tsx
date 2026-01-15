'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/Button/Button'
import { AdminGuard } from '@/components/AdminGuard'

interface AdminLayoutProps {
    children: ReactNode
}

const navigation = [
    { name: 'Панель управления', href: '/admin', icon: LayoutDashboard },
    { name: 'Пользователи', href: '/admin/users', icon: Users },
    { name: 'Журнал действий', href: '/admin/logs', icon: FileText },
    { name: 'Настройки', href: '/admin/settings', icon: Settings },
]

export function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        router.push('/login')
    }

    return (
        <AdminGuard>
            <div className="min-h-screen bg-bg-primary flex">
                {/* Sidebar */}
                <aside className="w-64 bg-surface-primary border-r border-border flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-border">
                        <h1 className="text-xl font-bold text-text-primary">Админ Панель</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${isActive
                                            ? 'bg-primary-500 text-white'
                                            : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                                        }
                  `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-border space-y-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => router.push('/dashboard')}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Вернуться на Dashboard
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Выйти
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="bg-surface-primary border-b border-border px-6 py-4 flex items-center justify-between">
                        <div className="text-sm text-text-tertiary">
                            Панель администратора
                        </div>
                        <ThemeToggle />
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 p-6 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AdminGuard>
    )
}
