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

export const uploadApi = {
    uploadAvatar: async (file: File) => {
        const formData = new FormData()
        formData.append('avatar', file)

        const response = await api.post('/api/upload/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return response.data
    },
}
