import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const adminApi = axios.create({
    baseURL: `${API_URL}/api/admin`,
})

// Add auth token to requests
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Admin API methods
export const admin = {
    // Statistics
    getStats: async () => {
        const { data } = await adminApi.get('/stats')
        return data
    },

    // Users
    getUsers: async (params: {
        page?: number
        limit?: number
        search?: string
        role?: string
        status?: 'active' | 'blocked'
    }) => {
        const { data } = await adminApi.get('/users', { params })
        return data
    },

    updateUserRole: async (userId: string, role: string) => {
        const { data } = await adminApi.patch(`/users/${userId}/role`, { role })
        return data
    },

    blockUser: async (userId: string, blocked: boolean, reason?: string) => {
        const { data } = await adminApi.patch(`/users/${userId}/block`, {
            blocked,
            reason,
        })
        return data
    },

    deleteUser: async (userId: string) => {
        const { data } = await adminApi.delete(`/users/${userId}`)
        return data
    },

    // Audit Logs
    getLogs: async (params: {
        page?: number
        limit?: number
        userId?: string
        action?: string
        from?: string
        to?: string
    }) => {
        const { data } = await adminApi.get('/logs', { params })
        return data
    },

    // Settings
    getSettings: async () => {
        const { data } = await adminApi.get('/settings')
        return data
    },

    updateSetting: async (key: string, value: any) => {
        const { data } = await adminApi.patch(`/settings/${key}`, { value })
        return data
    },
}
