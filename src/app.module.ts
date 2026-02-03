import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PrismaModule} from './modules/prisma/prisma.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {envValidationSchema} from "./common/config/env.validation";
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: envValidationSchema,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
        }),
        ServeStaticModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const uploadDir = configService.getOrThrow<string>('UPLOAD_DIR');
                return [
                    {
                        rootPath: join(process.cwd(), uploadDir),
                        serveRoot: '/uploads',
                        serveStaticOptions: {
                            index: false,
                        },
                    },
                ];
            },
        }),
        PrismaModule,
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
