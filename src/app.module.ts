import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { JobModule } from './job/job.module';
import { ApplicationModule } from './application/application.module';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true, envFilePath:'.env'}),
    PrismaModule,
    AuthModule,
    UserModule, 
    CompanyModule, 
    JobModule, 
    ApplicationModule, 
    ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
