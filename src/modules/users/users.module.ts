import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {MulterModule} from "@nestjs/platform-express";
import {ConfigModule} from "@nestjs/config";
import {MulterConfigService} from "../../common/config/multer.config";
import {PrismaModule} from "../prisma/prisma.module";

@Module({
    imports: [
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useClass: MulterConfigService,
        }),
        PrismaModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {
}
