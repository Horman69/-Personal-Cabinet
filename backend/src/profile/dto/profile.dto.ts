import { IsString, IsOptional, MinLength } from 'class-validator'

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    displayName?: string
}

export class ChangePasswordDto {
    @IsString()
    @MinLength(8, { message: 'Пароль должен быть минимум 8 символов' })
    currentPassword: string

    @IsString()
    @MinLength(8, { message: 'Новый пароль должен быть минимум 8 символов' })
    newPassword: string
}
