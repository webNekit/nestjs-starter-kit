import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../constants/index.constant';

export class PaginationDto {
    @ApiPropertyOptional({ description: 'Номер страницы', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ description: 'Количество элементов', default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(MAX_PAGE_SIZE)
    limit: number = DEFAULT_PAGE_SIZE;

    // Вспомогательный геттер для Prisma (skip)
    get skip(): number {
        return (this.page - 1) * this.limit;
    }
}