'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { AuthLayout } from '@/components/layouts'
import { Button, FormField } from '@/components/ui'
import { useToast } from '@/components/ToastProvider'
import { CheckCircle, AlertCircle } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const { showToast } = useToast()

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            showToast({
                variant: 'error',
                title: 'Ошибка валидации',
                message: 'Пароли не совпадают',
                duration: 4000,
            })
            setLoading(false)
            return
        }

        if (formData.newPassword.length < 8) {
            showToast({
                variant: 'error',
                title: 'Ошибка валидации',
                message: 'Пароль должен быть минимум 8 символов',
                duration: 4000,
            })
            setLoading(false)
            return
        }

        if (!token) {
            showToast({
                variant: 'error',
                title: 'Ошибка',
                message: 'Токен сброса не найден',
                duration: 4000,
            })
            setLoading(false)
            return
        }

        try {
            const response = await axios.post(`${API_URL}/auth/reset-password`, {
                token,
                newPassword: formData.newPassword,
            })

            setSuccess(true)

            showToast({
                variant: 'success',
                title: 'Пароль изменен!',
                message: 'Перенаправляем на страницу входа...',
                duration: 3000,
            })

            // Redirect after 3 seconds
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Ошибка сброса пароля. Попробуйте снова.'

            showToast({
                variant: 'error',
                title: 'Ошибка',
                message: errorMessage,
                duration: 5000,
            })
        } finally {
            setLoading(false)
        }
    }

    // No token error state
    if (!token) {
        return (
            <AuthLayout
                title="Ошибка"
                showBackLink={false}
            >
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-error-100 dark:bg-error-900/20 p-3">
                            <AlertCircle className="w-12 h-12 text-error-600 dark:text-error-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-base text-text-secondary">
                            Токен сброса пароля не найден
                        </p>
                        <p className="text-sm text-text-tertiary">
                            Возможно, ссылка устарела или была использована
                        </p>
                    </div>

                    <Link
                        href="/forgot-password"
                        className="inline-block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        ← Запросить новую ссылку
                    </Link>
                </div>
            </AuthLayout>
        )
    }

    // Success state
    if (success) {
        return (
            <AuthLayout
                title="Пароль изменен!"
                showBackLink={false}
            >
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-success-100 dark:bg-success-900/20 p-3">
                            <CheckCircle className="w-12 h-12 text-success-600 dark:text-success-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-base text-text-secondary">
                            Ваш пароль успешно изменен
                        </p>
                        <p className="text-sm text-text-tertiary">
                            Перенаправляем на страницу входа...
                        </p>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    // Form state
    return (
        <AuthLayout
            title="Создание нового пароля"
            subtitle="Введите новый пароль для вашего аккаунта"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password Field */}
                <FormField
                    label="Новый пароль"
                    type="password"
                    name="newPassword"
                    autoComplete="new-password"
                    placeholder="Минимум 8 символов"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                />

                {/* Confirm Password Field */}
                <FormField
                    label="Подтвердите пароль"
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Повторите пароль"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                >
                    Сохранить новый пароль
                </Button>

                {/* Back Link */}
                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        ← Вернуться на страницу входа
                    </Link>
                </div>
            </form>
        </AuthLayout>
    )
}
