import { Injectable, OnModuleInit, OnModuleDestroy, Inject, LoggerService } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    ) {
        super();
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('✅ База данных подключена', 'PrismaService');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('❌ База данных отключена', 'PrismaService');
    }
}
