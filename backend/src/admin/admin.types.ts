export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface AdminStats {
    totalUsers: number
    newUsersToday: number
    newUsersWeek: number
    newUsersMonth: number
    activeUsers: number
    blockedUsers: number
    verifiedEmails: number
    storageUsed: string
}

export interface PaginatedUsers {
    users: any[]
    total: number
    page: number
    totalPages: number
}

export interface PaginatedLogs {
    logs: any[]
    total: number
    page: number
    totalPages: number
}
