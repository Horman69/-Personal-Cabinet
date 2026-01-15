'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { AuthLayout } from '@/components/layouts'
import { Button, FormField } from '@/components/ui'
import { CheckCircle } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setMessage('')

        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password`, { email })
            setStatus('success')
            setMessage(response.data.message || 'Инструкции отправлены на email')
        } catch (err: any) {
            setStatus('error')
            setMessage(err.response?.data?.message || 'Ошибка отправки')
        }
    }

    if (status === 'success') {
        return (
            <AuthLayout
                title="Письмо отправлено!"
                showBackLink={false}
            >
                <div className="text-center space-y-6">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="rounded-full bg-success-100 dark:bg-success-900/20 p-3">
                            <CheckCircle className="w-12 h-12 text-success-600 dark:text-success-400" />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <p className="text-body-md text-text-secondary">
                            {message}
                        </p>
                        <p className="text-body-sm text-text-tertiary">
                            Проверьте вашу почту и следуйте инструкциям.
                        </p>
                    </div>

                    {/* Back Link */}
                    <Link
                        href="/login"
                        className="inline-block text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                        ← Вернуться на страницу входа
                    </Link>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout
            title="Восстановление пароля"
            subtitle="Введите ваш email, и мы отправим инструкции для сброса пароля"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Alert */}
                {status === 'error' && (
                    <div className="rounded-md bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 p-4">
                        <p className="text-sm text-error-800 dark:text-error-200">{message}</p>
                    </div>
                )}

                {/* Email Field */}
                <FormField
                    label="Email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={status === 'loading'}
                >
                    Отправить инструкции
                </Button>

                {/* Back Link */}
                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                        ← Вернуться на страницу входа
                    </Link>
                </div>
            </form>
        </AuthLayout>
    )
}
