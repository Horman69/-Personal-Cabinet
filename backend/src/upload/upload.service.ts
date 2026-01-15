import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs/promises'
import * as path from 'path'

@Injectable()
export class UploadService {
    private readonly uploadDir: string
    private readonly maxFileSize = 5 * 1024 * 1024 // 5MB
    private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']

    constructor(private configService: ConfigService) {
        this.uploadDir = path.join(process.cwd(), 'uploads', 'avatars')
        this.ensureUploadDir()
    }

    private async ensureUploadDir() {
        try {
            await fs.access(this.uploadDir)
        } catch {
            await fs.mkdir(this.uploadDir, { recursive: true })
        }
    }

    async uploadAvatar(file: Express.Multer.File, userId: string): Promise<string> {
        // Validate file
        this.validateFile(file)

        // Generate unique filename
        const ext = path.extname(file.originalname)
        const filename = `${userId}-${Date.now()}${ext}`
        const filepath = path.join(this.uploadDir, filename)

        // Save file
        await fs.writeFile(filepath, file.buffer)

        // Return URL
        return `/uploads/avatars/${filename}`
    }

    private validateFile(file: Express.Multer.File) {
        // Check file exists
        if (!file) {
            throw new BadRequestException('Файл не предоставлен')
        }

        // Check file size
        if (file.size > this.maxFileSize) {
            throw new BadRequestException('Файл слишком большой (макс. 5MB)')
        }

        // Check MIME type
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Недопустимый тип файла (разрешены: JPG, PNG, WebP)')
        }
    }

    async deleteAvatar(avatarUrl: string) {
        if (!avatarUrl || !avatarUrl.startsWith('/uploads/avatars/')) {
            return
        }

        const filename = path.basename(avatarUrl)
        const filepath = path.join(this.uploadDir, filename)

        try {
            await fs.unlink(filepath)
        } catch (error) {
            // File doesn't exist or already deleted - ignore
        }
    }
}
