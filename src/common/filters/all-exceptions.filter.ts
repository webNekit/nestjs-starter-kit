import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | object = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.getResponse();
        } else {
            // Логируем неизвестные ошибки (не показываем детали клиенту в проде)
            this.logger.error(
                `[${request.method}] ${request.url}`,
                exception instanceof Error ? exception.stack : String(exception)
            );
        }

        // Если message - это объект (например, от class-validator), обрабатываем его
        let errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
        };

        if (typeof message === 'object' && message !== null) {
            errorResponse = {
                ...errorResponse,
                ...message,
            };
        }

        response.status(status).json(errorResponse);
    }
}