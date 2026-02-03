import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {Response} from "express";
import {AuthService} from './auth.service';
import {TokenPair} from "../../common/types/index.type";
import {Public} from "../../common/decorators/public.decorator";
import {ApiBody, ApiConsumes, ApiOperation, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {RegisterDto} from "./dto/register.dto";
import {IMAGE_VALIDATION} from "../../common/constants/index.constant";
import {LoginDto} from "./dto/login.dto";
import {CurrentUser} from "../../common/decorators/current-user.decorator";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {JwtRefreshGuard} from "./guards/jwt-refresh.guard";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {
    }

    @Public()
    @Post('register')
    @ApiOperation({summary: 'Регистрация'})
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object', properties: {
                email: {type: 'string'},
                password: {type: 'string'},
                fullName: {type: 'string'},
                file: {type: 'string', format: 'binary'}
            }
        }
    })
    @UseInterceptors(FileInterceptor('file'))
    async register(@Body() dto: RegisterDto, @UploadedFile(IMAGE_VALIDATION) file: Express.Multer.File, @Res({passthrough: true}) res: Response) {
        const {user, tokens} = await this.authService.register(dto, file);
        this.setCookies(res, tokens);
        return user;

    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Вход' })
    async login(@Body() dto: LoginDto, @Res({ passthrough: true})res: Response) {
        const { user, tokens } = await this.authService.login(dto);
        this.setCookies(res, tokens);
        return user;
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Выход' })
    async logout(@CurrentUser('userId') id: string, @Res({ passthrough: true }) res: Response) {
        await this.authService.logout(id);
        this.clearCookies(res);
        return { message: 'Успешный выход' };
    }

    @Public()
    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Обновление токенов' })
    async refresh(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.refresh(user.userId, user.refreshToken);
        this.setCookies(res, tokens);
        return { message: 'Токены обновлены' };
    }

    private setCookies(res: Response, tokens: TokenPair) {
        const cookieOptions = {
            httpOnly: true,
            secure: this.configService.get<boolean>('COOKIE_SECURE'),
            domain: this.configService.get('COOKIE_DOMAIN') === 'localhost' ? undefined : this.configService.get('COOKIE_DOMAIN'),
            sameSite: this.configService.get('COOKIE_SAMESITE') as any,
            path: '/',
        };

        res.cookie('access_token', tokens.accessToken, {...cookieOptions, maxAge: 15 * 60 * 1000});
        res.cookie('refresh_token', tokens.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 3600 * 1000,
            path: '/api/auth'
        });
    }

    private clearCookies(res: Response) {
        const domain = this.configService.get('COOKIE_DOMAIN') === 'localhost' ? undefined : this.configService.get('COOKIE_DOMAIN');
        res.clearCookie('access_token', {path: '/', domain});
        res.clearCookie('refresh_token', {path: '/api/auth', domain});
    }
}
