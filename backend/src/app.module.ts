import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { LoggerModule } from './logger/logger.module';
import { validate } from './config/env.validation';

@Module({
    imports: [
        // Конфигурация (переменные окружения) с валидацией
        ConfigModule.forRoot({
            isGlobal: true, // Делает ConfigService доступным везде
            validate, // Валидация env переменных при старте
            envFilePath: '.env',
        }),

        // Логирование (Winston)
        LoggerModule,

        // Rate Limiting (защита от брутфорса)
        ThrottlerModule.forRoot([{
            ttl: 60000, // 60 секунд
            limit: 10, // 10 запросов за 60 секунд
        }]),

        // Prisma (база данных)
        PrismaModule,

        // Email сервис
        EmailModule,

        // Модули приложения
        AuthModule,
        UsersModule,
        ProfileModule,
        UploadModule,
        AdminModule,
    ],
})
export class AppModule { }
