import { plainToInstance } from 'class-transformer';
import {
    IsString,
    IsNumber,
    IsEnum,
    validateSync,
    IsUrl,
    Min,
    Max,
} from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment = Environment.Development;

    @IsNumber()
    @Min(1000)
    @Max(65535)
    PORT: number;

    @IsString()
    DATABASE_URL: string;

    @IsString()
    JWT_SECRET: string;

    @IsString()
    JWT_REFRESH_SECRET: string;

    @IsNumber()
    @Min(60) // минимум 1 минута
    JWT_EXPIRATION: number; // seconds

    @IsNumber()
    @Min(3600) // минимум 1 час
    JWT_REFRESH_EXPIRATION: number; // seconds

    @IsString()
    SMTP_HOST: string;

    @IsNumber()
    @Min(1)
    @Max(65535)
    SMTP_PORT: number;

    @IsString()
    SMTP_USER: string;

    @IsString()
    SMTP_PASSWORD: string;

    @IsString()
    SMTP_FROM: string;

    @IsUrl({ require_tld: false })
    FRONTEND_URL: string;

    @IsUrl({ require_tld: false })
    CORS_ORIGIN: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(
            `Environment validation failed:\n${errors.map((e) => Object.values(e.constraints || {}).join(', ')).join('\n')}`,
        );
    }

    return validatedConfig;
}
