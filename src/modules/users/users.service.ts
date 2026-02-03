import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {CreateUserDto} from "./dto/create-user.dto";
import {hashString} from "../../common/utils/hash.util";
import {getFileUrl} from "../../common/utils/url.util";
import {FilterUserDto} from "./dto/filter-user.dto";
import {Prisma} from "@prisma/client";
import {UpdateUserDto} from "./dto/update-user.dto";
import {deleteFileFromDisk} from "../../common/utils/delete-file.util";

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
    ) {}

    async findAll(query: FilterUserDto) {
        const { page, limit, role, sort } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.UserWhereInput = { role };

        const [items, total] = await Promise.all([
            this.prismaService.user.findMany({
                where: where,
                skip: skip,
                take: limit,
                orderBy: { createdAt: sort },
            }),
            this.prismaService.user.count({ where: where }),
        ]);

        return {
            data: items.map(user => this.sanitizeUser(user)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const user = await this.prismaService.user.findUnique({ where: { id: id } });
        if (!user) throw new NotFoundException('Пользователь не найден');
        return this.sanitizeUser(user);
    }

    async create(dto: CreateUserDto, file?: Express.Multer.File) {
        const exists = await this.prismaService.user.findUnique({ where: { email: dto.email } });
        if (exists) throw new ConflictException('Пользователь с таким email уже существует');

        const hashedPassword = await hashString(dto.password);

        const user = await this.prismaService.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                fullName: dto.fullName,
                role: dto.role,
                avatar: file ? file.filename : null,
            },
        });

        return this.sanitizeUser(user);
    }

    async update(id: string, dto: UpdateUserDto, file?: Express.Multer.File) {
        const user = await this.prismaService.user.findUnique({ where: { id: id } });
        if (!user) throw new NotFoundException('Пользователь не найден');

        if (file && user.avatar) deleteFileFromDisk(user.avatar, this.configService);

        const data: Prisma.UserUpdateInput = {
            email: dto.email,
            fullName: dto.fullName,
            role: dto.role,
            avatar: file?.filename,
            password: dto.password ? await hashString(dto.password) : undefined,
        };

        const updatedUser = await this.prismaService.user.update({
            where: { id: user.id },
            data: data,
        });

        return this.sanitizeUser(updatedUser);
    }

    async remove(id: string) {
        const user = await this.prismaService.user.findUnique({ where: { id: id } });
        if (!user) throw new NotFoundException('Пользователь не найден');

        deleteFileFromDisk(user.avatar, this.configService);
        return this.prismaService.user.delete({ where: { id: id } });

    }

    private sanitizeUser(user: any) {
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            avatar: getFileUrl(user.avatar, this.configService),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
