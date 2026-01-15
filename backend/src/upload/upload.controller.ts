import {
    Controller,
    Post,
    UseGuards,
    Request,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UploadService } from './upload.service'
import { PrismaService } from '../prisma/prisma.service'

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly prisma: PrismaService,
    ) { }

    @Post('avatar')
    @UseInterceptors(
        FileInterceptor('avatar', {
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
        }),
    )
    async uploadAvatar(
        @Request() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('Файл не предоставлен')
        }

        const userId = req.user.userId

        // Delete old avatar if exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { avatarUrl: true },
        })

        if (user?.avatarUrl) {
            await this.uploadService.deleteAvatar(user.avatarUrl)
        }

        // Upload new avatar
        const avatarUrl = await this.uploadService.uploadAvatar(file, userId)

        // Update user avatar URL
        await this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl },
        })

        return {
            avatarUrl,
            message: 'Аватар успешно загружен',
        }
    }
}
