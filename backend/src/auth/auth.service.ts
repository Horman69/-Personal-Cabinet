import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Inject, LoggerService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private emailService: EmailService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    ) { }

    /**
     * Регистрация нового пользователя
     */
    async register(dto: RegisterDto) {
        // Проверяем, существует ли пользователь
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }

        // Хешируем пароль
        const passwordHash = await bcrypt.hash(dto.password, 10);

        // Генерируем токен верификации
        const emailVerificationToken = randomUUID();

        // Создаем пользователя
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                username: dto.username,
                displayName: dto.displayName,
                emailVerificationToken,
            },
            select: {
                id: true,
                email: true,
                username: true,
                displayName: true,
                createdAt: true,
                emailVerified: true,
            },
        });

        // Отправляем email верификации
        try {
            await this.emailService.sendVerificationEmail(
                user.email,
                emailVerificationToken,
                user.displayName || user.username,
            );
        } catch (error) {
            this.logger.error('Failed to send verification email', error.stack, 'AuthService');
            // Не блокируем регистрацию, если email не отправился
        }

        // Генерируем токены
        const tokens = await this.generateTokens(user.id, user.email);

        // Сохраняем refresh token в БД
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        return {
            user,
            ...tokens,
            message: 'Регистрация успешна! Проверьте email для подтверждения.',
        };
    }

    /**
     * Вход в систему
     */
    async login(dto: LoginDto) {
        // Ищем пользователя
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Неверный email или пароль');
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный email или пароль');
        }

        // Обновляем время последнего входа
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        // Генерируем токены
        const tokens = await this.generateTokens(user.id, user.email);

        // Сохраняем refresh token
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                emailVerified: user.emailVerified,
            },
            ...tokens,
        };
    }

    /**
     * Обновление access token с помощью refresh token
     */
    async refreshTokens(refreshToken: string) {
        try {
            // Проверяем refresh token
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });

            // Ищем сессию в БД
            const session = await this.prisma.session.findFirst({
                where: {
                    userId: payload.sub,
                    expiresAt: { gte: new Date() },
                },
            });

            if (!session) {
                throw new UnauthorizedException('Сессия не найдена или истекла');
            }

            // Проверяем hash refresh token
            const isValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);

            if (!isValid) {
                throw new UnauthorizedException('Неверный refresh token');
            }

            // Генерируем новые токены
            const tokens = await this.generateTokens(payload.sub, payload.email);

            // Обновляем refresh token в БД
            await this.prisma.session.update({
                where: { id: session.id },
                data: {
                    refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10),
                    lastUsedAt: new Date(),
                },
            });

            return tokens;
        } catch (error) {
            throw new UnauthorizedException('Неверный или истекший refresh token');
        }
    }

    /**
     * Выход из системы (удаление сессии)
     */
    async logout(userId: string, refreshToken: string) {
        // Удаляем сессию
        await this.prisma.session.deleteMany({
            where: { userId },
        });

        return { message: 'Выход выполнен успешно' };
    }

    /**
     * Подтверждение email
     */
    async verifyEmail(token: string) {
        const user = await this.prisma.user.findUnique({
            where: { emailVerificationToken: token },
        });

        if (!user) {
            throw new BadRequestException('Неверный токен верификации');
        }

        if (user.emailVerified) {
            return { message: 'Email уже подтвержден' };
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerifiedAt: new Date(),
                emailVerificationToken: null,
            },
        });

        return { message: 'Email успешно подтвержден!' };
    }

    /**
     * Повторная отправка письма верификации
     */
    async resendVerification(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Не раскрываем, существует ли пользователь
            return { message: 'Если email существует, письмо было отправлено' };
        }

        if (user.emailVerified) {
            throw new BadRequestException('Email уже подтвержден');
        }

        // Генерируем новый токен
        const emailVerificationToken = randomUUID();

        await this.prisma.user.update({
            where: { id: user.id },
            data: { emailVerificationToken },
        });

        // Отправляем email
        try {
            await this.emailService.sendVerificationEmail(
                user.email,
                emailVerificationToken,
                user.displayName || user.username,
            );
        } catch (error) {
            this.logger.error('Failed to send verification email', error.stack, 'AuthService');
            throw new BadRequestException('Не удалось отправить email');
        }

        return { message: 'Письмо верификации отправлено' };
    }

    /**
     * Запрос на восстановление пароля
     */
    async forgotPassword(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        // Не раскрываем, существует ли пользователь
        if (!user) {
            return { message: 'Если email существует, инструкции отправлены' };
        }

        // Генерируем токен сброса
        const passwordResetToken = randomUUID();
        const passwordResetExpires = new Date();
        passwordResetExpires.setHours(passwordResetExpires.getHours() + 1); // 1 час

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken,
                passwordResetExpires,
            },
        });

        // Отправляем email
        try {
            await this.emailService.sendPasswordResetEmail(
                user.email,
                passwordResetToken,
                user.displayName || user.username,
            );
        } catch (error) {
            this.logger.error('Failed to send password reset email', error.stack, 'AuthService');
        }

        return { message: 'Если email существует, инструкции отправлены' };
    }

    /**
     * Сброс пароля
     */
    async resetPassword(token: string, newPassword: string) {
        const user = await this.prisma.user.findUnique({
            where: { passwordResetToken: token },
        });

        if (!user || !user.passwordResetExpires) {
            throw new BadRequestException('Неверный или истекший токен');
        }

        if (user.passwordResetExpires < new Date()) {
            throw new BadRequestException('Токен истек');
        }

        // Хешируем новый пароль
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Обновляем пароль и удаляем токен
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });

        // Удаляем все сессии пользователя
        await this.prisma.session.deleteMany({
            where: { userId: user.id },
        });

        // Отправляем подтверждение
        try {
            await this.emailService.sendPasswordChangedEmail(
                user.email,
                user.displayName || user.username,
            );
        } catch (error) {
            this.logger.error('Failed to send password changed email', error.stack, 'AuthService');
        }

        return { message: 'Пароль успешно изменен' };
    }

    /**
     * Генерация access и refresh токенов
     */
    private async generateTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: `${this.configService.get<number>('JWT_EXPIRATION')}s`,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: `${this.configService.get<number>('JWT_REFRESH_EXPIRATION')}s`,
            }),
        ]);

        return { accessToken, refreshToken };
    }

    /**
     * Сохранение refresh token в БД
     */
    private async saveRefreshToken(userId: string, refreshToken: string) {
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 дней

        // Удаляем старые сессии пользователя
        await this.prisma.session.deleteMany({
            where: { userId },
        });

        // Создаем новую сессию
        await this.prisma.session.create({
            data: {
                userId,
                refreshTokenHash,
                expiresAt,
            },
        });
    }
}
