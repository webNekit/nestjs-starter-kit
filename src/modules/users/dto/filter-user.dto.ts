import {PaginationDto} from "../../../common/dto/pagination.dto";
import {ApiPropertyOptional} from "@nestjs/swagger";
import {Role} from "@prisma/client";
import {IsEnum, IsOptional} from "class-validator";

enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export class FilterUserDto extends PaginationDto {
    @ApiPropertyOptional({ enum: Role, description: 'Фильтр по ролям' })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @ApiPropertyOptional({ enum: SortOrder, description: 'Сортировка по дате создания' })
    @IsOptional()
    @IsEnum(SortOrder)
    sort?: SortOrder = SortOrder.DESC;
}