import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
    @IsEmail({}, { message: 'Некорректный формат email' })
    @IsNotEmpty({ message: 'Email обязателен' })
    @MaxLength(100, { message: 'Email слишком длинный' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;

    @IsString()
    @MinLength(4, { message: 'Username должен быть минимум 4 символа' })
    @MaxLength(20, { message: 'Username должен быть максимум 20 символов' })
    @Matches(/^[a-z][a-z0-9_-]{3,19}$/, {
        message: 'Username должен начинаться с буквы и содержать только буквы, цифры, _ и -',
    })
    @Transform(({ value }) => value?.toLowerCase().trim())
    username: string;

    @IsString()
    @IsOptional()
    @MaxLength(50, { message: 'Отображаемое имя слишком длинное' })
    @Transform(({ value }) => value?.trim())
    displayName?: string;

    @IsString()
    @MinLength(8, { message: 'Пароль должен быть минимум 8 символов' })
    @MaxLength(100, { message: 'Пароль слишком длинный' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Пароль должен содержать заглавные, строчные буквы и цифры',
    })
    password: string;
}
