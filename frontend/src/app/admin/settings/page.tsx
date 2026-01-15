'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card/Card'
import { Button } from '@/components/ui/Button/Button'
import { Input } from '@/components/ui/Input/Input'
import { Label } from '@/components/ui/Label/Label'
import { Save, Database, Mail, Shield } from 'lucide-react'

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        maxFileSize: '5',
        emailEnabled: true,
        registrationEnabled: true,
        emailVerificationRequired: true,
        sessionTimeout: '24',
        maxLoginAttempts: '5',
    })

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving settings:', settings)
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Настройки</h1>
                        <p className="text-text-secondary mt-1">
                            Конфигурация системных настроек и предпочтений
                        </p>
                    </div>
                    <Button variant="primary" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить изменения
                    </Button>
                </div>

                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                                <Database className="w-5 h-5 text-primary-500" />
                            </div>
                            <div>
                                <CardTitle>Общие настройки</CardTitle>
                                <CardDescription>Базовая конфигурация приложения</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="maxFileSize">Максимальный размер файла (МБ)</Label>
                                <Input
                                    id="maxFileSize"
                                    type="number"
                                    value={settings.maxFileSize}
                                    onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
                                    className="mt-2"
                                />
                                <p className="text-xs text-text-tertiary mt-1">
                                    Максимальный размер файла для загрузки аватара
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="sessionTimeout">Время сессии (часы)</Label>
                                <Input
                                    id="sessionTimeout"
                                    type="number"
                                    value={settings.sessionTimeout}
                                    onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                                    className="mt-2"
                                />
                                <p className="text-xs text-text-tertiary mt-1">
                                    Как долго пользователи остаются авторизованными
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Email Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <Mail className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <CardTitle>Настройки Email</CardTitle>
                                <CardDescription>Email уведомления и верификация</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                                <div>
                                    <p className="font-medium text-text-primary">Email сервис</p>
                                    <p className="text-sm text-text-tertiary">Включить email уведомления</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.emailEnabled}
                                        onChange={(e) => setSettings({ ...settings, emailEnabled: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                                <div>
                                    <p className="font-medium text-text-primary">Требуется подтверждение Email</p>
                                    <p className="text-sm text-text-tertiary">Пользователи должны подтвердить email для входа</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.emailVerificationRequired}
                                        onChange={(e) => setSettings({ ...settings, emailVerificationRequired: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-error-500/10 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-error-500" />
                            </div>
                            <div>
                                <CardTitle>Настройки безопасности</CardTitle>
                                <CardDescription>Аутентификация и контроль доступа</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="maxLoginAttempts">Максимум попыток входа</Label>
                                <Input
                                    id="maxLoginAttempts"
                                    type="number"
                                    value={settings.maxLoginAttempts}
                                    onChange={(e) => setSettings({ ...settings, maxLoginAttempts: e.target.value })}
                                    className="mt-2"
                                />
                                <p className="text-xs text-text-tertiary mt-1">
                                    Заблокировать пользователя после такого количества неудачных попыток
                                </p>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                                <div>
                                    <p className="font-medium text-text-primary">Регистрация включена</p>
                                    <p className="text-sm text-text-tertiary">Разрешить регистрацию новых пользователей</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.registrationEnabled}
                                        onChange={(e) => setSettings({ ...settings, registrationEnabled: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
