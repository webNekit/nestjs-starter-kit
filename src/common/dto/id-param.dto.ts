import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdParamDto {
    @ApiProperty({ description: 'Уникальный идентификатор (UUID)', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID('4', { message: 'ID должен быть валидным UUID v4' })
    id: string;
}