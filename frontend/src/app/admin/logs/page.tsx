'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card'
import { Badge } from '@/components/ui/Badge/Badge'
import { admin } from '@/lib/admin'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface AuditLog {
    id: string
    action: string
    entity: string
    entityId: string | null
    metadata: string | null
    createdAt: string
    user: {
        id: string
        email: string
        username: string
        displayName: string | null
    } | null
}

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadLogs()
    }, [page])

    const loadLogs = async () => {
        try {
            setLoading(true)
            const data = await admin.getLogs({ page, limit: 50 })
            setLogs(data.logs)
            setTotal(data.total)
        } catch (error) {
            console.error('Failed to load logs:', error)
        } finally {
            setLoading(false)
        }
    }

    const getActionBadge = (action: string) => {
        if (action.includes('DELETE')) return <Badge variant="error">{action}</Badge>
        if (action.includes('BLOCK')) return <Badge variant="warning">{action}</Badge>
        if (action.includes('CREATE')) return <Badge variant="success">{action}</Badge>
        return <Badge variant="info">{action}</Badge>
    }

    const totalPages = Math.ceil(total / 50)

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Журнал действий</h1>
                    <p className="text-text-secondary mt-1">
                        Отслеживание всех действий администраторов и системных событий
                    </p>
                </div>

                {/* Logs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Журнал активности ({total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8 text-text-secondary">Загрузка...</div>
                        ) : logs.length === 0 ? (
                            <div className="text-center py-8 text-text-secondary">Записей не найдено</div>
                        ) : (
                            <div className="space-y-4">
                                {logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-surface-secondary"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {getActionBadge(log.action)}
                                                <span className="text-sm text-text-tertiary">
                                                    {format(new Date(log.createdAt), 'd MMM yyyy HH:mm', { locale: ru })}
                                                </span>
                                            </div>
                                            <p className="text-text-primary">
                                                {log.user ? (
                                                    <>
                                                        <span className="font-semibold">{log.user.displayName || log.user.username}</span>
                                                        {' '}выполнил действие над{' '}
                                                        <span className="font-semibold">{log.entity}</span>
                                                    </>
                                                ) : (
                                                    <>Системное действие над <span className="font-semibold">{log.entity}</span></>
                                                )}
                                            </p>
                                            {log.metadata && (
                                                <p className="text-sm text-text-tertiary mt-1">
                                                    {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                                <div className="text-sm text-text-secondary">
                                    Страница {page} из {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 rounded-lg border border-border bg-surface-primary text-text-primary disabled:opacity-50"
                                    >
                                        Назад
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 rounded-lg border border-border bg-surface-primary text-text-primary disabled:opacity-50"
                                    >
                                        Вперед
                                    </button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
