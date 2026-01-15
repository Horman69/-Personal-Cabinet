import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const userId = request.user?.userId

        if (!userId) {
            throw new ForbiddenException('User not authenticated')
        }

        // Get user from database
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, isBlocked: true },
        })

        if (!user) {
            throw new ForbiddenException('User not found')
        }

        if (user.isBlocked) {
            throw new ForbiddenException('User is blocked')
        }

        // Check if user is admin or super admin
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Admin access required')
        }

        return true
    }
}
