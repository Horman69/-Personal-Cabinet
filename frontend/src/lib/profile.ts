import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
    baseURL: API_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const profileApi = {
    getProfile: async () => {
        const response = await api.get('/api/profile')
        return response.data
    },

    updateProfile: async (data: { displayName?: string }) => {
        const response = await api.patch('/api/profile', data)
        return response.data
    },

    changePassword: async (data: { currentPassword: string; newPassword: string }) => {
        const response = await api.post('/api/profile/change-password', data)
        return response.data
    },

    deleteAccount: async () => {
        await api.delete('/api/profile')
    },
}
