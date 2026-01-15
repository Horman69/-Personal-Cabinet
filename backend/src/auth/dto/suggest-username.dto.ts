import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class SuggestUsernameDto {
    @IsEmail({}, { message: 'Некорректный формат email' })
    @IsNotEmpty({ message: 'Email обязателен' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;
}
