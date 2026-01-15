import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SuggestUsernameDto } from './dto/suggest-username.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsernameGenerator } from '../common/utils/username.utils';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private prisma: PrismaService,
    ) { }

    /**
     * POST /api/auth/suggest-username
     * Предложить username на основе email
     */
    @Post('suggest-username')
    async suggestUsername(@Body() dto: SuggestUsernameDto) {
        const baseUsername = UsernameGenerator.fromEmail(dto.email);
        const suggested = await UsernameGenerator.generateUnique(baseUsername, this.prisma);
        const alternatives = UsernameGenerator.generateAlternatives(baseUsername);

        return {
            suggested,
            alternatives,
        };
    }

    /**
     * POST /api/auth/register
     * Регистрация нового пользователя
     * Rate limit: 3 запроса в час
     */
    @Post('register')
    @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 запроса в час
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    /**
     * POST /api/auth/login
     * Вход в систему
     * Rate limit: 5 попыток в 15 минут
     */
    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 попыток в 15 минут
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    /**
     * POST /api/auth/refresh
     * Обновление access token
     */
    @Post('refresh')
    async refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshTokens(dto.refreshToken);
    }

    /**
     * POST /api/auth/logout
     * Выход из системы (требует авторизации)
     */
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Req() req, @Body() dto: RefreshTokenDto) {
        return this.authService.logout(req.user.userId, dto.refreshToken);
    }

    /**
     * POST /api/auth/verify-email
     * Подтверждение email
     */
    @Post('verify-email')
    async verifyEmail(@Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(dto.token);
    }

    /**
     * POST /api/auth/resend-verification
     * Повторная отправка письма верификации
     * Rate limit: 1 запрос в 5 минут
     */
    @Post('resend-verification')
    @Throttle({ default: { limit: 1, ttl: 300000 } }) // 1 запрос в 5 минут
    async resendVerification(@Body() dto: ResendVerificationDto) {
        return this.authService.resendVerification(dto.email);
    }

    /**
     * POST /api/auth/forgot-password
     * Запрос на восстановление пароля
     * Rate limit: 3 запроса в час
     */
    @Post('forgot-password')
    @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 запроса в час
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto.email);
    }

    /**
     * POST /api/auth/reset-password
     * Сброс пароля
     */
    @Post('reset-password')
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    }
}
