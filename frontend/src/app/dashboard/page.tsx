'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Avatar,
    Badge,
    Button,
    Modal,
    ModalHeader,
    ModalTitle,
    ModalContent,
    ModalFooter,
} from '@/components/ui'
import { ThemeToggle } from '@/components/ThemeToggle'
import { profileApi } from '@/lib/profile'
import {
    User,
    Mail,
    Calendar,
    Shield,
    Edit,
    Key,
    LogOut,
    TrendingUp,
    Clock
} from 'lucide-react'

interface UserProfile {
    id: string
    email: string
    displayName?: string
    emailVerified: boolean
    createdAt: string
    avatarUrl?: string | null
    role?: string
}

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [logoutModalOpen, setLogoutModalOpen] = useState(false)

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                router.push('/login')
                return
            }

            const profile = await profileApi.getProfile()
            setUser(profile)
        } catch (error) {
            console.error('Failed to load profile:', error)
            router.push('/login')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        router.push('/login')
    }

    const getInitials = (displayName?: string, email?: string): string => {
        if (displayName) {
            const names = displayName.split(' ')
            if (names.length >= 2) {
                return `${names[0][0]}${names[1][0]}`.toUpperCase()
            }
            return displayName.substring(0, 2).toUpperCase()
        }
        return email ? email.substring(0, 2).toUpperCase() : '??'
    }

    const getAvatarUrl = (avatarUrl?: string | null): string | undefined => {
        if (!avatarUrl) return undefined
        if (avatarUrl.startsWith('http')) return avatarUrl
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        return `${API_URL}${avatarUrl}`
    }

    const getDaysSinceRegistration = (createdAt: string): number => {
        const created = new Date(createdAt)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - created.getTime())
        return Math.floor(diffTime / (1000 * 60 * 60 * 24))
    }

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <div className="text-text-secondary">Загрузка...</div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    const daysSinceRegistration = getDaysSinceRegistration(user.createdAt)

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Header */}
            <header className="border-b border-border bg-surface-primary">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
                    <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="space-y-6">
                    {/* Welcome Section */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-6">
                                <Avatar
                                    src={getAvatarUrl(user.avatarUrl)}
                                    fallback={getInitials(user.displayName, user.email)}
                                    alt={user.displayName || user.email}
                                    size="lg"
                                />
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold text-text-primary mb-2">
                                        👋 Добро пожаловать, {user.displayName || user.email}!
                                    </h2>
                                    <p className="text-text-secondary">
                                        Сегодня {formatDate(new Date().toISOString())}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Account Age */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary-500/10 rounded-lg">
                                        <Calendar className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-text-secondary mb-1">
                                            Аккаунт создан
                                        </p>
                                        <p className="text-2xl font-bold text-text-primary">
                                            {daysSinceRegistration} {daysSinceRegistration === 1 ? 'день' : 'дней'}
                                        </p>
                                        <p className="text-xs text-text-tertiary mt-1">
                                            {formatDate(user.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Email Status */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-success-500/10 rounded-lg">
                                        <Mail className="w-6 h-6 text-success-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-text-secondary mb-1">
                                            Email статус
                                        </p>
                                        <div className="mt-2">
                                            {user.emailVerified ? (
                                                <Badge variant="success">✓ Подтвержден</Badge>
                                            ) : (
                                                <Badge variant="warning">Не подтвержден</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-text-tertiary mt-2">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Role */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-secondary-500/10 rounded-lg">
                                        <Shield className="w-6 h-6 text-secondary-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-text-secondary mb-1">
                                            Роль
                                        </p>
                                        <div className="mt-2">
                                            <Badge variant="default">
                                                {user.role || 'USER'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-text-tertiary mt-2">
                                            Стандартный доступ
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>⚡ Быстрые действия</CardTitle>
                            <CardDescription>
                                Часто используемые функции
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className={`grid grid-cols-1 ${(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'} gap-4`}>
                                {/* Admin Panel - Only for admins */}
                                {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                                    <button
                                        onClick={() => router.push('/admin')}
                                        className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-2 border-primary-500/30 hover:border-primary-500/60 hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300"
                                    >
                                        <div className="flex flex-col items-center text-center gap-3">
                                            <div className="w-14 h-14 rounded-full bg-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Shield className="w-7 h-7 text-primary-500" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-text-primary text-lg">Admin Panel</div>
                                                <div className="text-xs text-text-secondary mt-1">
                                                    Управление системой
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                )}

                                {/* Edit Profile */}
                                <button
                                    onClick={() => router.push('/profile')}
                                    className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-2 border-blue-500/30 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                                >
                                    <div className="flex flex-col items-center text-center gap-3">
                                        <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Edit className="w-7 h-7 text-blue-500" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-text-primary text-lg">Редактировать профиль</div>
                                            <div className="text-xs text-text-secondary mt-1">
                                                Изменить данные
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {/* Change Password */}
                                <button
                                    onClick={() => router.push('/profile')}
                                    className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-2 border-amber-500/30 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
                                >
                                    <div className="flex flex-col items-center text-center gap-3">
                                        <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Key className="w-7 h-7 text-amber-500" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-text-primary text-lg">Сменить пароль</div>
                                            <div className="text-xs text-text-secondary mt-1">
                                                Безопасность
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {/* Logout */}
                                <button
                                    onClick={() => setLogoutModalOpen(true)}
                                    className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-error-500/10 to-error-600/5 border-2 border-error-500/30 hover:border-error-500/60 hover:shadow-lg hover:shadow-error-500/20 transition-all duration-300"
                                >
                                    <div className="flex flex-col items-center text-center gap-3">
                                        <div className="w-14 h-14 rounded-full bg-error-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <LogOut className="w-7 h-7 text-error-500" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-text-primary text-lg">Выйти</div>
                                            <div className="text-xs text-text-secondary mt-1">
                                                Завершить сеанс
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Logout Confirmation Modal */}
            <Modal open={logoutModalOpen} onClose={() => setLogoutModalOpen(false)}>
                <ModalHeader>
                    <ModalTitle>Подтверждение выхода</ModalTitle>
                </ModalHeader>
                <ModalContent>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-warning-500/10 rounded-full">
                            <LogOut className="w-6 h-6 text-warning-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-text-primary font-medium mb-2">
                                Вы уверены, что хотите выйти?
                            </p>
                            <p className="text-sm text-text-secondary">
                                Вам нужно будет войти снова, чтобы получить доступ к вашему аккаунту.
                            </p>
                        </div>
                    </div>
                </ModalContent>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setLogoutModalOpen(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleLogout}>
                        Да, выйти
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
