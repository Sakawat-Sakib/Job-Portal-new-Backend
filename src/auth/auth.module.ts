import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports:[
    PrismaModule,
    PassportModule.register({defaultStrategy:"jwt"}),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async (configService:ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: {expiresIn:'1d'}
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule]

})
export class AuthModule {}
