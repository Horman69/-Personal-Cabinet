import {
    Controller,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AdminGuard } from './guards/admin.guard'
import { UserRole } from './admin.types'

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
    constructor(private adminService: AdminService) { }

    /**
     * GET /api/admin/stats
     * Get dashboard statistics
     */
    @Get('stats')
    async getStats() {
        return this.adminService.getStats()
    }

    /**
     * GET /api/admin/users
     * Get paginated users list
     */
    @Get('users')
    async getUsers(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('role') role?: string,
        @Query('status') status?: 'active' | 'blocked',
    ) {
        return this.adminService.getUsers(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 50,
            search,
            role,
            status,
        )
    }

    /**
     * PATCH /api/admin/users/:id/role
     * Update user role
     */
    @Patch('users/:id/role')
    async updateUserRole(
        @Param('id') userId: string,
        @Body('role') role: UserRole,
        @Request() req,
    ) {
        return this.adminService.updateUserRole(userId, role, req.user.userId)
    }

    /**
     * PATCH /api/admin/users/:id/block
     * Block/unblock user
     */
    @Patch('users/:id/block')
    async blockUser(
        @Param('id') userId: string,
        @Body('blocked') blocked: boolean,
        @Body('reason') reason: string,
        @Request() req,
    ) {
        return this.adminService.blockUser(userId, blocked, reason, req.user.userId)
    }

    /**
     * DELETE /api/admin/users/:id
     * Delete user
     */
    @Delete('users/:id')
    async deleteUser(@Param('id') userId: string, @Request() req) {
        return this.adminService.deleteUser(userId, req.user.userId)
    }

    /**
     * GET /api/admin/logs
     * Get audit logs
     */
    @Get('logs')
    async getAuditLogs(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('userId') userId?: string,
        @Query('action') action?: string,
        @Query('from') from?: string,
        @Query('to') to?: string,
    ) {
        return this.adminService.getAuditLogs(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 50,
            userId,
            action,
            from ? new Date(from) : undefined,
            to ? new Date(to) : undefined,
        )
    }

    /**
     * GET /api/admin/settings
     * Get system settings
     */
    @Get('settings')
    async getSettings() {
        return this.adminService.getSettings()
    }

    /**
     * PATCH /api/admin/settings/:key
     * Update system setting
     */
    @Patch('settings/:key')
    async updateSetting(
        @Param('key') key: string,
        @Body('value') value: any,
        @Request() req,
    ) {
        return this.adminService.updateSetting(key, value, req.user.userId)
    }
}
