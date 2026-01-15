import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AdminStats, PaginatedUsers, PaginatedLogs, UserRole } from './admin.types'

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get admin dashboard statistics
     */
    async getStats(): Promise<AdminStats> {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        const [
            totalUsers,
            newUsersToday,
            newUsersWeek,
            newUsersMonth,
            activeUsers,
            blockedUsers,
            verifiedEmails,
        ] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { createdAt: { gte: today } } }),
            this.prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
            this.prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
            this.prisma.user.count({ where: { lastLoginAt: { gte: weekAgo } } }),
            this.prisma.user.count({ where: { isBlocked: true } }),
            this.prisma.user.count({ where: { emailVerified: true } }),
        ])

        // Calculate storage used (simplified - just count avatars)
        const usersWithAvatars = await this.prisma.user.count({
            where: { avatarUrl: { not: null } },
        })
        const storageUsed = `${(usersWithAvatars * 0.5).toFixed(1)} MB` // Estimate 0.5MB per avatar

        return {
            totalUsers,
            newUsersToday,
            newUsersWeek,
            newUsersMonth,
            activeUsers,
            blockedUsers,
            verifiedEmails,
            storageUsed,
        }
    }

    /**
     * Get paginated users list with filters
     */
    async getUsers(
        page: number = 1,
        limit: number = 50,
        search?: string,
        role?: string,
        status?: 'active' | 'blocked',
    ): Promise<PaginatedUsers> {
        const skip = (page - 1) * limit

        const where: any = {}

        if (search) {
            where.OR = [
                { email: { contains: search } },
                { username: { contains: search } },
                { displayName: { contains: search } },
            ]
        }

        if (role) {
            where.role = role
        }

        if (status === 'blocked') {
            where.isBlocked = true
        } else if (status === 'active') {
            where.isBlocked = false
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    displayName: true,
                    avatarUrl: true,
                    role: true,
                    isBlocked: true,
                    blockedAt: true,
                    blockedBy: true,
                    blockReason: true,
                    emailVerified: true,
                    createdAt: true,
                    lastLoginAt: true,
                },
            }),
            this.prisma.user.count({ where }),
        ])

        return {
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        }
    }

    /**
     * Update user role
     */
    async updateUserRole(userId: string, role: UserRole, adminId: string) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { role },
        })

        // Log the action
        await this.logAuditAction(
            adminId,
            'USER_ROLE_UPDATED',
            'User',
            userId,
            { oldRole: user.role, newRole: role },
        )

        return user
    }

    /**
     * Block/unblock user
     */
    async blockUser(
        userId: string,
        blocked: boolean,
        reason: string | undefined,
        adminId: string,
    ) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                isBlocked: blocked,
                blockedAt: blocked ? new Date() : null,
                blockedBy: blocked ? adminId : null,
                blockReason: blocked ? reason : null,
            },
        })

        // Log the action
        await this.logAuditAction(
            adminId,
            blocked ? 'USER_BLOCKED' : 'USER_UNBLOCKED',
            'User',
            userId,
            { reason },
        )

        return user
    }

    /**
     * Delete user
     */
    async deleteUser(userId: string, adminId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, username: true },
        })

        await this.prisma.user.delete({
            where: { id: userId },
        })

        // Log the action
        await this.logAuditAction(adminId, 'USER_DELETED', 'User', userId, {
            email: user?.email,
            username: user?.username,
        })

        return { success: true }
    }

    /**
     * Get audit logs with pagination
     */
    async getAuditLogs(
        page: number = 1,
        limit: number = 50,
        userId?: string,
        action?: string,
        from?: Date,
        to?: Date,
    ): Promise<PaginatedLogs> {
        const skip = (page - 1) * limit

        const where: any = {}

        if (userId) where.userId = userId
        if (action) where.action = action
        if (from || to) {
            where.createdAt = {}
            if (from) where.createdAt.gte = from
            if (to) where.createdAt.lte = to
        }

        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            username: true,
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                },
            }),
            this.prisma.auditLog.count({ where }),
        ])

        return {
            logs,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        }
    }

    /**
     * Log admin action to audit log
     */
    private async logAuditAction(
        userId: string,
        action: string,
        entity: string,
        entityId: string,
        metadata?: any,
    ) {
        await this.prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                metadata: metadata ? JSON.stringify(metadata) : null,
            },
        })
    }

    /**
     * Get system settings
     */
    async getSettings() {
        return this.prisma.systemSetting.findMany()
    }

    /**
     * Update system setting
     */
    async updateSetting(key: string, value: any, adminId: string) {
        const setting = await this.prisma.systemSetting.upsert({
            where: { key },
            update: {
                value: JSON.stringify(value),
                updatedBy: adminId,
            },
            create: {
                key,
                value: JSON.stringify(value),
                updatedBy: adminId,
            },
        })

        // Log the action
        await this.logAuditAction(adminId, 'SETTING_UPDATED', 'SystemSetting', key, {
            value,
        })

        return setting
    }
}
