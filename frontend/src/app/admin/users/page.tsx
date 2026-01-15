'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card'
import { Button } from '@/components/ui/Button/Button'
import { Input } from '@/components/ui/Input/Input'
import { Badge } from '@/components/ui/Badge/Badge'
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '@/components/ui/Modal/Modal'
import { admin } from '@/lib/admin'
import { Search, Shield, Ban, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface User {
    id: string
    email: string
    username: string
    displayName: string | null
    avatarUrl: string | null
    role: string
    isBlocked: boolean
    emailVerified: boolean
    createdAt: string
    lastLoginAt: string | null
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState<'active' | 'blocked' | ''>('')

    // Modals
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [blockModalOpen, setBlockModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [roleModalOpen, setRoleModalOpen] = useState(false)
    const [newRole, setNewRole] = useState('')

    useEffect(() => {
        loadUsers()
    }, [page, search, roleFilter, statusFilter])

    const loadUsers = async () => {
        try {
            setLoading(true)
            const data = await admin.getUsers({
                page,
                limit: 50,
                search: search || undefined,
                role: roleFilter || undefined,
                status: statusFilter || undefined,
            })
            setUsers(data.users)
            setTotal(data.total)
        } catch (error) {
            console.error('Failed to load users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleBlockUser = async () => {
        if (!selectedUser) return
        try {
            await admin.blockUser(selectedUser.id, !selectedUser.isBlocked)
            setBlockModalOpen(false)
            loadUsers()
        } catch (error) {
            console.error('Failed to block user:', error)
        }
    }

    const handleDeleteUser = async () => {
        if (!selectedUser) return
        try {
            await admin.deleteUser(selectedUser.id)
            setDeleteModalOpen(false)
            loadUsers()
        } catch (error) {
            console.error('Failed to delete user:', error)
        }
    }

    const handleChangeRole = async () => {
        if (!selectedUser || !newRole) return
        try {
            await admin.updateUserRole(selectedUser.id, newRole)
            setRoleModalOpen(false)
            loadUsers()
        } catch (error) {
            console.error('Failed to change role:', error)
        }
    }

    const totalPages = Math.ceil(total / 50)

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Управление пользователями</h1>
                    <p className="text-text-secondary mt-1">
                        Управление всеми пользователями, ролями и правами доступа
                    </p>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                                <Input
                                    placeholder="Поиск по email, username или имени..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Role Filter */}
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-border bg-surface-primary text-text-primary"
                            >
                                <option value="">Все роли</option>
                                <option value="USER">Пользователь</option>
                                <option value="ADMIN">Админ</option>
                                <option value="SUPER_ADMIN">Супер Админ</option>
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="px-4 py-2 rounded-lg border border-border bg-surface-primary text-text-primary"
                            >
                                <option value="">Все статусы</option>
                                <option value="active">Активные</option>
                                <option value="blocked">Заблокированные</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Пользователи ({total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8 text-text-secondary">Загрузка...</div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-8 text-text-secondary">Пользователи не найдены</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Пользователь</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Роль</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Статус</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Регистрация</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Последний вход</th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b border-border hover:bg-surface-secondary">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-semibold">
                                                            {user.displayName?.[0] || user.username[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-text-primary">
                                                                {user.displayName || user.username}
                                                            </div>
                                                            <div className="text-sm text-text-tertiary">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant={user.role === 'SUPER_ADMIN' ? 'error' : user.role === 'ADMIN' ? 'warning' : 'neutral'}>
                                                        {user.role === 'SUPER_ADMIN' ? 'Супер Админ' : user.role === 'ADMIN' ? 'Админ' : 'Пользователь'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {user.isBlocked ? (
                                                        <Badge variant="error">Заблокирован</Badge>
                                                    ) : user.emailVerified ? (
                                                        <Badge variant="success">Подтвержден</Badge>
                                                    ) : (
                                                        <Badge variant="warning">Не подтвержден</Badge>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-text-secondary">
                                                    {format(new Date(user.createdAt), 'd MMM yyyy', { locale: ru })}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-text-secondary">
                                                    {user.lastLoginAt ? format(new Date(user.lastLoginAt), 'd MMM yyyy', { locale: ru }) : 'Никогда'}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setNewRole(user.role)
                                                                setRoleModalOpen(true)
                                                            }}
                                                            title="Изменить роль"
                                                        >
                                                            <Shield className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setBlockModalOpen(true)
                                                            }}
                                                            title={user.isBlocked ? "Разблокировать" : "Заблокировать"}
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setDeleteModalOpen(true)
                                                            }}
                                                            title="Удалить"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                                <div className="text-sm text-text-secondary">
                                    Страница {page} из {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        Назад
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                    >
                                        Вперед
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Change Role Modal */}
            <Modal open={roleModalOpen} onClose={() => setRoleModalOpen(false)}>
                <ModalHeader>
                    <ModalTitle>Изменить роль пользователя</ModalTitle>
                </ModalHeader>
                <ModalContent>
                    <p className="text-text-secondary mb-4">
                        Изменить роль для {selectedUser?.email}
                    </p>
                    <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-surface-primary text-text-primary"
                    >
                        <option value="USER">Пользователь</option>
                        <option value="ADMIN">Админ</option>
                        <option value="SUPER_ADMIN">Супер Админ</option>
                    </select>
                </ModalContent>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setRoleModalOpen(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleChangeRole}>
                        Изменить роль
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Block/Unblock Modal */}
            <Modal open={blockModalOpen} onClose={() => setBlockModalOpen(false)}>
                <ModalHeader>
                    <ModalTitle>{selectedUser?.isBlocked ? 'Разблокировать' : 'Заблокировать'} пользователя</ModalTitle>
                </ModalHeader>
                <ModalContent>
                    <p className="text-text-secondary">
                        Вы уверены, что хотите {selectedUser?.isBlocked ? 'разблокировать' : 'заблокировать'} {selectedUser?.email}?
                    </p>
                </ModalContent>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setBlockModalOpen(false)}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleBlockUser}>
                        {selectedUser?.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Delete Modal */}
            <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <ModalHeader>
                    <ModalTitle>Удалить пользователя</ModalTitle>
                </ModalHeader>
                <ModalContent>
                    <p className="text-text-secondary">
                        Вы уверены, что хотите удалить {selectedUser?.email}? Это действие нельзя отменить.
                    </p>
                </ModalContent>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser}>
                        Удалить
                    </Button>
                </ModalFooter>
            </Modal>
        </AdminLayout>
    )
}
