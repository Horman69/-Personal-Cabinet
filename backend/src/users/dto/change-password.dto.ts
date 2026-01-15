import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @MinLength(6, { message: 'Текущий пароль обязателен' })
    currentPassword: string;

    @IsString()
    @MinLength(8, { message: 'Новый пароль должен быть минимум 8 символов' })
    @MaxLength(100, { message: 'Новый пароль слишком длинный' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Новый пароль должен содержать заглавные, строчные буквы и цифры',
    })
    newPassword: string;
}
