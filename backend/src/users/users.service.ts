import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    /**
     * Получить профиль пользователя
     */
    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                displayName: true,
                avatarUrl: true,
                emailVerified: true,
                role: true,
                createdAt: true,
                lastLoginAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        return user;
    }

    /**
     * Обновить профиль пользователя
     */
    async updateProfile(userId: string, dto: UpdateProfileDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                username: dto.username,
                displayName: dto.displayName,
            },
            select: {
                id: true,
                email: true,
                username: true,
                displayName: true,
                avatarUrl: true,
            },
        });

        return user;
    }

    /**
     * Изменить пароль
     */
    async changePassword(userId: string, dto: ChangePasswordDto) {
        // Получаем пользователя
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        // Проверяем текущий пароль
        const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный текущий пароль');
        }

        // Хешируем новый пароль
        const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);

        // Обновляем пароль
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });

        // Удаляем все сессии (заставляем пользователя войти заново)
        await this.prisma.session.deleteMany({
            where: { userId },
        });

        return { message: 'Пароль успешно изменен. Войдите в систему заново.' };
    }
}
