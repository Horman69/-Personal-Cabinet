import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Используем Winston logger
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    // Получаем ConfigService
    const configService = app.get(ConfigService);

    // Включаем CORS
    app.enableCors({
        origin: configService.get('CORS_ORIGIN') || 'http://localhost:3000',
        credentials: true,
    });

    // Глобальная валидация с трансформацией
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Удаляет поля, которых нет в DTO
            forbidNonWhitelisted: true, // Выбрасывает ошибку при лишних полях
            transform: true, // Включает трансформацию (@Transform декораторы)
            transformOptions: {
                enableImplicitConversion: true, // Автоматическое преобразование типов
            },
        }),
    );

    // Глобальный префикс для API
    app.setGlobalPrefix('api');

    // Serve static files (uploaded avatars)
    const express = require('express');
    const path = require('path');
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

    const port = configService.get('PORT') || 3001;
    await app.listen(port);

    const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    logger.log('✅ База данных подключена', 'Bootstrap');
    logger.log(`🚀 Backend запущен на http://localhost:${port}`, 'Bootstrap');
    logger.log(`📚 API доступен на http://localhost:${port}/api`, 'Bootstrap');
    logger.log(`📁 Uploads доступны на http://localhost:${port}/uploads`, 'Bootstrap');
    logger.log('🛡️  Rate limiting активирован (10 запросов/60 сек)', 'Bootstrap');
    logger.log('✨ Улучшенная валидация включена', 'Bootstrap');
}

bootstrap();
