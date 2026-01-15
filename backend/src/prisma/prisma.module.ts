import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Делает PrismaService доступным во всех модулях
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
