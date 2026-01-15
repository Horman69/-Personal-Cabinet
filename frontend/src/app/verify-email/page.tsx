'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { AuthLayout } from '@/components/layouts'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function VerifyEmailPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('Токен верификации не найден')
            return
        }

        verifyEmail()
    }, [token])

    const verifyEmail = async () => {
        try {
            const response = await axios.post(`${API_URL}/auth/verify-email`, { token })
            setStatus('success')
            setMessage(response.data.message || 'Email успешно подтвержден!')

            // Redirect after 3 seconds
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (err: any) {
            setStatus('error')
            setMessage(err.response?.data?.message || 'Ошибка верификации email')
        }
    }

    // Loading state
    if (status === 'loading') {
        return (
            <AuthLayout
                title="Подтверждение email"
                showBackLink={false}
            >
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <Loader2 className="w-12 h-12 text-primary-600 dark:text-primary-400 animate-spin" />
                    </div>

                    <div className="space-y-2">
                        <p className="text-base text-text-secondary">
                            Проверяем ваш email...
                        </p>
                        <p className="text-sm text-text-tertiary">
                            Пожалуйста, подождите
                        </p>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    // Success state
    if (status === 'success') {
        return (
            <AuthLayout
                title="Email подтвержден!"
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
                            {message}
                        </p>
                        <p className="text-sm text-text-tertiary">
                            Перенаправляем на страницу входа...
                        </p>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    // Error state
    return (
        <AuthLayout
            title="Ошибка верификации"
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
                        {message}
                    </p>
                    <p className="text-sm text-text-tertiary">
                        Возможно, ссылка устарела или была использована
                    </p>
                </div>

                <Link
                    href="/login"
                    className="inline-block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                    ← Вернуться на страницу входа
                </Link>
            </div>
        </AuthLayout>
    )
}
