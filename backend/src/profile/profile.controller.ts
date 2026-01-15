import {
    Controller,
    Get,
    Patch,
    Post,
    Delete,
    Body,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ProfileService } from './profile.service'
import { UpdateProfileDto, ChangePasswordDto } from './dto/profile.dto'

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get()
    async getProfile(@Request() req) {
        return this.profileService.getProfile(req.user.userId)
    }

    @Patch()
    async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.profileService.updateProfile(req.user.userId, updateProfileDto)
    }

    @Post('change-password')
    @HttpCode(HttpStatus.OK)
    async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
        return this.profileService.changePassword(req.user.userId, changePasswordDto)
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAccount(@Request() req) {
        await this.profileService.deleteAccount(req.user.userId)
    }
}
