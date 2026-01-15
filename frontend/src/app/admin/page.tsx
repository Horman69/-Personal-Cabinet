'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card'
import { Users, UserPlus, UserCheck, Activity } from 'lucide-react'
import { admin } from '@/lib/admin'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Stats {
    totalUsers: number
    newUsersToday: number
    newUsersWeek: number
    newUsersMonth: number
    activeUsers: number
    blockedUsers: number
    verifiedEmails: number
    storageUsed: string
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const data = await admin.getStats()
            setStats(data)
        } catch (error) {
            console.error('Failed to load stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="text-text-secondary">Загрузка...</div>
            </AdminLayout>
        )
    }

    // Chart data
    const userGrowthData = [
        { name: 'Сегодня', users: stats?.newUsersToday || 0 },
        { name: 'За неделю', users: stats?.newUsersWeek || 0 },
        { name: 'За месяц', users: stats?.newUsersMonth || 0 },
    ]

    const userStatusData = [
        { name: 'Активные', value: stats?.activeUsers || 0 },
        { name: 'Подтверждены', value: stats?.verifiedEmails || 0 },
        { name: 'Заблокированы', value: stats?.blockedUsers || 0 },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Панель управления</h1>
                    <p className="text-text-secondary mt-1">
                        Обзор статистики приложения
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Users */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-secondary">Всего пользователей</p>
                                    <p className="text-3xl font-bold text-text-primary mt-2">
                                        {stats?.totalUsers || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center">
                                    <Users className="w-6 h-6 text-primary-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* New Today */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-secondary">Новых сегодня</p>
                                    <p className="text-3xl font-bold text-text-primary mt-2">
                                        {stats?.newUsersToday || 0}
                                    </p>
                                    <p className="text-xs text-text-tertiary mt-1">
                                        {stats?.newUsersWeek || 0} за неделю
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-success-500/10 rounded-full flex items-center justify-center">
                                    <UserPlus className="w-6 h-6 text-success-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Users */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-secondary">Активные</p>
                                    <p className="text-3xl font-bold text-text-primary mt-2">
                                        {stats?.activeUsers || 0}
                                    </p>
                                    <p className="text-xs text-text-tertiary mt-1">
                                        За 7 дней
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Verified Emails */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-secondary">Подтверждены</p>
                                    <p className="text-3xl font-bold text-text-primary mt-2">
                                        {stats?.verifiedEmails || 0}
                                    </p>
                                    <p className="text-xs text-text-tertiary mt-1">
                                        {stats?.blockedUsers || 0} заблокировано
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-success-500/10 rounded-full flex items-center justify-center">
                                    <UserCheck className="w-6 h-6 text-success-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Growth Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Рост пользователей</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={userGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="users" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* User Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Распределение по статусам</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={userStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) => `${entry.name}: ${entry.value}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {userStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Быстрая статистика</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 rounded-lg bg-surface-secondary">
                                    <span className="text-text-secondary font-medium">Новых за месяц</span>
                                    <span className="font-bold text-text-primary text-lg">
                                        {stats?.newUsersMonth || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-surface-secondary">
                                    <span className="text-text-secondary font-medium">Заблокировано</span>
                                    <span className="font-bold text-error-500 text-lg">
                                        {stats?.blockedUsers || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-surface-secondary">
                                    <span className="text-text-secondary font-medium">Использовано места</span>
                                    <span className="font-bold text-text-primary text-lg">
                                        {stats?.storageUsed || '0 MB'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Статус системы</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 rounded-lg bg-surface-secondary">
                                    <span className="text-text-secondary font-medium">База данных</span>
                                    <span className="font-semibold text-success-500 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
                                        Онлайн
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-surface-secondary">
                                    <span className="text-text-secondary font-medium">Статус API</span>
                                    <span className="font-semibold text-success-500 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
                                        Работает
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-surface-secondary">
                                    <span className="text-text-secondary font-medium">Обновлено</span>
                                    <span className="font-semibold text-text-primary">
                                        Только что
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    )
}
