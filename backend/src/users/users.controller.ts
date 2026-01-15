import { Controller, Get, Patch, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // Все endpoints требуют авторизации
export class UsersController {
    constructor(private usersService: UsersService) { }

    /**
     * GET /api/users/me
     * Получить свой профиль
     */
    @Get('me')
    async getProfile(@Req() req) {
        return this.usersService.getProfile(req.user.userId);
    }

    /**
     * PATCH /api/users/me
     * Обновить свой профиль
     */
    @Patch('me')
    async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.userId, dto);
    }

    /**
     * POST /api/users/change-password
     * Изменить пароль
     */
    @Post('change-password')
    async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
        return this.usersService.changePassword(req.user.userId, dto);
    }
}
