import api from './api';

export interface User {
    id: string;
    email: string;
    username: string;
    displayName?: string;
    createdAt: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterData {
    email: string;
    password: string;
    username: string;
    displayName?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface UpdateProfileData {
    username?: string;
    displayName?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export interface SuggestUsernameResponse {
    suggested: string;
    alternatives: string[];
}

// Auth API
export const authApi = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    logout: async (refreshToken: string): Promise<void> => {
        await api.post('/auth/logout', { refreshToken });
    },

    refresh: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/refresh', { refreshToken });
        return response.data;
    },

    suggestUsername: async (email: string): Promise<SuggestUsernameResponse> => {
        const response = await api.post('/auth/suggest-username', { email });
        return response.data;
    },
};

// Users API
export const usersApi = {
    getProfile: async (): Promise<User> => {
        const response = await api.get('/users/me');
        return response.data;
    },

    updateProfile: async (data: UpdateProfileData): Promise<User> => {
        const response = await api.patch('/users/me', data);
        return response.data;
    },

    changePassword: async (data: ChangePasswordData): Promise<void> => {
        await api.post('/users/change-password', data);
    },
};
