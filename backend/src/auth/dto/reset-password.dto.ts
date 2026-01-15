import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty({ message: 'Токен обязателен' })
    token: string;

    @IsString()
    @MinLength(8, { message: 'Пароль должен быть минимум 8 символов' })
    @MaxLength(100, { message: 'Пароль слишком длинный' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Пароль должен содержать заглавные, строчные буквы и цифры',
    })
    newPassword: string;
}
