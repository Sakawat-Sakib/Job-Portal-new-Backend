import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { PrismaModule } from 'src/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService]
})
export class ApplicationModule {}
