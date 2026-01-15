'use client'

import Link from 'next/link'
import { Shield, Zap, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-bg-primary relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-primary-500/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Theme Toggle - Fixed */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Hero Section */}
            <div className="relative z-10 container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary mb-6 tracking-tight">
                        Добро пожаловать в
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                            Личный кабинет
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
                        Современная платформа для управления вашим аккаунтом с профессиональной системой аутентификации
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
                        <Link href="/login">
                            <Button variant="primary" size="lg" className="min-w-[160px] group">
                                Войти
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="secondary" size="lg" className="min-w-[160px]">
                                Регистрация
                            </Button>
                        </Link>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mt-16">
                        {/* Security */}
                        <div className="p-6 rounded-xl bg-surface-primary border border-border/50 hover:border-primary-500/50 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                                <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                Безопасность
                            </h3>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                JWT аутентификация, хеширование паролей, защита от XSS и CSRF атак
                            </p>
                        </div>

                        {/* Modern Stack */}
                        <div className="p-6 rounded-xl bg-surface-primary border border-border/50 hover:border-primary-500/50 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                                <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                Современный стек
                            </h3>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Next.js 14, TypeScript, NestJS, PostgreSQL, Prisma ORM
                            </p>
                        </div>

                        {/* Ready to Use */}
                        <div className="p-6 rounded-xl bg-surface-primary border border-border/50 hover:border-primary-500/50 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                                <CheckCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                Готов к использованию
                            </h3>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Модульная архитектура, легко интегрируется в любой проект
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-center pb-8 text-sm text-text-tertiary">
                <p>© 2024 Personal Cabinet. Профессиональная система аутентификации.</p>
            </div>
        </div>
    )
}
