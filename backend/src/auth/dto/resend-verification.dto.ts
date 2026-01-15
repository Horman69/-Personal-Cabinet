import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ResendVerificationDto {
    @IsEmail({}, { message: 'Некорректный формат email' })
    @IsNotEmpty({ message: 'Email обязателен' })
    @MaxLength(100, { message: 'Email слишком длинный' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;
}
