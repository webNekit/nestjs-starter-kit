import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {Role, User} from "@prisma/client";
import {JwtService} from "@nestjs/jwt";
import {Express} from "express";
import {hashString, verifyString} from "../../common/utils/hash.util";
import {TokenPair} from "../../common/types/index.type";
import {PrismaService} from "../prisma/prisma.service";
import {RegisterDto} from "./dto/register.dto";
import {getFileUrl} from "../../common/utils/url.util";
import {LoginDto} from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto, file?: Express.Multer.File) {
        const existing = await this.prismaService.user.findUnique({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Пользователь с таким email уже существует');

        const user = await this.prismaService.user.create({
            data: {
                email: dto.email,
                password: await hashString(dto.password),
                fullName: dto.fullName,
                avatar: file?.filename || null,
                role: Role.USER,
            },
        });

        const tokens = await this.generateToken(user.id, user.email, user.role);

        return { user: this.sanitizeUser(user), tokens };
    }

    async login(dto: LoginDto) {
        const user = await this.prismaService.user.findUnique({ where: { email: dto.email } });
        if (!user || !(await verifyString(user.password, dto.password))) {
            throw new UnauthorizedException('Неверный логин и/или пароль');
        }

        const tokens = await this.generateToken(user.id, user.email, user.role);
        return { user: this.sanitizeUser(user), tokens };
    }

    async logout(userId: string) {
        await this.prismaService.user.updateMany({
            where: { id: userId, refreshToken: { not: null } },
            data: { refreshToken: null },
        });
    }

    async refresh(userId: string, refreshToken: string) {
        const user = await this.prismaService.user.findUnique({ where: { id: userId } });
        if (!user || !user.refreshToken) throw new UnauthorizedException('Access Denied');
    
        const isValid = await verifyString(user.refreshToken, refreshToken);
        if (!isValid) throw new UnauthorizedException('Invalid Refresh Token');
    
        const payload = { sub: user.id, email: user.email, role: user.role };
    
        const newAccessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
        });
    
        return { 
            accessToken: newAccessToken, 
            refreshToken: refreshToken,
        };
    }
    private sanitizeUser(user: User) {
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

    private async generateToken(userId: string, email: string, role: Role): Promise<TokenPair> {
        const payload = { sub: userId, email, role };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            }),
        ]);

        await this.prismaService.user.update({
            where: { id: userId },
            data: { refreshToken: await hashString(refreshToken) }
        });

        return { accessToken, refreshToken };
    }
}
