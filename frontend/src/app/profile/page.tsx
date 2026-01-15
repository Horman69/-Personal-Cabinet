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
    FormField,
    PasswordInput,
} from '@/components/ui'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AvatarUpload } from '@/components/AvatarUpload'
import { useToast } from '@/components/ToastProvider'
import { profileApi } from '@/lib/profile'
import { Mail, User, Calendar, Shield, LogOut, Edit, Key, Trash2, AlertTriangle, ArrowLeft } from 'lucide-react'

interface UserProfile {
    id: string
    email: string
    displayName?: string
    emailVerified: boolean
    createdAt: string
    avatarUrl?: string | null
}

export default function ProfilePage() {
    const router = useRouter()
    const { showToast } = useToast()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    // Modal states
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [passwordModalOpen, setPasswordModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [logoutModalOpen, setLogoutModalOpen] = useState(false)

    // Form states
    const [displayName, setDisplayName] = useState('')
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [submitting, setSubmitting] = useState(false)

    const getAvatarUrl = (avatarUrl?: string | null): string | undefined => {
        if (!avatarUrl) return undefined
        // If already full URL, return as is
        if (avatarUrl.startsWith('http')) return avatarUrl
        // Convert relative URL to backend URL
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        return `${API_URL}${avatarUrl}`
    }

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            router.push('/login')
            return
        }

        try {
            const data = await profileApi.getProfile()
            setUser(data)
            setDisplayName(data.displayName || '')
        } catch (error) {
            showToast({
                variant: 'error',
                title: 'Ошибка',
                message: 'Не удалось загрузить профиль',
                duration: 3000,
            })
            router.push('/login')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async () => {
        setSubmitting(true)
        try {
            const updated = await profileApi.updateProfile({ displayName })
            setUser(updated)
            setEditModalOpen(false)
            showToast({
                variant: 'success',
                title: 'Успешно!',
                message: 'Профиль обновлен',
                duration: 2000,
            })
        } catch (error: any) {
            showToast({
                variant: 'error',
                title: 'Ошибка',
                message: error.response?.data?.message || 'Не удалось обновить профиль',
                duration: 3000,
            })
        } finally {
            setSubmitting(false)
        }
    }

    const handleChangePassword = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            showToast({
                variant: 'error',
                title: 'Ошибка',
                message: 'Пароли не совпадают',
                duration: 3000,
            })
            return
        }

        if (passwords.newPassword.length < 8) {
            showToast({
                variant: 'error',
                title: 'Ошибка',
                message: 'Пароль должен быть минимум 8 символов',
                duration: 3000,
            })
            return
        }

        setSubmitting(true)
        try {
            await profileApi.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            })
            setPasswordModalOpen(false)
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
            showToast({
                variant: 'success',
                title: 'Успешно!',
                message: 'Пароль изменен',
                duration: 2000,
            })
        } catch (error: any) {
            showToast({
                variant: 'error',
                title: 'Ошибка',
                message: error.response?.data?.message || 'Не удалось изменить пароль',
                duration: 3000,
            })
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteAccount = async () => {
        setSubmitting(true)
        try {
            await profileApi.deleteAccount()
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            showToast({
                variant: 'success',
                title: 'Аккаунт удален',
                message: 'До свидания!',
                duration: 2000,
            })
            setTimeout(() => router.push('/'), 500)
        } catch (error: any) {
            showToast({
                variant: 'error',
                title: 'Ошибка',
                message: error.response?.data?.message || 'Не удалось удалить аккаунт',
                duration: 3000,
            })
            setSubmitting(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        showToast({
            variant: 'success',
            title: 'Выход выполнен',
            message: 'До скорой встречи!',
            duration: 2000,
        })
        setTimeout(() => router.push('/login'), 500)
    }

    const getInitials = (name?: string, email?: string) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        }
        if (email) {
            return email[0].toUpperCase()
        }
        return '?'
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-text-secondary">Загрузка...</div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Header */}
            <header className="bg-surface-primary border-b border-border shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-10 h-10 rounded-full bg-surface-secondary hover:bg-surface-tertiary border border-border flex items-center justify-center transition-colors"
                            aria-label="Назад"
                        >
                            <ArrowLeft className="w-5 h-5 text-text-primary" />
                        </button>
                        <h1 className="text-2xl font-bold text-text-primary">Личный кабинет</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Button variant="ghost" size="sm" onClick={() => setLogoutModalOpen(true)}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Выйти
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="space-y-6">
                    {/* User Info Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-center gap-3">
                                    <Avatar
                                        src={getAvatarUrl(user.avatarUrl)}
                                        fallback={getInitials(user.displayName, user.email)}
                                        alt={user.displayName || user.email}
                                        size="xl"
                                    />
                                    <AvatarUpload
                                        currentAvatar={user.avatarUrl}
                                        onAvatarUpdate={(newAvatarUrl) => {
                                            setUser({ ...user, avatarUrl: newAvatarUrl })
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-text-primary mb-1">
                                        {user.displayName || user.email}
                                    </h2>
                                    <p className="text-text-secondary mb-3">{user.email}</p>
                                    <div className="flex items-center gap-2">
                                        {user.emailVerified && (
                                            <Badge variant="success" size="sm">✓ Verified</Badge>
                                        )}
                                    </div>
                                </div>
                                <Button variant="primary" onClick={() => setEditModalOpen(true)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Редактировать
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Информация об аккаунте</CardTitle>
                            <CardDescription>Основные данные вашего профиля</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-text-tertiary" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-text-secondary">Email</p>
                                        <p className="text-base text-text-primary">{user.email}</p>
                                    </div>
                                </div>
                                {user.displayName && (
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-text-tertiary" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-text-secondary">Отображаемое имя</p>
                                            <p className="text-base text-text-primary">{user.displayName}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-text-tertiary" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-text-secondary">Дата регистрации</p>
                                        <p className="text-base text-text-primary">{formatDate(user.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Безопасность</CardTitle>
                            <CardDescription>Управление паролем и настройками безопасности</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-text-tertiary" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-text-secondary">Пароль</p>
                                        <p className="text-base text-text-primary">••••••••</p>
                                    </div>
                                    <Button variant="primary" size="sm" onClick={() => setPasswordModalOpen(true)}>
                                        <Key className="w-4 h-4 mr-2" />
                                        Изменить пароль
                                    </Button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-text-tertiary" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-text-secondary">Email верификация</p>
                                        <p className="text-base text-text-primary">
                                            {user.emailVerified ? 'Подтвержден' : 'Не подтвержден'}
                                        </p>
                                    </div>
                                    {user.emailVerified && (
                                        <Badge variant="success" size="sm">✓ Verified</Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-error-600 dark:text-error-400">Опасная зона</CardTitle>
                            <CardDescription>Необратимые действия с аккаунтом</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 rounded-lg bg-error-50 dark:bg-error-900/10">
                                <div>
                                    <p className="font-medium text-error-900 dark:text-error-100">Удалить аккаунт</p>
                                    <p className="text-sm text-error-700 dark:text-error-300">
                                        Это действие нельзя отменить
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-error-600 hover:text-error-700 hover:bg-error-100 dark:hover:bg-error-900/20"
                                    onClick={() => setDeleteModalOpen(true)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Удалить
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Edit Profile Modal */}
            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <ModalHeader>
                    <ModalTitle>Редактировать профиль</ModalTitle>
                </ModalHeader>
                <ModalContent>
                    <FormField
                        label="Отображаемое имя"
                        type="text"
                        name="displayName"
                        placeholder="Ваше имя"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </ModalContent>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleUpdateProfile} loading={submitting}>
                        Сохранить
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Change Password Modal */}
            <Modal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)}>
                <ModalHeader>
                    <ModalTitle>Изменить пароль</ModalTitle>
                </ModalHeader>
                <ModalContent>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-1.5">
                                Текущий пароль <span className="text-error-500">*</span>
                            </label>
                            <PasswordInput
                                name="currentPassword"
                                placeholder="Введите текущий пароль"
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-1.5">
                                Новый пароль <span className="text-error-500">*</span>
                            </label>
                            <PasswordInput
                                name="newPassword"
                                placeholder="Минимум 8 символов"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-1.5">
                                Подтвердите пароль <span className="text-error-500">*</span>
                            </label>
                            <PasswordInput
                                name="confirmPassword"
                                placeholder="Повторите новый пароль"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>
                </ModalContent>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setPasswordModalOpen(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleChangePassword} loading={submitting}>
                        Изменить пароль
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Delete Account Modal */}
            <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} size="sm">
                <ModalHeader>
                    <ModalTitle className="text-error-600 dark:text-error-400">Удалить аккаунт?</ModalTitle>
                </ModalHeader>
                <ModalContent>
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-error-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-text-primary font-medium mb-2">
                                Это действие нельзя отменить
                            </p>
                            <p className="text-sm text-text-secondary">
                                Все ваши данные будут удалены безвозвратно. Вы уверены, что хотите продолжить?
                            </p>
                        </div>
                    </div>
                </ModalContent>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAccount} loading={submitting}>
                        Да, удалить аккаунт
                    </Button>
                </ModalFooter>
            </Modal>

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
