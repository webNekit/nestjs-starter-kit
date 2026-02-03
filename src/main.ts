import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger, ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import * as compression from 'compression';
import {AllExceptionsFilter} from "./common/filters/all-exceptions.filter";
import {LoggingInterceptor} from "./common/interceptors/logging.interceptor";
import {TransformInterceptor} from "./common/interceptors/transform.interceptor";
import {setupSwagger} from "./common/config/swagger.config";
import helmet from "helmet";


async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.use(helmet({crossOriginResourcePolicy: false}));
    app.enableCors({
        origin: configService.get<string>('CORS_ORIGIN'),
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });

    app.use(cookieParser());
    app.use(compression());

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(
        new LoggingInterceptor(),
        new TransformInterceptor(),
    );

    setupSwagger(app, configService);

    const port = configService.get<number>('PORT') || 9000;
    await app.listen(port);

    logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
    logger.log(`📑 Swagger Documentation: ${await app.getUrl()}/api/docs`);
}

bootstrap();
