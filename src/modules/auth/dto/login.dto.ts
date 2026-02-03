import {IsEmail, IsString, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
    @IsEmail({}, { message: 'Некорректный email' })
    email: string;

    @ApiProperty({ example: 'password', description: 'Пароль пользователя' })
    @IsString()
    @MinLength(6, { message: 'Минимальное кол-во символов 6' })
    password: string;
}