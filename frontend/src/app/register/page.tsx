'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '@/lib/auth'
import { AuthLayout } from '@/components/layouts'
import { Button, FormField, PasswordInput } from '@/components/ui'
import { useToast } from '@/components/ToastProvider'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
    const router = useRouter()
    const { showToast } = useToast()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        displayName: '',
    })
    const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleEmailBlur = async () => {
        if (formData.email && formData.email.includes('@')) {
            try {
                const response = await authApi.suggestUsername(formData.email)
                setSuggestedUsernames([response.suggested, ...response.alternatives])
            } catch (err) {
                console.error('Failed to suggest username:', err)
            }
        }
    }

    const validate = () => {
        if (!formData.email) {
            showToast({
                variant: 'error',
                title: 'Ошибка',
                message: 'Укажите email',
                duration: 3000,
            })
            return false
        }

        if (!formData.username || formData.username.length < 4) {
            showToast({
                variant: 'error',
                title: 'Ошибка',
                message: 'Username должен быть минимум 4 символа',
                duration: 3000,
            })
            return false
        }

        if (!formData.password || formData.password.length < 8) {
            showToast({
                variant: 'error',
                title: 'Ошибка',
                message: 'Пароль должен быть минимум 8 символов',
                duration: 3000,
            })
            return false
        }

        if (formData.password !== formData.confirmPassword) {
            showToast({
                variant: 'error',
                title: 'Ошибка',
                message: 'Пароли не совпадают',
                duration: 3000,
            })
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        setLoading(true)

        try {
            const response = await authApi.register({
                email: formData.email,
                password: formData.password,
                username: formData.username,
                displayName: formData.displayName || undefined,
            })

            localStorage.setItem('accessToken', response.accessToken)
            localStorage.setItem('refreshToken', response.refreshToken)

            showToast({
                variant: 'success',
                title: 'Успешно!',
                message: 'Добро пожаловать',
                duration: 2000,
            })

            setTimeout(() => router.push('/profile'), 500)
        } catch (err: any) {
            showToast({
                variant: 'error',
                title: 'Ошибка регистрации',
                message: err.response?.data?.message || 'Попробуйте снова',
                duration: 4000,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Регистрация"
            subtitle={
                <>
                    Или{' '}
                    <Link
                        href="/login"
                        className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        войдите в аккаунт
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <FormField
                    label="Email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleEmailBlur}
                />

                {/* Username */}
                <FormField
                    label="Username"
                    type="text"
                    name="username"
                    autoComplete="username"
                    placeholder="Уникальное имя для входа (4-20 символов)"
                    value={formData.username}
                    onChange={handleChange}
                />

                {/* Display Name - Optional, less prominent */}
                <FormField
                    label="Отображаемое имя"
                    type="text"
                    name="displayName"
                    autoComplete="name"
                    placeholder="Необязательно"
                    value={formData.displayName}
                    onChange={handleChange}
                />

                {/* Password */}
                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">
                        Пароль <span className="text-error-500">*</span>
                    </label>
                    <PasswordInput
                        name="password"
                        autoComplete="new-password"
                        placeholder="Минимум 8 символов"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">
                        Подтвердите пароль <span className="text-error-500">*</span>
                    </label>
                    <PasswordInput
                        name="confirmPassword"
                        autoComplete="new-password"
                        placeholder="Повторите пароль"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    className="mt-6"
                >
                    Зарегистрироваться
                </Button>
            </form>
        </AuthLayout>
    )
}
