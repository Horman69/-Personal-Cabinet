'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { profileApi } from '@/lib/profile'

interface AdminGuardProps {
    children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAdmin()
    }, [])

    const checkAdmin = async () => {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                router.push('/login')
                return
            }

            const profile = await profileApi.getProfile()

            if (profile.role === 'ADMIN' || profile.role === 'SUPER_ADMIN') {
                setIsAdmin(true)
            } else {
                router.push('/dashboard')
            }
        } catch (error) {
            console.error('Failed to check admin status:', error)
            router.push('/login')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <div className="text-text-secondary">Checking permissions...</div>
            </div>
        )
    }

    if (!isAdmin) {
        return null
    }

    return <>{children}</>
}
