import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateProfileDto, ChangePasswordDto } from './dto/profile.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                displayName: true,
                avatarUrl: true,
                emailVerified: true,
                createdAt: true,
                role: true,
            },
        })

        if (!user) {
            throw new NotFoundException('Пользователь не найден')
        }

        return user
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: updateProfileDto,
            select: {
                id: true,
                email: true,
                displayName: true,
                avatarUrl: true,
                emailVerified: true,
                createdAt: true,
                role: true,
            },
        })

        return user
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            throw new NotFoundException('Пользователь не найден')
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(
            changePasswordDto.currentPassword,
            user.passwordHash,
        )

        if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный текущий пароль')
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10)

        // Update password
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: hashedPassword },
        })

        return { message: 'Пароль успешно изменен' }
    }

    async deleteAccount(userId: string) {
        await this.prisma.user.delete({
            where: { id: userId },
        })
    }
}
