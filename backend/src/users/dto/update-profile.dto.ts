import { IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    @MinLength(4, { message: 'Username должен быть минимум 4 символа' })
    @MaxLength(20, { message: 'Username должен быть максимум 20 символов' })
    @Matches(/^[a-z][a-z0-9_-]{3,19}$/, {
        message: 'Username должен начинаться с буквы и содержать только буквы, цифры, _ и -',
    })
    @Transform(({ value }) => value?.toLowerCase().trim())
    username?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50, { message: 'Отображаемое имя слишком длинное' })
    @Transform(({ value }) => value?.trim())
    displayName?: string;
}
