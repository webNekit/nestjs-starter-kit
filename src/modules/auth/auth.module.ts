import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {JwtRefreshStrategy} from "./strategies/jwt-refresh.strategy";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MulterModule} from "@nestjs/platform-express";
import {MulterConfigService} from "../../common/config/multer.config";
import {PassportModule} from "@nestjs/passport";

@Module({
  imports: [
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          secret: config.get('JWT_ACCESS_SECRET'),
          signOptions: { expiresIn: config.get('JWT_ACCESS_EXPIRES_IN') },
        }),
      }),
      MulterModule.registerAsync({
        imports: [ConfigModule],
        useClass: MulterConfigService,
      }),
      PassportModule,
      PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
