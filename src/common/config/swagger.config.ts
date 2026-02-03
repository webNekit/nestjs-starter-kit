import {INestApplication} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {ConfigService} from '@nestjs/config';

export const setupSwagger = (app: INestApplication, configService: ConfigService) => {
    const isEnabled = configService.get<boolean>('SWAGGER_ENABLED');

    if (!isEnabled) return;

    const config = new DocumentBuilder()
        .setTitle('NestJS Senior Starter API')
        .setDescription('Документация API')
        .setVersion('1.0')
        .addCookieAuth('access_token', {type: 'http', in: 'Header', scheme: 'Bearer'}).build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
        },
    });
};