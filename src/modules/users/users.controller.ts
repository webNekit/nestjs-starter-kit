import {
    Body,
    Controller, Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiCookieAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {ConfigService} from "@nestjs/config";
import {Role} from "@prisma/client";
import {UsersService} from './users.service';
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/roles.guard";
import {Roles} from "../../common/decorators/roles.decorator";
import {CreateUserDto} from "./dto/create-user.dto";
import {IMAGE_VALIDATION} from "../../common/constants/index.constant";

import {FilterUserDto} from "./dto/filter-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {IdParamDto} from "../../common/dto/id-param.dto";
import {CurrentUser} from "../../common/decorators/current-user.decorator";

@ApiTags('Users (ADMIN)')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) {}

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Список пользователей (с фильтрацией)' })
    async findAll(@Query() query: FilterUserDto) {
        return this.usersService.findAll(query);
    }

    @Get('me')
    @ApiOperation({ summary: 'Профиль текущего пользователя' })
    async getMe(@CurrentUser('userId') id: string) {
        return this.usersService.findOne(id);
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Выбор пользователя по id' })
    async findOne(@Param() params: IdParamDto) {
        return this.usersService.findOne(params.id);
    }

    @Post()
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                password: { type: 'string' },
                fullName: { type: 'string' },
                role: { type: 'string', enum: ['USER', 'ADMIN'] },
                file: { type: 'string', format: 'binary' },
            }
        }
    })
    async create(@Body() dto: CreateUserDto, @UploadedFile(IMAGE_VALIDATION) file: Express.Multer.File) {
        return this.usersService.create(dto, file);
    }

    @ApiOperation({ summary: 'Обновить пользователя' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                password: { type: 'string' },
                fullName: { type: 'string' },
                role: { type: 'string', enum: ['USER', 'ADMIN'] },
                file: { type: 'string', format: 'binary' },
            }
        }
    })
    @Patch(':id')
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @UploadedFile(IMAGE_VALIDATION) file: Express.Multer.File) {
        return this.usersService.update(id, dto, file);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Удалить пользователя' })
    async delete(@Param() params: IdParamDto) {
        return this.usersService.remove(params.id);
    }
}
