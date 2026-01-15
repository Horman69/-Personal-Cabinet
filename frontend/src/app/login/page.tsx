'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '@/lib/auth'
import { AuthLayout } from '@/components/layouts'
import { Button, FormField, PasswordInput } from '@/components/ui'
import { useToast } from '@/components/ToastProvider'

export default function LoginPage() {
    const router = useRouter()
    const { showToast } = useToast()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.email || !formData.password) {
            showToast({
                variant: 'error',
                title: 'Ошибка',
                message: 'Заполните все поля',
                duration: 3000,
            })
            return
        }

        setLoading(true)

        try {
            const response = await authApi.login(formData)

            localStorage.setItem('accessToken', response.accessToken)
            localStorage.setItem('refreshToken', response.refreshToken)

            showToast({
                variant: 'success',
                title: 'Успешно!',
                message: 'Добро пожаловать',
                duration: 2000,
            })

            setTimeout(() => router.push('/dashboard'), 500)
        } catch (err: any) {
            showToast({
                variant: 'error',
                title: 'Ошибка входа',
                message: err.response?.data?.message || 'Проверьте данные',
                duration: 4000,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Вход"
            subtitle={
                <>
                    Или{' '}
                    <Link
                        href="/register"
                        className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        зарегистрируйтесь
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
                />

                {/* Password */}
                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">
                        Пароль <span className="text-error-500">*</span>
                    </label>
                    <PasswordInput
                        name="password"
                        autoComplete="current-password"
                        placeholder="Введите пароль"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                        Забыли пароль?
                    </Link>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    className="mt-6"
                >
                    Войти
                </Button>
            </form>
        </AuthLayout>
    )
}
